import { PlainComponent, PlainState, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"
import { ITEM_TYPE } from "../../../constants/itemType.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { ADD, SUBTRACT, CATALOGUE, BOOST, NAGIVATE_TO_WEBSITE, SIMPLE_INFO } from "../../../icons/icons"

class NavigatorItem extends PlainComponent {
    constructor() {
        super('agora-navigator-item', `${PATHS.BASE_COMPONENTS}/NavigatorItem/NavigatorItem.css`)

        this.configContext = new PlainContext('config', this, false)

        this.name = new PlainState(this.dataset.name, this)
        this.info = new PlainState(JSON.parse(this.dataset.info), this)
        this.type = new PlainState(this.dataset.type, this)
        this.unfolded = new PlainState(false, this)
    }

    template() {
        const name = this.name.getState()
        const info = this.info.getState()
        const showcase = this.info.getState().website ? this.info.getState().website.fields : null
        
        const typeIcon = html`
            <div class="type-icon">${ (() => {
                    switch (this.type.getState()) {
                        case ITEM_TYPE.ACCELERATION_SERVICE:
                            return BOOST
                        case ITEM_TYPE.ACCELERATION_SUB_SERVICE:
                            return BOOST
                        case ITEM_TYPE.CATALOGUE:
                            return CATALOGUE
                        case ITEM_TYPE.SHOWCASE:
                            return WEBSITE
                    }
                }) ()
            }
            </div>
        `
        const unfoldIcon = ![ITEM_TYPE.CATALOGUE, ITEM_TYPE.SHOWCASE].includes(this.type.getState())
            ? html`
                ${
                    Object.entries(info.sub_acceleration_services).length > 0 || Object.entries(info.catalogues).length > 0
                        ? html`<div class="unfold-icon">${ADD}</div>`
                        : ``
                }
            `
            : ``

        const showcaseIcon = info && showcase
                ? html`<div class="showcase-icon">${NAGIVATE_TO_WEBSITE}</div>`
                : null

        const infoIcon = this.type.getState() === ITEM_TYPE.CATALOGUE
                ? null
                : html`<div class="info-icon">${SIMPLE_INFO}</div>`

        /* const moreInfoIcon = this.isEmptyService()
                ? html`<div class="unfold-icon">${BOOST}</div>`
                : `` */

        return html`
            <!-- Item -->
            <li class="item ${this.type.getState().toLowerCase().replace(' ', '-')} ${info && showcase || info && info.url ? 'has-showcase': ''}">
                <!-- Item Type Icon -->
                ${typeIcon}

                <!-- Item Label -->
                <a 
                    class="label"
                    target="_blank" 
                    ${info && showcase ? `href="${showcase.domain}"` : ''}
                    ${info && info.url ? `href="${this.configContext.getData('host')}/${info.url}"` : ''}
                >
                    <div class="label-content">
                        <span class="label-title">${name}</span>
                        <div class="label-subtitle">
                            <span>${this.type.getState()}</span>
                        </div>
                    </div>
                </a>
                <a 
                    class="label hover"
                    target="_blank" 
                    ${info && showcase ? `href="${showcase.domain}"` : ''}
                    ${info && info.url ? `href="${this.configContext.getData('host')}/${info.url}"` : ''}
                >
                    ${name}
                    <span>${this.type.getState()}</span>
                </a>

                <div 
                    class="actions"
                    style="${!showcaseIcon && !infoIcon ? 'display: none;' : ''}"
                >
                    ${infoIcon}
                    ${showcaseIcon}
                    ${unfoldIcon}
                </div>

                <!-- Description -->
                <div class="description">${this.info.getState().description}</div>
            </li>

            

            <!-- Submenu -->
            <ul class="submenu"></ul>
        `
    }

    listeners() {
        this.$('.label').onclick = () => this.navigateToShowcase()
        this.$('.unfold-icon') ? this.$('.unfold-icon').onclick = () => this.unfold() : null
        this.$('.showcase-icon') ? this.$('.showcase-icon').onclick = () => this.navigateToShowcase() : null
    }

    unfold() {
        this.unfolded.setState(!this.unfolded.getState(), false) // Change the unfolded state
        this.$('.unfold-icon').innerHTML = this.unfolded.getState() ? SUBTRACT : ADD // Change the unfold icon
        this.$('.submenu').innerHTML = `` // Clear the submenu

        if (this.unfolded.getPrevState()) return // If it's unfolded, return and keep the submenu empty so it appears folded

        // Extract and flatten data
        const subservices = this.info.getState().sub_acceleration_services ?? []
        const catalogues = this.info.getState().catalogues.websites ?? []

        // Render Sub Services
        if (subservices.length > 0) {
            this.$('.submenu').innerHTML += html`
                ${subservices.map(
                    (item) => {
                        return html`
                            <agora-navigator-item 
                                data-name='${item.fields.name}'
                                data-info='${JSON.stringify(item.fields)}' 
                                data-type='${ITEM_TYPE.ACCELERATION_SUB_SERVICE}'>
                            </agora-navigator-item>
                        `
                }).join('')}
            `
        }

        // Render Catalogues
        if (catalogues.length > 0) {
            this.$('.submenu').innerHTML += html`
                ${catalogues.map(
                    (item) => html`
                        <agora-navigator-item 
                            data-name='${item.name}'
                            data-info='${JSON.stringify(item)}' 
                            data-type='${ITEM_TYPE.CATALOGUE}'>
                        </agora-navigator-item>
                    `
                ).join('')}
            `
        }
    }

    /* isEmptyService() {
        const showcase = this.info.getState().website ? this.info.getState().website.fields : null
        const subservices = this.info.getState().sub_acceleration_services ?? null
        const catalogues = this.info.getState().catalogues.websites ?? null

        console.log(showcase, subservices, catalogues)

        if (!showcase && subservices.length === 0 && catalogues) return true
        return false
    } */

    navigateToShowcase() {
        const label = this.$('.label')
        window.open(label.getAttribute('href'), '_blank').focus();
        /* window.location.href = label.getAttribute('href') */
    }
}

export default window.customElements.define('agora-navigator-item', NavigatorItem)