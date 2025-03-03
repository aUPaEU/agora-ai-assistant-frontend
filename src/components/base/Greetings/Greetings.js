import { PlainComponent, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

class Greetings extends PlainComponent {
    constructor() {
        super('agora-greetings', `${PATHS.BASE_COMPONENTS}/Greetings/Greetings.css`)

        this.configContext = new PlainContext('config', this, false)
        this.resultContext = new PlainContext('result', this, true)
    }

    template() {
        this.getAttribute('hidden')
            ? this.wrapper.classList.add('hidden')
            : this.wrapper.classList.remove('hidden')

        return html`
            <!-- Greetings -->
            <div class="welcome-message">
                <span class="default-welcome">Welcome</span> 
                <div class="logo">
                    <span class="agora-name">Agora</span>
                    <span class="alliance-name">${this.configContext.getData('name')}</span>
                </div>
                <span class="multilanguage-welcome">
                    <span>WELCOME</span>
                    <span style="animation-delay: 0.5s">BIENVENUE</span>
                    <span style="animation-delay: 1s">TERVETULOA</span>
                    <span style="animation-delay: 1s">BIENVENUE</span>
                    <span style="animation-delay: 1.5s">BENVENUTI</span>
                    <span style="animation-delay: 1.5s">BEM-VINDOS</span>
                    <span style="animation-delay: 2s">WITAMY</span>
                    <span style="animation-delay: 2s">BENVINGUTS</span>
                    <span style="animation-delay: 2.5s">VÄLKOMMEN</span>
                </span>
            </div>
            <span class="default-message">How could we help you?</span>
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