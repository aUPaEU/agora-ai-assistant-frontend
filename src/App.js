import { CONFIG } from "../agora.config"
import { PlainComponent, PlainState, PlainContext} from "plain-reactive"

/* Constants */
import { PATHS } from "./constants/paths.const"

/* Icons */
import { ARROW_LEFT, ARROW_RIGHT } from "./icons/icons"

/* Utils */
import { html } from "./utils/templateTags.util"

/* Components */
import './components/base/Navbar/Navbar'
import './components/base/Navigator/Navigator'
import './components/base/MetagoraNavigator/MetagoraNavigator'
import './components/base/NavigatorItem/NavigatorItem'
import './components/base/Showcase/Showcase'
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

/* Searchbar */
import './components/base/Searchbar/Searchbar'

/* Layouts */
import './components/layout/v1/v1'
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

    setupConfig() {
        const customConfig = {
            "name": this.getAttribute('name') ?? CONFIG.name,
            "host": this.getAttribute('host') ?? CONFIG.host,
            "company_id": this.getAttribute('company_id') ?? CONFIG.company_id,
            "enabled_ai": this.hasAttribute('enabled_ai') ?? CONFIG.enabled_ai,
            "ai_host": this.getAttribute('ai_host') ?? CONFIG.ai_host,
            "translation_host": this.getAttribute('translation_host') ?? CONFIG.translation_host,
            "current_version": CONFIG.current_version
        }

        this.configContext.setData(customConfig)
    }

    template() {
        return html`
            <!-- <agora-navigator></agora-navigator> -->
            <!-- <agora-navbar></agora-navbar> -->
            <!-- <agora-layout-v1></agora-layout-v1> -->
            
            <agora-layout-v2></agora-layout-v2>

            <!-- Element Info Dialog -->
            <dialog class="card-info-dialog">
                <!-- Card Content -->
                <div class="card-info-dialog-wrapper">
                    <!-- Card Image -->
                    <div class="card-info-image-container">
                        <img class="card-info-image" src="">
                    </div>

                    <!-- Card Main Content -->
                    <div class="card-info-content">
                        <span class="card-info-origin"></span>
                        <span class="card-info-name"></span>
                        <span class="card-info-lastname"></span>
                        <span class="card-info-summary"></span>
                    </div>

                    <!-- Card Actions -->
                    <div class="card-info-actions">
                        <button class="card-info-explore-button">Explore</button>
                    </div>
                </div>

                <!-- Carousel Controls -->
                <div class="carousel-controls">
                    <span class="prev-control">${ARROW_LEFT}</span>
                    <span class="next-control">${ARROW_RIGHT}</span>
                </div>
            </dialog>
            <!-- This element could be encapsulated in a component -->
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

        this.$('.prev-control').onclick = (e) => this.handleCarouselControls(e, 'prev')
        this.$('.next-control').onclick = (e) => this.handleCarouselControls(e, 'next')
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

    openCarousel(id) {
        const carouselV2 = this.$('agora-layout-v2').$('agora-card-info-carousel-v2')
        carouselV2.setDisplayedCardId(id)
    }

    openInfoDialog(payload) {
        const carousel = this.$('agora-layout-v2').$('agora-card-info-carousel')
        const carouselV2 = this.$('agora-layout-v2').$('agora-card-info-carousel-v2')

        carouselV2.setDisplayedCardId(payload.id)

        //carousel.show(payload.id, payload.href, payload.has_image)
        return
    }

    displayAdditionalFieldsInDialog(dialog, payload) {
        const additionalFields = payload.additional_fields
        const data = payload.data
        // Delete the container for the additional fields if it exists and there's no additional fields
        if (additionalFields.length === 0) {
            if (dialog.querySelector('.card-info-additional-fields')) {
                dialog.querySelector('.card-info-additional-fields').remove()
                return 
            }
        }

        // Create a container for the additional fields if it does not exist and there's any additional field
        if (!dialog.querySelector('.card-info-additional-fields')) {
            const additionalFieldsContainer = document.createElement('div')
            additionalFieldsContainer.classList.add('card-info-additional-fields')
            dialog.querySelector('.card-info-content').appendChild(additionalFieldsContainer)
        } else {
            dialog.querySelector('.card-info-additional-fields').innerHTML = ''
        }

        // Map the additional fields and add them to the container
        additionalFields.forEach(field => {
            if (!data[field]) return
            
            let fieldName = field.replace(/_/g, ' ')
            fieldName = fieldName.toUpperCase()

            const additionalField = html`
                <div class="additional-field">
                    <span class="field-name">${fieldName}</span>
                    <span class="field-value">${data[field]}</span>
                </div>
            `
            dialog.querySelector('.card-info-additional-fields').innerHTML += additionalField
        })
    }

    closeInfoDialog(e) {
        if (
            !["BUTTON", "SVG", "PATH", "svg", "path"].includes(e.target.tagName) &&
            !e.target.classList.contains('carousel-controls') &&
            !e.target.classList.contains('prev-control') &&
            !e.target.classList.contains('next-control')
        ) {
            this.$('.card-info-dialog').close()
        }
    }

    handleCarouselControls(e, direction) {
        e.preventDefault()

        this.$('.card-info-dialog').classList.remove('fade-in')
        this.$('.card-info-dialog').classList.remove('fade-left')
        this.$('.card-info-dialog').classList.remove('fade-right')

        if (direction === 'prev') {
            this.$('.card-info-dialog').classList.add('fade-left')
            this.$('.carousel-controls').style.opacity = 0
            this.$('.card-info-dialog').style.overflowY = 'hidden'
            this.$('.card-info-dialog').onanimationend = () => {
                this.$('.card-info-dialog').classList.remove('fade-left')
                this.$('.card-info-dialog').classList.add('fade-in')
                this.$('.card-info-dialog').onanimationend = () => {
                    this.$('.card-info-dialog').classList.remove('fade-in')
                    this.$('.carousel-controls').style.opacity = 1
                    this.$('.card-info-dialog').style.overflowY = 'auto'
                }
            }
        }

        if (direction === 'next') {
            this.$('.card-info-dialog').classList.add('fade-right')
            this.$('.carousel-controls').style.opacity = 0
            this.$('.card-info-dialog').style.overflowY = 'hidden'
            this.$('.card-info-dialog').onanimationend = () => {
                this.$('.card-info-dialog').classList.remove('fade-right')
                this.$('.card-info-dialog').classList.add('fade-in')
                this.$('.card-info-dialog').onanimationend = () => {
                    this.$('.card-info-dialog').classList.remove('fade-in')
                    this.$('.carousel-controls').style.opacity = 1
                    this.$('.card-info-dialog').style.overflowY = 'auto'
                }
            }
        }

        return 
    }
}

export default window.customElements.define('agora-app', App)