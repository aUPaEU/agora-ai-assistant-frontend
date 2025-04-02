import { PlainComponent, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { BOOKMARK } from "../../../icons/icons"

class LayoutV2 extends PlainComponent {
    constructor() {
        super('agora-layout-v2', `${PATHS.LAYOUT_COMPONENTS}/v2/v2.css`)

        this.configContext = new PlainContext('config', this, false)
    }

    template() {
        return html`
            <main class="main">
                <!-- Action Bar -->
                <agora-action-bar></agora-action-bar>

                <!-- Agora Result Map -->
                <agora-result-map></agora-result-map>

                <!-- Left Side -->
                <div class="left">
                    <!-- Navigator -->
                    <div class="navigator-wrapper">
                        <agora-navigator></agora-navigator>
                    </div>

                    <!-- Map Visualizer -->
                    <agora-map-visualizer></agora-map-visualizer>
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
            <!--
            <div class="pinbox-unfold-button">${BOOKMARK}</div>
            <agora-pin-box></agora-pin-box>
            -->

            <!-- Carousel -->
            <agora-card-info-carousel></agora-card-info-carousel>

            <!-- Bottom Fade -->
            <div class="bottom-fade"></div>

            <!-- Metagora Navigator -->
            ${this.configContext.getData('name') === 'Metagora' 
                ? html`<agora-metagora-navigator></agora-metagora-navigator>` 
                : ''
            }
        `
    }

    listeners() {
        if (this.$('.pinbox-unfold-button')) {
            this.$('.pinbox-unfold-button').onclick = () => this.tooglePinBox()
        }
    }

    tooglePinBox() {
        this.$('.pinbox-unfold-button').classList.toggle('unfolded')
        this.$('agora-pin-box').toogleFold()
    }
}

export default window.customElements.define('agora-layout-v2', LayoutV2)