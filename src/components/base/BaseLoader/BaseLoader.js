import { PlainComponent } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

class BaseLoader extends PlainComponent {
    constructor() {
        super('agora-base-loader', `${PATHS.BASE_COMPONENTS}/BaseLoader/BaseLoader.css`)
    }

    template() {
        return html`
            <img 
                width=${this.getAttribute('width')} 
                height=${this.getAttribute('height')} 
                src="${PATHS.PUBLIC}/assets/images/aupaeu-logo.png"
                alt="Agora"
            >
        `
    }
}

export default window.customElements.define('agora-base-loader', BaseLoader)