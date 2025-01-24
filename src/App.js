import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"
import { PATHS } from "./constants/paths.const"
import { html } from "./utils/templateTags.util"
import { gsap } from "gsap"

import './components/base/Navbar/Navbar'
import './components/base/Navigator/Navigator'
import './components/base/NavigatorItem/NavigatorItem'
import './components/base/Showcase/Showcase'
import './components/base/Greetings/Greetings'

/* Buttons */
import './components/base/TextButton/TextButton'

/* Chat */
import './components/complex/Chat/Chat'
import './components/mid/ChatWindow/ChatWindow'
import './components/base/ChatBubble/ChatBubble'
import './components/base/ChatInput/ChatInput'

/* Layouts */
import './components/layout/v1/v1'
import './components/layout/v2/v2'

/* Spinners */
import './components/base/ChatLoader/ChatLoader'
import './components/base/BaseLoader/BaseLoader'

/* Results */
import './components/mid/ResultWindow/ResultWindow'
import './components/base/DynamicCard/DynamicCard'

class App extends PlainComponent {
    constructor() {
        super('agora-app', `${PATHS.SRC}/App.css`)

        this.companyContext = new PlainContext('company', this, false)
        this.resultContext = new PlainContext('result', this, false)
        this.chatContext = new PlainContext('chat', this, false)

        this.layout = new PlainState('main', this)
    }

    template() {
        return html`
            <!-- <agora-navigator></agora-navigator> -->
            <!-- <agora-navbar></agora-navbar> -->
            <!-- <agora-layout-v1></agora-layout-v1> -->
            
            <agora-layout-v2></agora-layout-v2>

            <dialog class="card-info-dialog">
                <div class="card-info-dialog-wrapper">
                    <div class="card-info-image-container">
                        <img class="card-info-image" src="">
                    </div>
                    <div class="card-info-content">
                        <span class="card-info-origin"></span>
                        <span class="card-info-name"></span>
                        <span class="card-info-lastname"></span>
                        <span class="card-info-summary"></span>
                    </div>
                    <div class="card-info-actions">
                        <button class="card-info-explore-button">Explore</button>
                    </div>
                </div>
            </dialog>
        `
    }

    listeners() {
        this.$('.card-info-dialog').onclick = (e) => this.closeInfoDialog(e)
        this.$('.card-info-dialog').onanimationend = () => this.$('.card-info-dialog').classList.remove('fade-in')
        this.$('.card-info-explore-button').onclick = () => window.open(this.$('.card-info-explore-button').dataset.url, '_blank')

        this.wrapper.onclick = (e) => {
            if (e.target.tagName !== 'AGORA-NAVBAR') {
                const navbar = this.$('agora-navbar')
                if (!navbar) return
                navbar.foldAllSubmenus()
            }
        }
    }

    connectors() {
        const chatWindow = this.$('agora-layout-v2').$('agora-chat').$('agora-chat-window')
        const resultWindow = this.$('agora-layout-v2').$('agora-result-window')
        const navigator = this.$('agora-layout-v2').$('agora-navigator')

        resultWindow.signals.connect(chatWindow, 'results-updated', () => resultWindow.clear())
        navigator.signals.connect(chatWindow, 'results-updated', () => navigator.render())
    }

    closeInfoDialog(e) {
        if (e.target.tagName !== 'BUTTON') {
            this.$('.card-info-dialog').close()
        }
    }
}

export default window.customElements.define('agora-app', App)