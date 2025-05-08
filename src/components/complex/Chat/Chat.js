import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import { throwToast, TOAST_TYPES } from "../../../utils/errorHandling.util"

/* Services */
import * as api from "../../../services/api.service"

class Chat extends PlainComponent {
    constructor() {
        super('agora-chat', `${PATHS.COMPLEX_COMPONENTS}/Chat/Chat.css`)
        this.signals = new PlainSignal(this)
        this.signals.register('results-updated')

        this.configContext = new PlainContext('config', this, false)
        this.resultContext = new PlainContext('result', this, false)
        this.chatContext = new PlainContext('chat', this, false)
        this.serviceContext = new PlainContext('service', this, false)

        this.mockBotResponse = new PlainState(-1, this)

        if (this.chatHistoryIsEmpty()) this.fold()
    }

    template() {
        return html`
            <agora-chat-window></agora-chat-window>
            <agora-chat-input></agora-chat-input>
        `
    }

    unfold() {
        this.wrapper.classList.remove('folded')
    }

    fold() {
        this.wrapper.classList.add('folded')
    }

    toogleFold() {
        this.wrapper.classList.toggle('folded')
    }

    formatChatHistoryForLLM() {
        const chatHistory = this.chatContext.getData('history')

        if (!chatHistory) return []

        const chunkSize = 2

        let history = []

        for (let i = 0; i < chatHistory.length; i += 2) {
            const chunk = chatHistory.slice(i, i + chunkSize)
            history.push({
                "user": chunk[0]?.content || '',
                "assistant": chunk[1]?.content || '',
            })
        }

        return history
    }

    async sendMessage(message) {
        const availableModels = this.serviceContext.getData('models')

        const formattedChatHistory = this.formatChatHistoryForLLM()

        this.$('agora-chat-window').addMessage(message, 'user')
        this.setLoading(true)

        try {
            this.storeMessageInContext(message, 'user')
            const botResponse = await api.sendMessage(
                this.configContext.getData('host'), 
                'openai',
                message, 
                availableModels, 
                formattedChatHistory
            )
    
            this.handleBotResponse(botResponse.result)
        }

        catch (error) {
            throwToast('Error sending message to the AI server.\nPlease try again later.', TOAST_TYPES.ERROR)
            // TODO: Aquí añadiríamos un boton en el útlimo chatBubble para que el usuario pueda intentar enviar el mensaje de nuevo
            console.error('Error sending message:', error)
            this.storeMessageInContext(message, 'user')
            this.setLoading(false)
        }

    }

    setLoading(state) {
        this.$('agora-chat-window').loading.setState(state)
        this.$('agora-chat-input').$('input').classList.toggle('blocked', state)
        this.$('agora-chat-input').$('input').disabled = state
        this.$('agora-chat-input').$('input').setAttribute('placeholder', state ? 'Waiting for response...' : 'Type your message...')
    }

    handleBotResponse(response) {
        console.log("RESPONSE", response)
        if (!response.message) return 

        this.$('agora-chat-window').addMessage(response.message, 'bot')
        this.setLoading(false)

        this.storeMessageInContext(response.message, 'bot')

        const updatedResultContext = {
            grouped: [],
            data: []
        }

        /* BUILD RESPONSE OBJECT */
        // 1. The data
        if (Object.entries(response.result).length > 0) {
            const data = []
            const grouped = {}
            
            Object.entries(response.result).forEach(([model, records]) => {
                console.log("STRUCTURING DATA FOR MODEL", model)

                let serviceData = null
                this.serviceContext.getData('services').forEach(service => {
                    const serviceWebsites = service.fields?.catalogues?.websites
                    if (!serviceWebsites) return false

                    const serviceModels = {}
                    serviceWebsites.forEach(website => {
                        if (!website.model) return

                        const modelData = {
                            model: website.model,
                            model_verbose_name: website.model_verbose_name,
                            model_website: website.website,
                            model_view_url: website.url,
                            model_view_id: website.view_id,
                        }

                        serviceModels[website.model] = modelData
                    })

                    console.log("SERVICE MODELS", serviceModels)

                    if (model in serviceModels) {
                        console.log("MODEL IN SERVICE MODELS", model in serviceModels)

                        serviceData = {
                            service: service.fields.name,
                            models: serviceModels
                        }

                    }
                })

                console.log("SERVICE", serviceData)

                if (!grouped[serviceData.service]) grouped[serviceData.service] = []

                records.forEach(record => {
                    if ([false, 'false', 0, '0', null, undefined].includes(record.rag.include)) return // THIS SHOULD BE DONE EXCLUSIVELY IN THE RAG SERVICE

                    const recordData = {
                        "model": model,
                        "model_verbose_name": serviceData.models[model].model,
                        "model_view_url": serviceData.models[model].model_website + serviceData.models[model].model_view_url,
                        "service": serviceData.service,
                        "featured_fields": record.rag.relevant_fields,
                        "featured": false,
                        "data": {
                            ...record.properties,
                            id: record.properties._source_id,
                            image: `/web/image?model=${serviceData.models[model].model}&id=${record.properties._source_id}&field=image`,
                            rag: record.rag
                        },
                        "roots": [],
                        "score": {
                            "absolute": Number(record.rag.score) / 10,
                            "relative": Number(record.rag.score) / 10
                        }
                    }

                    data.push(recordData)
                    grouped[serviceData.service].push(recordData)
                })
            })

            updatedResultContext.data = data
            Object.entries(grouped).forEach(([service, items]) => {
                updatedResultContext.grouped.push({
                    service: service,
                    items: items
                })
            })

            this.resultContext.setData(updatedResultContext, true)
            this.signals.emit('results-updated', updatedResultContext.grouped)
        }

        // 2. The grouped data

        // Check if the response contains results
        // If it does, set the result context
        if (response.result == 'nononono') {
            console.log("1. Response contains results")
            const results = response.result.filter(result => {
                return result.element_ids.length > 0
            })

            console.log("2. Filtered (not empty) results are:", results)

            if (results.length > 0) {
                console.log("3. Results are not empty")

                const serviceModels = [...new Set(this.serviceContext.getData('services').map((service) => {
                    return {
                        "service": service.fields.name,
                        "models": extractObjectsWithMatchingKey(service, 'model').map(model => model.model)
                    }
                }))]
    
                console.log("serviceModels", serviceModels)

                results.forEach(result => {
                    const resultService = serviceModels.find(service => service.models.includes(result.model)).service
                    result.service = resultService
                })

                this.resultContext.setData({data: response.result}, true)
                return 
            }
        }
    }

    storeMessageInContext(message, author) {
        const chatHistory = this.chatContext.getData('history')

        if (!chatHistory) {
            this.chatContext.setData({history: [{content: message, author: author, time: new Date().toLocaleTimeString()}]})
        }

        else {
            chatHistory.push({content: message, author: author, time: new Date().toLocaleTimeString()})
            this.chatContext.setData({history: chatHistory})
        }
    }

    chatHistoryIsEmpty() {
        if (!this.chatContext.getData('history')) return true
        return this.chatContext.getData('history').length === 0
    }
}

export default window.customElements.define('agora-chat', Chat)

