import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"
import { SEND_MESSAGE, AUPAEU_LOGO } from "../../../icons/icons"

class ChatInput extends PlainComponent {
    constructor() {
        super('agora-chat-input', `${PATHS.BASE_COMPONENTS}/ChatInput/ChatInput.css`)
    }

    template() {
        return html`
            <input type="text" placeholder="Type your message...">
            <!-- <button class="send-button">${SEND_MESSAGE}</button> -->
            <button class="send-button">
                ${AUPAEU_LOGO}
            </button>
        `
    }

    listeners() {
        this.$('input').onkeydown = (e) => this.handleIntro(e)
        this.$('input').onfocus = () => this.parentComponent.unfold()
        /* this.$('input').onblur = () => this.parentComponent.fold() */

        this.$('.send-button').onclick = () => this.parentComponent.toogleFold()
        /* this.$('.send-button').onclick = () => this.sendMessage() */
    }

    handleIntro(e) {
        if (e.key !== 'Enter') return
        this.sendMessage()
    }

    sendMessage() {
        this.animateClick()
        if (this.$('input').value.length === 0) return

        //this.parentComponent.sendMessage(this.$('input').value)
        this.parentComponent.sendMessageV2(this.$('input').value)

        this.$('input').value = ''
        //this.$('agora-button').animateClick()
    }

    animateClick() {
        this.$('.send-button').classList.add('clicked')
        this.$('.send-button').onanimationend = () => this.$('.send-button').classList.remove('clicked')
    }
}

export default window.customElements.define('agora-chat-input', ChatInput)