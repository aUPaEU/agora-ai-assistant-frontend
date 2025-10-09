import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

class ChatLoader extends PlainComponent {
    constructor() {
        super('agora-chat-loader', `${PATHS.BASE_COMPONENTS}/ChatLoader/ChatLoader.css`)
    }

    template() {
        return html`
            <div class="circle a"></div>
            <div class="circle b"></div>
            <div class="circle c"></div>
        `
    }
}

export default window.customElements.define('agora-chat-loader', ChatLoader)