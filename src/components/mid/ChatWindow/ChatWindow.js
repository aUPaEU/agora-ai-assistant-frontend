import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { CLEAR_CHAT } from "../../../icons/icons"

class ChatWindow extends PlainComponent {
    constructor() {
        super('agora-chat-window', `${PATHS.MID_COMPONENTS}/ChatWindow/ChatWindow.css`)

        this.chatContext = new PlainContext('chat', this, false)

        this.loading = new PlainState(false, this)
        this.messages = new PlainState([], this)
        this.defaultPrompts = [
            'Show me infrastructures',
            'How can you help me?',
            'I\'m looking for projects',
            'I want the latest featured projects',
            'Show me courses'
        ]

        this.signals = new PlainSignal(this)
        this.signals.register('results-updated')

        this.load()
    }

    template() {
        return html`
            <div 
                class="actions-wrapper"
                style="${this.messages.getState().length > 0 ? '' : 'display: none;'}"
            >
                <!-- Clear chat button -->
                <div class="clear-chat-button ${this.messages.getState().length === 1 ? 'fade-in' : ''}">
                    ${CLEAR_CHAT}
                </div>
            </div>

            <!-- Chat container -->
            <div class="chat-container">
                ${this.messages.getState().map((message) => html`
                    <agora-chat-bubble 
                        author="${message.author}" 
                        time="${message.time}"
                    >
                        ${message.content}
                    </agora-chat-bubble>
                `).join('')}
                ${this.loading.getState() ? html`<agora-chat-loader></agora-chat-loader>` : ``}
            </div>
            
            <!-- Default prompts -->
            <div 
                class="default-prompt-wrapper"
                style="${this.messages.getState().length > 0 ? 'display: none;' : ''}"
            >
                ${this.defaultPrompts.map(prompt => html`
                    <span class="prompt">${prompt}</span>
                `).join('')}
            </div>
        `
    }

    afterRender() {
        if (this.$('.chat-container') && this.$('.chat-container').scrollHeight > 0) {
            this.$('.chat-container').scrollTop = this.$('.chat-container').scrollHeight
        }
    }

    listeners() {
        this.$('.clear-chat-button').onclick = () => this.clear()

        this.$$('.prompt').forEach(prompt => {
            prompt.onclick = () => this.addPrompt(prompt.innerText)
        })
    }

    addPrompt(prompt) {
        this.parentComponent.sendMessage(prompt)
    }

    addMessage(message, author) {
        const newMessage = {
            content: message,
            time: new Date().toLocaleTimeString(),
            author: author
        }

        this.messages.setState([...this.messages.getState(), newMessage])

        this.scrollToBottom(true)
    }

    updateStreamingMessage(message) {
        const lastMessage = this.messages.getState()[this.messages.getState().length - 1]
        lastMessage.content += message
        this.messages.setState(this.messages.getState())
    }

    scrollToBottom(smooth) {
        setTimeout(() => {
            const container = this.$('.chat-container');
            container.scrollTo({
                top: container.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            })
        }, 100)
    }

    load() {
        const chatHistory = this.chatContext.getData('history')
        if (!chatHistory) return

        this.messages.setState(chatHistory, false)

        this.scrollToBottom(false)
    }

    clear() {
        this.chatContext.setData({history: []}, false)
        this.messages.setState([])

        this.signals.emit('results-updated')
    }
}

export default window.customElements.define('agora-chat-window', ChatWindow)