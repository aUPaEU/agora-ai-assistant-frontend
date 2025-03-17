import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

class MetagoraNavigator extends PlainComponent {
    constructor() {
        super('agora-metagora-navigator', `${PATHS.BASE_COMPONENTS}/MetagoraNavigator/MetagoraNavigator.css`)

        this.serviceContext = new PlainContext('service', this, false)
        this.resultContext = new PlainContext('result', this, true)

    }

    template() {
        return html``
    }

    listeners() {}
}

export default window.customElements.define('agora-metagora-navigator', MetagoraNavigator)
