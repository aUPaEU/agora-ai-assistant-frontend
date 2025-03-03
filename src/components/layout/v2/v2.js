import { PlainComponent, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { CATALOGUE } from "../../../icons/icons"

class LayoutV2 extends PlainComponent {
    constructor() {
        super('agora-layout-v2', `${PATHS.LAYOUT_COMPONENTS}/v2/v2.css`)

        this.configContext = new PlainContext('config', this, false)
    }

    template() {
        return html`
            <main class="main">
                <!-- Left Side -->
                <div class="left">
                    <!-- Navigator -->
                    <div class="navigator-wrapper">
                        <agora-navigator></agora-navigator>
                    </div>
                </div>

                <!-- Right Side -->
                <div class="right">

                    <!-- Greetings and Showcase -->
                    <div class="showcase">
                        <agora-landing></agora-landing>
                    </div>

                    <!-- Results -->
                    <agora-result-window></agora-result-window>
                </div>
            </main>

            <!-- Chat or Searchbar -->
            ${
                this.configContext.getData('enabled_ai')
                ? html`<agora-chat class="chat"></agora-chat>`
                : html`<agora-searchbar class="searchbar"></agora-searchbar>`
            }

            <!-- Pin Box -->
            <agora-pin-box></agora-pin-box>

            <!-- Carousel -->
            <agora-card-info-carousel></agora-card-info-carousel>

            <!-- Bottom Fade -->
            <div class="bottom-fade"></div>
        `
    }
}

export default window.customElements.define('agora-layout-v2', LayoutV2)