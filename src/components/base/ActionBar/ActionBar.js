import { PlainComponent, PlainState, PlainContext } from "plain-reactive"
import { html } from "../../../utils/templateTags.util"
import { PATHS } from "../../../constants/paths.const"
import { MAP, REFRESH } from "../../../icons/icons"

class ActionBar extends PlainComponent {
    constructor() {
        super('agora-action-bar', `${PATHS.BASE_COMPONENTS}/ActionBar/ActionBar.css`)

        this.resultContext = new PlainContext('result', this)
    }

    template() {
        return html`
            <div class="action-bar-container">
                <button class="action-button map-button">
                    ${MAP}
                </button>
                <button class="action-button refresh-button">
                    ${REFRESH}
                </button>
            </div>
        `
    }

    listeners() {
        // Abrir el mapa
        this.$('.map-button').onclick = () => this.openMapWindow()
        
        // Refrescar la página
        this.$('.refresh-button').onclick = () => window.location.reload()
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
}

export default window.customElements.define('agora-action-bar', ActionBar) 