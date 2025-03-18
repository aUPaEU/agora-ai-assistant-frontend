import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

class MapVisualizer extends PlainComponent {
    constructor() {
        super('agora-map-visualizer', `${PATHS.BASE_COMPONENTS}/MapVisualizer/MapVisualizer.css`)
    }

    template() {
        return html`
            <img class="map" src="${PATHS.PUBLIC}/assets/svg/europe-map.svg">
        `
    }
}

export default window.customElements.define('agora-map-visualizer', MapVisualizer)