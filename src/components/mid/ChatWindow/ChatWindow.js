import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"
import { gsap } from "gsap"

class ChatWindow extends PlainComponent {
    constructor() {
        super('agora-chat-window', `${PATHS.MID_COMPONENTS}/ChatWindow/ChatWindow.css`)

        this.loading = new PlainState(false, this)
        this.messages = new PlainState([], this)
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
        `
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
}

export default window.customElements.define('agora-chat-window', ChatWindow)