import { PlainComponent, PlainState, PlainContext } from "plain-reactive"
import { html } from "../../../utils/templateTags.util"
import { PATHS } from "../../../constants/paths.const"
import { MAP, REFRESH, AI_ASSISTANT, AI_CHAT } from "../../../icons/icons"

class ActionBar extends PlainComponent {
    constructor() {
        super('agora-action-bar', `${PATHS.BASE_COMPONENTS}/ActionBar/ActionBar.css`)

        this.resultContext = new PlainContext('result', this)
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
                <button class="action-button ai-assistant-button">
                    ${AI_CHAT}
                </button>
            </div>
        `
    }

    listeners() {
        // Abrir el mapa
        this.$('.map-button').onclick = () => this.openMapWindow()
        
        // Refrescar la página
        this.$('.refresh-button').onclick = () => window.location.reload()

        // Abrir el asistente de IA
        this.$('.ai-assistant-button').onclick = () => this.openAIAssistant()
    }

    refresh() {
        // TODO: Improve this cuz it's not working properly
        this.resultContext.setData({
            data: [],
            grouped: [],
            filters: []
        }, true)
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
}

export default window.customElements.define('agora-action-bar', ActionBar) 