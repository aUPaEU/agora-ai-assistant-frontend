import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"
import { marked } from "marked"

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
                <span class="bubble-content">${this.formatMarkdown(this.textContent)}</span>
                <div class="time">
                    <span class="separator"></span>
                    <span class="bubble-time">${this.formatTime(this.time.getState())}</span>
                </div>
            </div>
            ${this.author.getState() === 'user' ? html`<div class="little-bubble"></div>` : ``}
        `
    }

    formatTime(time) { 
        const hours = time.split(':')[0]
        const minutes = time.split(':')[1]
        const ampm = time.split(' ')[1]
        return `${hours}:${minutes} ${ampm.toLowerCase()}`
    }

    formatMarkdown(html) {
        marked.setOptions({
            gfm: true,  // Enable GitHub-Flavored Markdown
            breaks: true // Treat line breaks as actual `<br>` (optional)
          });

        return marked.parse(html.trim())
    }
}

export default window.customElements.define('agora-chat-bubble', ChatBubble)