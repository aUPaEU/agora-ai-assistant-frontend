import { PlainComponent, PlainState, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"

/* Services */
import * as api from "../../../services/api.service"

/* Mock data */
import { LLM_CHAT_HISTORY } from "../../../data/mock.data"

class Chat extends PlainComponent {
    constructor() {
        super('agora-chat', `${PATHS.COMPLEX_COMPONENTS}/Chat/Chat.css`)

        this.resultContext = new PlainContext('result', this, false)
        this.chatContext = new PlainContext('chat', this, false)
        this.serviceContext = new PlainContext('service', this, false)

        this.mockBotResponse = new PlainState(-1, this)

        if (!this.chatHistoryIsEmpty()) this.unfold()
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
                "user": chunk[0].content,
                "assistant": chunk[1].content,
            })
        }

        return history
    }

    async sendMessage(message) {
        const availableModels = extractObjectsWithMatchingKey(
            this.serviceContext.getData('services'),
            'model'
        ).map(model => {
            const featuredElementIds = this.resultContext.getData('data') ? this.resultContext.getData('data').find(result => {
                return result.model === model.model 
            }) : null

            return {
                "model": model.model,
                "description": "This is the model description",
                "featured_element_ids": featuredElementIds ? featuredElementIds.featured_element_ids : []
            }
        })

        const formattedChatHistory = this.formatChatHistoryForLLM()

        this.$('agora-chat-window').addMessage(message, 'user')
        this.storeMessageInContext(message, 'user')
        this.setLoading(true)

        const botResponse = await api.sendMessage(message, availableModels, formattedChatHistory)

        this.handleBotResponse(botResponse.result)
        
        // This is for testing purposes with a mock response
        /* const botResponses = LLM_CHAT_HISTORY
        setTimeout(() => {
            if (this.mockBotResponse.getState() < botResponses.length - 1) {
                this.mockBotResponse.setState(
                    this.mockBotResponse.getState() + 1,
                    false
                )
            }

            this.handleBotResponse(botResponses[this.mockBotResponse.getState()])
        }, 1500) */
        
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

            console.log("2. Filtered results", results)

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

