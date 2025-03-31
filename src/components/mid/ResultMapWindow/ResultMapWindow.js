import { PlainComponent, PlainState, PlainSignal, PlainContext} from 'plain-reactive'

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

class ResultMapWindow extends PlainComponent {
    constructor() {
        super('agora-result-map', `${PATHS.MID_COMPONENTS}/ResultMapWindow/ResultMapWindow.css`)
    }

    template() {
        return html`
            <iframe
            width="600"
            height="400"
            seamless
            frameBorder="0"
            scrolling="no"
            sandbox="allow-same-origin"
            src="http://superset.widening.eu/superset/explore/p/B420jmDrbYd/?standalone=1&height=400"
            ></iframe>
        `
    }

    listeners() {
        // Here you can define the listeners for the component inner elements
    }
}

export default window.customElements.define('agora-result-map', ResultMapWindow)