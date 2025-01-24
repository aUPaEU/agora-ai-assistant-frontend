import { PlainComponent, PlainContext } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

class Greetings extends PlainComponent {
    constructor() {
        super('agora-greetings', `${PATHS.BASE_COMPONENTS}/Greetings/Greetings.css`)

        this.resultContext = new PlainContext('result', this, true)
    }

    template() {
        const results = this.resultContext.getData('data')
        results && results.length > 0 
            ? this.wrapper.classList.add('hidden')
            : this.wrapper.classList.remove('hidden')
        
        return html`
            <!-- Greetings -->
            <div class="welcome-message">
                <span>Welcome to</span> 
                <div class="logo">
                    <span class="agora-name">Agora</span>
                    <span class="alliance-name">Unite!</span>
                </div>
            </div>
            <span>How could I help you?</span>
            <p class="greetings-description">
                You can navigate directly through our acceleration services 
                or ask our assistant to guide you through the process of finding the right resources.
            </p>
        `
    }
}

export default window.customElements.define('agora-greetings', Greetings)