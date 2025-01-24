import { PlainComponent, PlainState, PlainContext } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { LLM_CHAT_HISTORY } from "../../../data/mock.data"
import { html } from "../../../utils/templateTags.util"

class Chat extends PlainComponent {
    constructor() {
        super('agora-chat', `${PATHS.COMPLEX_COMPONENTS}/Chat/Chat.css`)

        this.resultContext = new PlainContext('result', this, false)
        this.chatContext = new PlainContext('chat', this, false)

        this.mockBotResponse = new PlainState(-1, this)

        // We could add a condition to just fold the chat initially
        // when there's no chat history.
        this.fold()
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

    sendMessage(message) {
        const botResponses = LLM_CHAT_HISTORY

        this.$('agora-chat-window').loading.setState(true)
        this.$('agora-chat-window').addMessage(message, 'user')

        this.storeMessageInContext(message, 'user')

        /* 

        // CLIENT REQUEST STRUCTURE (QUERY LLM)
        {
            agora_models: [
                {
                    parent_service: 'Student Catalogue',
                    parent_service_description: '........',
                    model_name: 'student.course',
                    model_description: "model_description + catalogue_description"
                }
            ],
            chat_history: chat_history (truncated to last N messages),
            user_input: "......."
        }

        */

        setTimeout(() => {
            if (this.mockBotResponse.getState() < botResponses.length - 1) {
                this.mockBotResponse.setState(
                    this.mockBotResponse.getState() + 1,
                    false
                )
            }

            this.handleBotResponse(botResponses[this.mockBotResponse.getState()])
        }, 1500)
        
    }

    handleBotResponse(response) {
        this.$('agora-chat-window').loading.setState(false)
        this.$('agora-chat-window').addMessage(response.message, 'bot')

        this.storeMessageInContext(response.message, 'bot')

        // Check if the response contains results
        // If it does, set the result context
        if (response.result) {
            // We set the result in the context
            this.resultContext.setData({data: response.result}, true)

            // We build the cards dynamically
            // We get the data from resultWindow component and we process it there
            // First we make all the api calls to retrieve the data we need (while this is happening, resultWindow still shows the loading spinner)
            // Once all the data is retrieved, we display it in the resultWindow
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

}

export default window.customElements.define('agora-chat', Chat)

