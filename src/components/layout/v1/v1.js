import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

class LayoutV1 extends PlainComponent {
    constructor() {
        super('agora-layout-v1', `${PATHS.LAYOUT_COMPONENTS}/v1/v1.css`)
    }

    template() {
        return html`
            <!-- Greetings -->
            <div class="greetings a">
                <span>Hi there, <em>John</em></span><br>
                <span>How could I help you?</span>
                <p class="greetings-description">
                    You can navigate directly through our acceleration services 
                    or ask our assistant to guide you through the process of finding resources.
                </p>
            </div>
            <div class="logo b">
                <span class="agora-name">Agora</span>
                <span class="alliance-name">Unite!</span>
            </div>
            <div class="showcase c">
                <agora-showcase></agora-showcase> 
            </div>
            <div class="greetings d"></div>
        `
    }
}

export default window.customElements.define('agora-layout-v1', LayoutV1)