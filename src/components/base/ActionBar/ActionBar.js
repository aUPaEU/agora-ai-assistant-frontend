import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"
import { html } from "../../../utils/templateTags.util"
import { PATHS } from "../../../constants/paths.const"
import { MAP, REFRESH, AI_CHAT, SEARCH } from "../../../icons/icons"

class ActionBar extends PlainComponent {
    constructor() {
        super('agora-action-bar', `${PATHS.BASE_COMPONENTS}/ActionBar/ActionBar.css`)

        this.signals = new PlainSignal(this)
        this.signals.register('results-updated')

        this.resultContext = new PlainContext('result', this)
        this.configContext = new PlainContext('config', this)
    }

    template() {
        return html`
            <div class="action-bar-container">
                <button class="action-button map-button" disabled title="Resource map will be available soon">
                    ${MAP}
                </button>
                <button class="action-button refresh-button">
                    ${REFRESH}
                </button>

                <div class="action-toogle ai-searcher-toogle">
                    <button class="action-button ai-assistant-button ${this.configContext.getData('enabled_ai') ? 'selected' : ''}">
                        ${AI_CHAT}
                    </button>
                    <button class="action-button search-button ${this.configContext.getData('enabled_ai') ? '' : 'selected'}">
                        ${SEARCH}
                    </button>
                </div>
            </div>
        `
    }

    listeners() {
        // Abrir el mapa
        this.$('.map-button').onclick = () => this.openMapWindow()
        
        // Refrescar la página
        this.$('.refresh-button').onclick = () => this.clear()

        // Toggle the ai-searcher-toogle
        this.$('.ai-assistant-button').onclick = () => this.toggle(this.$('.ai-searcher-toogle'))
        this.$('.search-button').onclick = () => this.toggle(this.$('.ai-searcher-toogle'))
    }

    refresh() {
        // TODO: Improve this cuz it's not working properly
        this.resultContext.setData({
            data: [],
            grouped: [],
            filters: []
        }, true)
    }

    toggle(toggler) {
        const selected = toggler.querySelector('.action-button.selected')
        const unselected = toggler.querySelector('.action-button:not(.selected)')

        console.log(selected, unselected)

        selected.classList.remove('selected')
        unselected.classList.add('selected')

        this.parentComponent.toogleSearchbar()
    }

    openMapWindow() {
        const mapWindow = this.parentComponent.$('agora-result-map')
        console.log(mapWindow)
        if (mapWindow) {
            mapWindow.toogleMapWindow()
        }
    }

    openAIAssistant() {
        // TODO: Implementar la lógica para abrir el asistente de IA
        console.log('Opening AI Assistant...')
    }

    clear() {
        this.resultContext.setData({
            data: [],
            grouped: [],
            filters: []
        }, true)

        this.signals.emit('results-updated')
    }
}

export default window.customElements.define('agora-action-bar', ActionBar) 