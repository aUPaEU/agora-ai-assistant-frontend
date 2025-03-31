import { PlainComponent, PlainState, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"
import { ITEM_TYPE } from "../../../constants/itemType.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { ADD, SUBTRACT, CATALOGUE, BOOST, NAGIVATE_TO_WEBSITE, WEBSITE, SIMPLE_INFO, BOOK_PILE, CALENDAR, FILLED_SELECTION_SQUARE, EMPTY_SELECTION_SQUARE } from "../../../icons/icons"

class NavigatorItem extends PlainComponent {
    constructor() {
        super('agora-navigator-item', `${PATHS.BASE_COMPONENTS}/NavigatorItem/NavigatorItem.css`)

        this.configContext = new PlainContext('config', this, false)
        this.resultContext = new PlainContext('result', this, false)

        this.name = new PlainState(this.dataset.name, this)
        this.info = new PlainState(JSON.parse(this.dataset.info), this)
        this.type = new PlainState(this.dataset.type, this)
        this.unfolded = new PlainState(false, this)
        this.selected = new PlainState(this.classList.contains('selected'), this)
    }

    template() {
        const name = this.name.getState()
        const info = this.info.getState()
        const showcase = this.info.getState().website ? this.info.getState().website.fields : null

        let selectedIcon = this.selected.getState()
            ? html`<div class="selection-icon" title="Filter by this service">${FILLED_SELECTION_SQUARE}</div>`
            : html`<div class="selection-icon ${this.classList.contains('unselectable') ? 'unselectable' : ''}" title="Filter by this service">${EMPTY_SELECTION_SQUARE}</div>`
        
        selectedIcon = this.resultContext.getData('data').length > 0 
            ? selectedIcon 
            : ''

        const typeIcon = html`
            <div class="type-icon" title="${this.getAttribute('data-component')}">${ (() => {
                    switch (this.type.getState()) {
                        case ITEM_TYPE.ACCELERATION_SERVICE:
                            switch (this.getAttribute('data-component')) {
                                case 'Showcase':
                                    return WEBSITE
                                case 'Catalogues':
                                    return BOOK_PILE
                                case 'Events':
                                    return CALENDAR
                                default:
                                    return BOOST
                            }
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
                    ${selectedIcon}
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
        this.$('.selection-icon') ? this.$('.selection-icon').onclick = () => this.toogleSelect() : null
    }

    toogleSelect() {
        if (!this.selected.getState() && !this.$('.type-icon').classList.contains('unselected')) {
            // This codes needs to be refactored
            // It's like this because the initial state of the component is selected but 
            // it displays the selected icon as unselected or empty.
        } else {
            this.$('.type-icon').classList.toggle('unselected')
        }

        this.selected.setState(!this.selected.getState(), false)
        this.$('.selection-icon').innerHTML = this.selected.getState() ? FILLED_SELECTION_SQUARE : EMPTY_SELECTION_SQUARE
        this.selected.getState()
            ? this.addToFilters()
            : this.removeFromFilters()
    }

    addToFilters() {
        const filter = this.type.getState() === ITEM_TYPE.ACCELERATION_SERVICE
            ? {service: this.name.getState() ?? null}
            : {model: this.info.getState().model ?? null}
        
        if (!this.parentComponent) return
        this.parentComponent.addFilter(filter)
    }

    removeFromFilters() {
        const filter = this.type.getState() === ITEM_TYPE.ACCELERATION_SERVICE
            ? {service: this.name.getState() ?? null}
            : {model: this.info.getState().model ?? null}

        if (!this.parentComponent) return
        this.parentComponent.removeFilter(filter)
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

    navigateToShowcase() {
        const label = this.$('.label')
        if (!label.getAttribute('href')) return
        window.open(label.getAttribute('href'), '_blank').focus()
    }
}

export default window.customElements.define('agora-navigator-item', NavigatorItem)