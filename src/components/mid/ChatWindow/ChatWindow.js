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

        this.signals = new PlainSignal(this)
        this.signals.register('results-updated')

        this.load()
    }

    template() {
        return html`
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
            <div 
                class="clear-chat-button ${this.messages.getState().length === 1 ? 'fade-in' : ''}" 
                style="${this.messages.getState().length > 0 ? '' : 'display: none;'}"
            >
                ${CLEAR_CHAT}
            </div>
        `
    }

    listeners() {
        this.$('.clear-chat-button').onclick = () => this.clear()
    }

    addMessage(message, author) {
        const newMessage = {
            content: message,
            time: new Date().toLocaleTimeString(),
            author: author
        }

        this.messages.setState([...this.messages.getState(), newMessage])
        this.scrollToBottom()
    }

    scrollToBottom() {
        this.wrapper.scrollTo({
            top: this.wrapper.scrollHeight,
            behavior: 'smooth'
        })
    }

    load() {
        const chatHistory = this.chatContext.getData('history')
        if (!chatHistory) return

        this.messages.setState(chatHistory, false)
    }

    clear() {
        this.chatContext.setData({history: []}, false)
        this.messages.setState([])

        this.signals.emit('results-updated')
    }
}

export default window.customElements.define('agora-chat-window', ChatWindow)