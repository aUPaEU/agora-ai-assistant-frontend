import { PlainComponent } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { AUPAEU_LOGO } from "../../../icons/icons"

class BaseLoader extends PlainComponent {
    constructor() {
        super('agora-base-loader', `${PATHS.BASE_COMPONENTS}/BaseLoader/BaseLoader.css`)
    }

    template() {
        return html`
            ${AUPAEU_LOGO}
        `
    }
}

export default window.customElements.define('agora-base-loader', BaseLoader)