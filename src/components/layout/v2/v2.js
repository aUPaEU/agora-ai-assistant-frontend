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

        this.resultContext = new PlainContext('result', this, false)
        this.configContext = new PlainContext('config', this, false)
    }

    template() {
        return html`
            <main class="main">
                <!-- Action Bar -->
                <agora-action-bar></agora-action-bar>

                <!-- Agora Result Map -->
                <!-- <agora-result-map></agora-result-map> -->

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
                    ${
                        !this.resultContext.getData('data') || this.resultContext.getData('data').length === 0
                            ? html`
                                <div class="showcase">
                                    <agora-landing></agora-landing>
                                </div>
                            `
                            : ''
                    }
                    

                    <!-- Results -->
                    <agora-result-window></agora-result-window>
                </div>
            </main>

            <!-- Chat or Searchbar -->
            <agora-chat class="chat ${this.configContext.getData('enabled_ai') ? 'active' : ''}"></agora-chat>
            <agora-searchbar class="searchbar ${this.configContext.getData('enabled_ai') ? '' : 'active'}"></agora-searchbar>

            <!-- Pin Box -->
            <!--
            <div class="pinbox-unfold-button">${BOOKMARK}</div>
            <agora-pin-box></agora-pin-box>
            -->

            <!-- Carousel -->
            <agora-card-info-carousel-v2></agora-card-info-carousel-v2>

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

    toogleSearchbar() {
        const searchbar = this.$('.searchbar')
        const chat = this.$('.chat')

        if (searchbar.classList.contains('active')) {

            searchbar.classList.add('inactive')
            searchbar.classList.remove('active')
            chat.classList.add('active')

        } else {
            chat.classList.add('inactive')
            chat.classList.remove('active')
            searchbar.classList.add('active')
        }
    }
}

export default window.customElements.define('agora-layout-v2', LayoutV2)