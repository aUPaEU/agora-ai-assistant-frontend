import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
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
        this.shouldResetResults = new PlainState(false, this)

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

    listeners() {
        // Listen for clicks on document to detect outside clicks
        this.boundHandleClick = this.handleClick.bind(this)
        document.addEventListener('click', this.boundHandleClick)
    }

    handleClick(e) {
        // Use composedPath() to get the full event path including shadow DOM
        const path = e.composedPath()
        
        // Check if this component is in the event path
        const clickedInsideComponent = path.includes(this)
        
        if (!clickedInsideComponent) {
            // Only fold if the chat is currently unfolded
            if (!this.wrapper.classList.contains('folded')) {
                this.fold()
            }
        }
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

    async sendMessage(message) {
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
                
                buffer = processJSONBuffer(buffer, false, (json) => this.handleResponse(json))
            }
            
            // Process any remaining data in buffer
            if (buffer.trim()) {
                processJSONBuffer(buffer, true, (json) => this.handleResponse(json))
            }
        }

        catch (error) {
            this.handleError(error)
        }

        finally {
            this.shouldResetResults.setState(true, false)
        }
    }

    setLoading(state) {
        this.$('agora-chat-window').loading.setState(state)
        this.$('agora-chat-input').$('input').classList.toggle('blocked', state)
        this.$('agora-chat-input').$('input').disabled = state
        this.$('agora-chat-input').$('input').setAttribute('placeholder', state ? 'Waiting for response...' : 'Type your message...')
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
    handleResponse(response) {
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

        if (!this.shouldResetResults.getState()) {
            updatedResultContext.data = this.resultContext.getData('data') || []
            updatedResultContext.grouped = this.resultContext.getData('grouped') || []
        }

        if (this.shouldResetResults.getState()) this.shouldResetResults.setState(false, false)

        // Build response object
        if (results.length > 0) {
            const processedResults = []
            
            results.forEach((result) => {
                const model = result.properties._source_model

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

                    if (model in serviceModels) {
                        serviceData = {
                            service: service.fields.name,
                            models: serviceModels
                        }
                    }
                })

                if (!serviceData) return

                // Filter based on RAG include flag (should be done exclusively in the RAG service)
                if ([false, 'false', 0, '0', null, undefined].includes(result.rag.include)) return 

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

                processedResults.push(recordData)
            })

            // Add new processed results to existing data
            updatedResultContext.data = updatedResultContext.data.concat(processedResults)

            // Group data by service (following Searchbar logic exactly)
            const services = [...new Set(updatedResultContext.data.map(result => result.service))].sort()

            const groupedData = (() => {
                return services.map(service => {
                    const items = updatedResultContext.data.filter(result => result.service === service)
                    return {
                        service: service,
                        items: items
                    }
                })
            })()

            // Update the result context with the new results (exactly like Searchbar)
            this.resultContext.setData({
                grouped: groupedData,
                data: updatedResultContext.data,
            }, true)

            this.signals.emit('results-updated', groupedData)
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

