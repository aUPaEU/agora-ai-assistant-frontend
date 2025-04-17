import { PlainComponent, PlainState, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import { throwToast, TOAST_TYPES } from "../../../utils/errorHandling.util"

/* Services */
import * as api from "../../../services/api.service"

/* Mock data */
import { LLM_CHAT_HISTORY } from "../../../data/mock.data"

class Chat extends PlainComponent {
    constructor() {
        super('agora-chat', `${PATHS.COMPLEX_COMPONENTS}/Chat/Chat.css`)

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
                "user": chunk[1].content,
                "assistant": chunk[0].content,
            })
        }

        return history
    }

    async sendMessage(message) {
        const availableModels = this.serviceContext.getData('models').map(model => {
            const featuredElementIds = this.resultContext.getData('data') ? this.resultContext.getData('data').find(result => {
                return result.model === model.model 
            }) : null

            return {
                "model": model,
                "description": "This is the model description",
                "featured_element_ids": featuredElementIds ? featuredElementIds.featured_element_ids : []
            }
        })

        const formattedChatHistory = this.formatChatHistoryForLLM()

        this.$('agora-chat-window').addMessage(message, 'user')
        this.setLoading(true)

        try {
            const botResponse = await api.sendMessage(
                this.configContext.getData('host'), 
                message, 
                availableModels, 
                formattedChatHistory
            )
    
            this.handleBotResponse(botResponse.result)
            this.storeMessageInContext(message, 'user')
        }

        catch (error) {
            throwToast('Error sending message to the AI server.\nPlease try again later.', TOAST_TYPES.ERROR)
            // TODO: Aquí añadiríamos un boton en el útlimo chatBubble para que el usuario pueda intentar enviar el mensaje de nuevo
            console.error('Error sending message:', error)
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

        // Check if the response contains results
        // If it does, set the result context
        if (response.result) {
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

