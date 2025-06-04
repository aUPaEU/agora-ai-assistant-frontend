import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import { throwToast, TOAST_TYPES } from "../../../utils/errorHandling.util"
import { processJSONBuffer } from "../../../utils/parsingHelper.util"

/* Services */
import * as api from "../../../services/api.service"

// TODO: Detect when results should be refresed or appended
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

        this.PROVIDERS = {
            OPENAI: 'openai',
            ANTHROPIC: 'anthropic',
            GEMINI: 'gemini',
            GROQ: 'groq',
            OLLAMA: 'ollama',
        }

        this.RESPONSE = {
            MESSAGE: 'message',
            RESULTS: 'results',
            PROCESS_STARTED: 'process_started',
            PROCESS_FINISHED: 'process_finished',
            ERROR: 'error',
        }

        if (this.chatHistoryIsEmpty()) this.fold()
    }

    template() {
        return html`
            <agora-chat-process-update></agora-chat-process-update>
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

    formatMessageForLLMV2(message) {
        const chatHistory = this.chatContext.getData('history')

        if (!chatHistory) return []

        const formattedChatHistory = chatHistory.map(message => {
            return {
                "role": message.author,
                "content": message.content
            }
        })

        return formattedChatHistory
    }

    async sendMessage(message) {
        const availableModels = this.serviceContext.getData('models')
        const formattedChatHistory = this.formatMessageForLLMV2(message)

        this.$('agora-chat-window').addMessage(message, 'user')
        this.setLoading(true)

        try {
            this.storeMessageInContext(message, 'user')

            const botResponse = await api.sendMessage(
                this.configContext.getData('host'), 
                this.PROVIDERS.OPENAI,
                message, 
                availableModels, 
                formattedChatHistory
            )

            if (botResponse.body instanceof ReadableStream) {
                const reader = botResponse.body.getReader()
                const decoder = new TextDecoder()

                let streamMessageIsCreated = false

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value, { stream: true })
                    this.handleStreamingResponse(chunk, streamMessageIsCreated)
                    streamMessageIsCreated = true
                }
            }
            else {
                this.handleResponse(botResponse.result)
            }
        }

        catch (error) {
            throwToast('Error sending message to the AI server.\nPlease try again later.', TOAST_TYPES.ERROR)
            // TODO: Aquí añadiríamos un boton en el útlimo chatBubble para que el usuario pueda intentar enviar el mensaje de nuevo
            console.error('Error sending message:', error)
            this.storeMessageInContext(message, 'user')
            this.setLoading(false)
        }

    }

    async sendMessageV2(message) {
        this.setLoading(true)
        this.$('agora-chat-window').addMessage(message, 'user')

        try {
            this.storeMessageInContext(message, 'user')

            const availableModels = this.formatAvailableModels()
            const messageHistory = this.formatMessageHistory()
            const resultHistory = this.formatResultHistory()

            const response = await api.sendMessageV2(
                this.configContext.getData('ai_host'),
                this.PROVIDERS.OPENAI,
                message,
                availableModels, 
                messageHistory, 
                resultHistory
            )

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                buffer += chunk
                
                buffer = processJSONBuffer(buffer, false, (json) => this.handleResponseV2(json))
            }
            
            // Process any remaining data in buffer
            if (buffer.trim()) {
                processJSONBuffer(buffer, true, (json) => this.handleResponseV2(json))
            }
        }

        catch (error) {
            this.handleError(error)
        }
    }

    setLoading(state) {
        this.$('agora-chat-window').loading.setState(state)
        this.$('agora-chat-input').$('input').classList.toggle('blocked', state)
        this.$('agora-chat-input').$('input').disabled = state
        this.$('agora-chat-input').$('input').setAttribute('placeholder', state ? 'Waiting for response...' : 'Type your message...')
    }

    async handleStreamingResponse(stream, streamMessageIsCreated) {
        try {
            if (!streamMessageIsCreated) {
                console.log("CREATING STREAMING MESSAGE")
                this.$('agora-chat-window').addMessage('', 'bot')
                this.setLoading(false)
            }

            const chunks = stream.split('\n').filter(line => line.trim())

            if (chunks.length === 0) return
            
            for (const chunk of chunks) {
                try {
                    const response = JSON.parse(chunk);

                    if (response.finished) {
                        this.storeMessageInContext(response.content, 'bot')
                        return 
                    }
                    
                    if (response.content) {
                        console.log("UPDATING STREAMING MESSAGE")
                        this.$('agora-chat-window').updateStreamingMessage(response.content)
                    }

                } catch (parseError) {
                    console.warn('Error parsing individual JSON object:', parseError);
                }
            }
        } catch (error) {
            console.error('Error handling streaming response:', error);
        }
    }

    handleResponse(response) {
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
                        if (website.model !== model) return
                        
                        const modelData = {
                            model: website.model,
                            model_verbose_name: website.model_verbose_name,
                            model_website: website.website,
                            model_view_url: website.url,
                            model_view_id: website.view_id,
                        }

                        serviceModels[website.model] = modelData
                    })

                    console.log("SERVICE MODELS FOR SERVICE", service.fields.name, serviceModels)

                    if (model in serviceModels) {
                        console.log("MODEL IN SERVICE MODELS", model in serviceModels)

                        serviceData = {
                            service: service.fields.name,
                            models: serviceModels
                        }

                    }
                })

                console.log("SERVICE", serviceData)

                if (!serviceData) return
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

    // -------------------------------
    // PAYLOAD FORMATTERS
    // -------------------------------
    formatAvailableModels() {
        return Object.entries(this.serviceContext.getData('modelsByService')).map(([service, data]) => {
            if (data.models.length === 0) return []

            return data.models.map(model => {
                return {
                    name: model,
                    description: `This model belongs to the service ${service}. Service description: ${data.description}`
                }
            })
        }).flat()
    }
    
    formatMessageHistory() {
        const chatHistory = this.chatContext.getData('history')

        if (!chatHistory) return []

        const formattedChatHistory = chatHistory.map(message => {
            return {
                "role": message.author,
                "content": message.content
            }
        })

        return formattedChatHistory
    }

    formatResultHistory() {
        // TODO: Implement storage of result history in the local storage (together with the search queries history)
        return []
    }

    // -------------------------------
    // RESPONSE HANDLERS
    // -------------------------------
    handleResponseV2(response) {
        switch (response.type) {
            case this.RESPONSE.MESSAGE:
                this.handleMessage(response)
                break

            case this.RESPONSE.RESULTS:
                this.handleResults(response.results)
                break

            case this.RESPONSE.PROCESS_STARTED:
                this.handleProcessUpdate(response.message)
                break

            case this.RESPONSE.PROCESS_FINISHED:
                this.handleProcessUpdate()
                break

            case this.RESPONSE.ERROR:
                this.handleError(response)
                break
        }
    }

    handleMessage(message) {
        if (message.is_first_chunk) {
            this.$('agora-chat-window').addMessage('', 'bot')
            this.setLoading(false)
        }

        try {
            if (message.is_last_chunk) {
                this.storeMessageInContext(message.message, 'bot')
                return 
            }
    
            if (message.message) {
                this.$('agora-chat-window').updateStreamingMessage(message.message)
            }
        }

        catch (error) {
            console.error('Error handling message:', error)
        }
    }

    handleResults(results) {
        const updatedResultContext = {
            grouped: [],
            data: []
        }

        updatedResultContext.data = this.resultContext.getData('data') || []
        updatedResultContext.grouped = this.resultContext.getData('grouped') || []

        console.log(results)

        /* BUILD RESPONSE OBJECT */
        // 1. The data
        if (results.length > 0) {
            const data = []
            const grouped = {}
            
            results.forEach((result) => {
                const model = result.properties._source_model
                console.log("STRUCTURING DATA FOR MODEL", model)

                let serviceData = null
                this.serviceContext.getData('services').forEach(service => {
                    const serviceWebsites = service.fields?.catalogues?.websites
                    if (!serviceWebsites) return false

                    const serviceModels = {}
                    serviceWebsites.forEach(website => {
                        if (!website.model) return
                        if (website.model !== model) return
                        
                        const modelData = {
                            model: website.model,
                            model_verbose_name: website.model_verbose_name,
                            model_website: website.website,
                            model_view_url: website.url,
                            model_view_id: website.view_id,
                        }

                        serviceModels[website.model] = modelData
                    })

                    console.log("SERVICE MODELS FOR SERVICE", service.fields.name, serviceModels)

                    if (model in serviceModels) {
                        console.log("MODEL IN SERVICE MODELS", model in serviceModels)

                        serviceData = {
                            service: service.fields.name,
                            models: serviceModels
                        }

                    }
                })

                console.log("SERVICE", serviceData)

                if (!serviceData) return
                if (!grouped[serviceData.service]) grouped[serviceData.service] = []

                console.log("DATA", serviceData)
                console.log("GROUPED", grouped)

                if ([false, 'false', 0, '0', null, undefined].includes(result.rag.include)) return // THIS SHOULD BE DONE EXCLUSIVELY IN THE RAG SERVICE

                const recordData = {
                    "model": model,
                    "model_verbose_name": serviceData.models[model].model,
                    "model_view_url": serviceData.models[model].model_website + serviceData.models[model].model_view_url,
                    "service": serviceData.service,
                    "featured_fields": result.rag.relevant_fields,
                    "featured": false,
                    "data": {
                        ...result.properties,
                        id: result.properties._source_id,
                        image: `/web/image?model=${serviceData.models[model].model}&id=${result.properties._source_id}&field=image`,
                        rag: result.rag
                    },
                    "roots": [],
                    "score": {
                        "absolute": Number(result.rag.score) / 10,
                        "relative": Number(result.rag.score) / 10
                    }
                }

                data.push(recordData)
                grouped[serviceData.service].push(recordData)
            })

            console.log("DATA", data)

            updatedResultContext.data = updatedResultContext.data.concat(data)
            updatedResultContext.grouped = updatedResultContext.grouped.concat(grouped)

            this.resultContext.setData(updatedResultContext, true)
            this.signals.emit('results-updated', updatedResultContext.grouped)
        }
    }

    handleProcessUpdate(processMessage = null) {
        if (processMessage) {
            this.$('agora-chat-process-update').update(processMessage)
        }
        else {
            this.$('agora-chat-process-update').clear()
        }
    }

    handleError(error) {
        throwToast('Error sending message to the AI server.\nPlease try again later.', TOAST_TYPES.ERROR)
        console.error('Error sending message:', error)

        // TODO: Aquí añadiríamos un boton en el útlimo chatBubble para que el usuario pueda intentar enviar el mensaje de nuevo
        this.storeMessageInContext(message, 'user')
        this.setLoading(false)
    }
}

export default window.customElements.define('agora-chat', Chat)

