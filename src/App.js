import { CONFIG } from "../agora.config"
import { PlainComponent, PlainState, PlainContext} from "plain-reactive"

/* Constants */
import { PATHS } from "./constants/paths.const"

/* Utils */
import { html } from "./utils/templateTags.util"
import { translateServiceIsAvailable } from "./utils/translator.util"

/* Components */
import './components/base/Navigator/Navigator'
import './components/base/MetagoraNavigator/MetagoraNavigator'
import './components/base/NavigatorItem/NavigatorItem'
import './components/base/Greetings/Greetings'
import './components/base/Landing/Landing'
import './components/base/MapVisualizer/MapVisualizer'

/* Buttons */
import './components/base/TextButton/TextButton'
import './components/base/ActionBar/ActionBar'

/* Chat */
import './components/complex/Chat/Chat'
import './components/mid/ChatWindow/ChatWindow'
import './components/base/ChatBubble/ChatBubble'
import './components/base/ChatInput/ChatInput'
import './components/base/ChatProcessUpdate/ChatProcessUpdate'

/* Searchbar */
import './components/base/Searchbar/Searchbar'

/* Layouts */
import './components/layout/v2/v2'

/* Spinners */
import './components/base/ChatLoader/ChatLoader'
import './components/base/BaseLoader/BaseLoader'

/* Results */
import './components/base/DynamicCard/DynamicCard'
import './components/base/PinCard/PinCard'
import './components/mid/ResultWindow/ResultWindow'
import './components/mid/CardInfoCarouselV2/CardInfoCarouselV2'
import './components/mid/PinBox/PinBox'
import './components/mid/ResultMapWindow/ResultMapWindow' 

/* User Info */
import './components/base/Toast/Toast'

class App extends PlainComponent {
    constructor() {
        super('agora-app', `${PATHS.SRC}/App.css`)

        this.companyContext = new PlainContext('company', this, false)
        this.resultContext = new PlainContext('result', this, false)
        this.serviceContext = new PlainContext('service', this, false)
        this.metagoraContext = new PlainContext('metagora', this, false)
        this.chatContext = new PlainContext('chat', this, false)
        this.configContext = new PlainContext('config', this, false)
        this.languageContext = new PlainContext('language', this, false, 'local')

        this.layout = new PlainState('main', this)

        this.setupConfig()
    }

    async setupConfig() {
        const customConfig = {
            "name": this.getAttribute('name') ?? CONFIG.name,
            "host": this.getAttribute('host') ?? window.location.origin ?? CONFIG.host,
            "company_id": this.getAttribute('company_id') ?? CONFIG.company_id,
            "enabled_ai": this.getAttribute('enabled_ai') ?? CONFIG.enabled_ai,
            "ai_host": this.getAttribute('ai_host') ?? CONFIG.ai_host,
            "translation_host": await this.checkTranslationService(),
            "current_version": CONFIG.current_version
        }

        this.configContext.setData(customConfig)
    }

    async checkTranslationService() {
        console.log('Checking translation service...')
        const translationHost = this.getAttribute('translation_host') ?? CONFIG.translation_host

        if (!translationHost) {
            console.log('No translation host found')
            return null
        }

        const isAvailable = await translateServiceIsAvailable(translationHost)
        if (!isAvailable) {
            console.log('Translation service is not available')
            return null
        }

        console.log('Translation service is available')
        return translationHost
    }

    template() {
        return html`
            <agora-layout-v2></agora-layout-v2>
        `
    }

    listeners() {
    }

    connectors() {
        // App Components
        const chatWindow = this.configContext.getData('enabled_ai') ? this.$('agora-layout-v2').$('agora-chat').$('agora-chat-window') : null
        const resultWindow = this.$('agora-layout-v2').$('agora-result-window')
        const searchbar = this.configContext.getData('enabled_ai') ? null : this.$('agora-layout-v2').$('agora-searchbar')
        const navigator = this.$('agora-layout-v2').$('agora-navigator')
        const landing = this.$('agora-layout-v2').$('agora-landing')
        const metagoraNavigator = this.$('agora-layout-v2').$('agora-metagora-navigator')

        // Connections between components
        if (resultWindow && chatWindow)
            resultWindow.signals.connect(chatWindow, 'results-updated', () => resultWindow.clear())

        if (resultWindow && chatWindow)
            resultWindow.signals.connect(chatWindow, 'results-updated', () => resultWindow.clear())

        if (resultWindow && searchbar) {
            resultWindow.signals.connect(searchbar, 'no-results', () => resultWindow.displayNoResultsMessage())
            resultWindow.signals.connect(searchbar, 'no-data-models', () => resultWindow.displayNoDataModelsMessage())
        }

        if (navigator && chatWindow)
            navigator.signals.connect(chatWindow, 'results-updated', () => navigator.render())
        
        if (landing && navigator)
            landing.signals.connect(navigator, 'changed-agora', () => landing.reset())

        if (metagoraNavigator && navigator)
            navigator.signals.connect(metagoraNavigator, 'changed-agora', (params) => navigator.updateAgora(params.index, params.isMetagora))

        if (navigator && resultWindow)
            resultWindow.signals.connect(navigator, 'changed-filters', () => resultWindow.filterResults())

        // Connect ResultWindow signals to Landing
        if (resultWindow && landing) {
            landing.signals.connect(resultWindow, 'display-no-results', () => landing.hide())
            landing.signals.connect(resultWindow, 'display-no-data-models', () => landing.hide())
            landing.signals.connect(resultWindow, 'clear-error-messages', () => landing.show())
        }
    }

    openCarousel(id, group) {
        const carouselV2 = this.$('agora-layout-v2').$('agora-card-info-carousel-v2')
        carouselV2.setDisplayedCardId(id, group)
    }
}

export default window.customElements.define('agora-app', App)