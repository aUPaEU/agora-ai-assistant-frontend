import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

class ChatBubble extends PlainComponent {
    constructor() {
        super('agora-chat-bubble', `${PATHS.BASE_COMPONENTS}/ChatBubble/ChatBubble.css`)

        this.author = new PlainState(this.getAttribute('author'), this)
        this.time = new PlainState(this.getAttribute('time'), this)
    }

    template() {
        return html`
            ${this.author.getState() === 'bot' ? html`<div class="little-bubble"></div>` : ``}
            <div class="bubble ${this.author.getState()}">
                <span class="bubble-content">${this.textContent}</span>
                <div class="time">
                    <span class="separator"></span>
                    <span class="bubble-time">${this.time.getState()}</span>
                </div>
            </div>
            ${this.author.getState() === 'user' ? html`<div class="little-bubble"></div>` : ``}
        `
    }
}

export default window.customElements.define('agora-chat-bubble', ChatBubble)