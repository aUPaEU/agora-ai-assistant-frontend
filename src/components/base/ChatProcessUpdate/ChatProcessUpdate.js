import { PlainComponent, PlainState, PlainSignal, PlainContext, PlainRouter} from 'plain-reactive'
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"
import { CHAT_PROCESS_UPDATE } from '../../../icons/icons'

class ChatProcessUpdate extends PlainComponent {
    constructor() {
        // The relative path is from the entry point of the App (index.html)
        super(`agora-chat-process-update`, `${PATHS.BASE_COMPONENTS}/ChatProcessUpdate/ChatProcessUpdate.css`)

        this.message = new PlainState(null, this)
    }

    template() {
        if (!this.message.getState()) return ``

        return html`
            ${
                this.message.getState().split('').map((char, index) => {
                    if (char === ' ') {
                        return html`<div class="space">&nbsp</div>`
                    }

                    return html`<div class="char" style="animation-delay: ${index * 0.1}s">${char}</div>`
                }).join('')
            }
            <!-- <video width="25" height="25" autoplay muted loop playsinline>
                <source src="${PATHS.PUBLIC}/assets/videos/ai-assistant-loader.webm" type="video/webm">
            </video> -->
            ${
                CHAT_PROCESS_UPDATE
            }
        `
    }

    update(message) {
        this.message.setState(message)
    }

    clear() {
        this.message.setState(null)
    }
}

export default window.customElements.define('agora-chat-process-update', ChatProcessUpdate) 