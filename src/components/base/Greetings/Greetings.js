import { PlainComponent, PlainContext, PlainState } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

class Greetings extends PlainComponent {
    constructor() {
        super('agora-greetings', `${PATHS.BASE_COMPONENTS}/Greetings/Greetings.css`)

        this.companyContext = new PlainContext('company', this, true)
        this.configContext = new PlainContext('config', this, false)
        this.resultContext = new PlainContext('result', this, true)

        this.setInitialLoading()
    }

    setInitialLoading() {
        this.wrapper.classList.add('initial-loading')
        
    }

    template() {
        this.getAttribute('hidden')
            ? this.wrapper.classList.add('hidden')
            : this.wrapper.classList.remove('hidden')

        return html`
            <style>
                .agora-greetings-wrapper {
                    --company-color: ${
                        this.companyContext.getData('info') 
                            ? this.companyContext.getData('info').primary_color ?? "var(--text-accent-color)"
                            : "var(--text-accent-color)"
                    };
                }
            </style>
            <!-- Greetings -->
            <div class="welcome-message">
                <span class="default-welcome">Welcome</span> 
                <div class="logo">
                    <span class="agora-name">Agora</span>
                    <span 
                        class="alliance-name" 
                    >${
                        this.companyContext.getData('info')
                            ? this.companyContext.getData('info').name ?? ''
                            : this.configContext.getData('name') ?? ''
                    }</span>
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
            ${
                this.configContext.getData('ai_enabled')
                    ? html`
                        <span class="default-message">How could we help you?</span>
                        <p class="greetings-description">
                            You can navigate directly through our acceleration services 
                            or ask our assistant to guide you through the process of finding the right resources.
                        </p>
                    `
                    : html`
                        <span class="default-message">How could we help you?</span>
                        <p class="greetings-description">
                            Use our search tool to quickly find the resources and acceleration services that you may
                            need within the ${this.companyContext.getData('info') ? this.companyContext.getData('info').name : ''} Agora.
                        </p>
                        <p class="greetings-description" style="color: var(--text-tertiary-color);font-weight:100;">
                            Enter your query to get started...
                        </p>
                    `
            }
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