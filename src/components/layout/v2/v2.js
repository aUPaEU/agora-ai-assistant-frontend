import { PlainComponent, PlainState, PlainContext } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

class LayoutV2 extends PlainComponent {
    constructor() {
        super('agora-layout-v2', `${PATHS.LAYOUT_COMPONENTS}/v2/v2.css`)
    }

    template() {
        return html`
            <img class="fake-header" src="public/assets/images/fake-header.png"/>
            <main class="main">
                <div class="navigator-wrapper">
                    <agora-navigator></agora-navigator>
                </div>
                <agora-result-window></agora-result-window>
            </main>
            <agora-chat class="chat"></agora-chat>
            <agora-pin-box></agora-pin-box>
        `
    }
}

export default window.customElements.define('agora-layout-v2', LayoutV2)