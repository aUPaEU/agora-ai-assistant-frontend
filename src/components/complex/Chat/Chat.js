import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { throwToast, TOAST_TYPES } from "../../../utils/errorHandling.util"
import { processJSONBuffer } from "../../../utils/parsingHelper.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"

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
        this.messageBuffer = new PlainState('', this)

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
            let messageHistory = this.formatMessageHistory()
            const resultHistory = this.formatResultHistory() 

            if (
                messageHistory.length === 1 && 
                messageHistory[0].content === message
            ) {
                messageHistory = []
            }

            const context = this.resultContext.getData('grouped').length > 0 
                ? [
                    `These resources are being displayed to the user (take them into account when answering and proposing follow-up questions):`,
                    ...this.resultContext.getData('grouped').map(group => {
                        return `Service: ${group.service}\n` + group.items.map(item => {
                            return ` - ${JSON.stringify(item)}\n`
                        }).join("\n")
                    }),
                    `Take into account the user's previous messages and the context provided by these resources when formulating your response.`,
                ].join("\n")
                : '(No resources displayed right now.)'

            const response = await api.sendMessageV3(
                this.configContext.getData('ai_host'),
                message,
                messageHistory,
                [
                    `You are a helpful assistant working for the university alliance ${this.configContext.getData('name')}.`,
                    `This site is the alliance Agora.`,
                    `An Agora is a service that serves as a central hub that provides access to services and resources offered by the alliance members.`,
                    `If the user asks for more information about the alliance, verify your response on the internet and provide accurate information.`,
                    `If the user ask for resources or related information use your retrieve capabilities to find the most relevant information.\n`,
                    `Use the provided context to answer the user's question as accurately as possible.`,
                    `If you don't know the answer, just say you don't know.`,
                    `Do not make up an answer.`,
                    `Always keep your answers concise and to the point.\n`,
                    `${context}`,
                ].join("\n")
            )

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            let isFirstChunk = true

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: !done })
                buffer += chunk
                
                let response = null    

                if (chunk.includes("[$artifact]:")) {
                    const artifact = JSON.parse(chunk.replace("[$artifact]:", "").replace(/'/g, '"'))
                    response = {
                        type: this.RESPONSE.RESULTS,
                        results: artifact
                    }
                    this.handleResponse(response)
                }
                else if (chunk.includes("[$done]:")) {
                    // Extract any message content before the [$done]: marker
                    const beforeDone = chunk.split("[$done]:")[0]
                    if (beforeDone) {
                        response = {
                            type: this.RESPONSE.MESSAGE,
                            is_first_chunk: isFirstChunk,
                            is_last_chunk: false,
                            message: beforeDone
                        }
                        this.handleResponse(response)
                        if (isFirstChunk) isFirstChunk = false
                    }
                    
                    // Signal the last chunk
                    response = {
                        type: this.RESPONSE.MESSAGE,
                        is_first_chunk: false,
                        is_last_chunk: true,
                        message: ''
                    }
                    this.handleResponse(response)
                }
                else {
                    response = {
                        type: this.RESPONSE.MESSAGE,
                        is_first_chunk: isFirstChunk,
                        is_last_chunk: false,
                        message: chunk
                    }
                    this.handleResponse(response)
                    if (isFirstChunk) isFirstChunk = false
                }
            }
            
            // If we exit the loop without receiving [$done]:, finalize the message
            if (!buffer.includes("[$done]:") && this.messageBuffer.getState()) {
                console.log("Storing message from `sendMessage` finalization.", this.messageBuffer.getState())
                this.storeMessageInContext(this.messageBuffer.getState(), 'bot')
                this.messageBuffer.setState('', false)
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
        if (!message || message.trim() === '') return

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
                "role": message.author === 'user' ? 'user' : 'ai',
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
                this.handleResultsV2(response.results)
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
                console.log(`Storing message from \`handleMessage\` final chunk.\n ${this.messageBuffer.getState()} "\n" + ${JSON.stringify(message)}`)
                this.storeMessageInContext(this.messageBuffer.getState() + message.message, 'bot')
                this.messageBuffer.setState('', false)
                return
            }

            this.messageBuffer.setState(this.messageBuffer.getState() + message.message, false)
    
            if (message.message) {
                this.$('agora-chat-window').updateStreamingMessage(message.message)
            }
        }

        catch (error) {
            console.error('Error handling message:', error)
        }
    }

    async handleResultsV2(artifact) {
        if (artifact.length == 0) return

        const updatedResultContext = {
            grouped: [],
            data: []
        }

        if (!this.shouldResetResults.getState()) {
            updatedResultContext.data = this.resultContext.getData('data') || []
            updatedResultContext.grouped = this.resultContext.getData('grouped') || []
        }

        if (this.shouldResetResults.getState()) this.shouldResetResults.setState(false, false)

        const availableWebsites = extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'websites')
        const flatWebsites = availableWebsites.flatMap(website => website.websites)
        const modelVerboseNames = {}

        // Create array of promises
        const elementPromises = artifact.map(async document => {
            modelVerboseNames[document.model] = flatWebsites.find(
                website => website.model === document.model
            )?.name || null

            const model = document.model
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

            if (!serviceData) return null

            // Fetch the element
            const element = await api.fetchElementV2(
                this.configContext.getData('host'),
                document.model,
                Number(document.source_id)
            )

            if (!element) return null

            // This code (ugly af) is to parse many2many fields to get the 'name' attribute of each related record
            // The reason why this is needed is because Odoo returns many2many fields as strings in Python syntax
            // Example: "['Record 1', 'Record 2']" or "[{'id': 1, 'name': 'Record 1'}, {'id': 2, 'name': 'Record 2'}]"
            // We need to convert them to JSON and then parse them to get the names
            Object.entries(element.fields).forEach(([key, value]) => {
                if (value.startsWith('[') || value.startsWith('{')) {
                    try {
                        // Store double-quoted strings temporarily
                        const doubleQuotedStrings = [];
                        
                        const jsonString = value
                            .replace(/\bTrue\b/g, 'true')
                            .replace(/\bFalse\b/g, 'false')
                            .replace(/\bNone\b/g, 'null')
                            // Capture and store existing double-quoted strings
                            .replace(/"((?:[^"\\]|\\.)*)"/g, (match, content) => {
                                doubleQuotedStrings.push(content);
                                return `<<<${doubleQuotedStrings.length - 1}>>>`;
                            })
                            // Convert single-quoted strings to double quotes
                            .replace(/'((?:[^'\\]|\\.)*)'/g, (match, content) => {
                                const escaped = content
                                    .replace(/\\'/g, "'")
                                    .replace(/"/g, '\\"');
                                return `"${escaped}"`;
                            })
                            // Restore original double-quoted strings
                            .replace(/<<<(\d+)>>>/g, (match, index) => {
                                return `"${doubleQuotedStrings[index]}"`;
                            });

                        const parsed = JSON.parse(jsonString);
                        element.fields[key] = parsed.name || value;
                    } catch (error) {
                        console.warn(`Could not parse field ${key} with value ${value} as JSON:`, error);
                    }
                }
            })

            let elementImageUrl = element.fields?.x_image || null
            elementImageUrl && (elementImageUrl = elementImageUrl.replace(this.configContext.getData('host'), ''))

            // Construct model_view_url by combining website and url, similar to handleResults
            const modelViewUrl = element.fields?.detail_url 
                ? serviceData.models[model].model_website + serviceData.models[model].model_view_url
                : null

            return {
                data: {
                    ...element.fields,
                    id: element.id,
                    image: elementImageUrl
                },
                featured: element.fields?.featured || false,
                featured_fields: ["web_link", "url", "website"],
                model: document.model,
                model_verbose_name: modelVerboseNames[document.model] || null,
                model_view_url: modelViewUrl,
                roots: [],
                score: {
                    absolute: null,
                    relative: null
                },
                service: serviceData.service,
            }
        })

        // Wait for all promises to resolve
        const results = (await Promise.all(elementPromises)).filter(result => result !== null)

        // Add new processed results to existing data
        updatedResultContext.data = updatedResultContext.data.concat(results)

        // Group data by service
        const services = [...new Set(updatedResultContext.data.map(result => result.service))].sort()

        const groupedData = services.map(service => {
            const items = updatedResultContext.data.filter(result => result.service === service)
            return {
                service: service,
                items: items
            }
        })

        // Update the result context with the new results
        this.resultContext.setData({
            grouped: groupedData,
            data: updatedResultContext.data,
        }, true)

        this.signals.emit('results-updated', groupedData)
    }

    /* Not being used anymore */
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
                        image: `/web/image?model=${serviceData.models[model].model}&id=${result.properties._source_id}&field=x_image`,
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

