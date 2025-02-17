import { CONFIG } from "../../../../agora.config"
import { PlainComponent, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

class Greetings extends PlainComponent {
    constructor() {
        super('agora-greetings', `${PATHS.BASE_COMPONENTS}/Greetings/Greetings.css`)

        this.resultContext = new PlainContext('result', this, true)
    }

    template() {
        this.getAttribute('hidden')
            ? this.wrapper.classList.add('hidden')
            : this.wrapper.classList.remove('hidden')
        
        return html`
            <!-- Greetings -->
            <div class="welcome-message">
                <span>Welcome to</span> 
                <div class="logo">
                    <span class="agora-name">Agora</span>
                    <span class="alliance-name">${CONFIG.name}</span>
                </div>
            </div>
            <span>How could I help you?</span>
            <p class="greetings-description">
                You can navigate directly through our acceleration services 
                or ask our assistant to guide you through the process of finding the right resources.
            </p>
        `
    }

    hide() {
        this.wrapper.classList.add('hidden')
    }

    unhide() {
        this.wrapper.classList.remove('hidden')
    }
}

export default window.customElements.define('agora-greetings', Greetings)