import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "./constants/paths.const"
import { html } from "./utils/templateTags.util"
import { gsap } from "gsap"

import './components/base/Navbar/Navbar'
import './components/base/Showcase/Showcase'
import './components/base/TextButton/TextButton'

class App extends PlainComponent {
    constructor() {
        super('agora-app', `${PATHS.SRC}/App.css`)

        this.layout = new PlainState('main', this)
    }

    template() {
        return html`
            <agora-navbar></agora-navbar>

            <main class="layout">
                <!-- Greetings -->
                <div class="greetings a">
                    <span>Hi there, <em>John</em></span><br>
                    <span>How could I help you?</span>
                    <p class="greetings-description">
                        You can navigate directly through our acceleration services 
                        or ask our assistant to guide you through the process of finding resources.
                    </p>
                </div>
                <div class="logo b">
                    <span class="agora-name">Agora</span>
                    <span class="alliance-name">Unite!</span>
                </div>
                <div class="showcase c">
                    <agora-showcase></agora-showcase>
                </div>
                <div class="greetings d"></div>
            </main>
        `
    }

    listeners() {
        this.wrapper.onclick = (e) => {
            if (e.target.tagName !== 'AGORA-NAVBAR') {
                const navbar = this.$('agora-navbar')
                navbar.foldAllSubmenus()
            }
        }
    }
}

export default window.customElements.define('agora-app', App)