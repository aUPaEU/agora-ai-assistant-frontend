import { CONFIG } from "../../../../agora.config"
import { PlainComponent, PlainState, PlainContext } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"
import { stringifyReplacer } from "../../../utils/parsingHelper.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"

/* Icons */
import { PIN, BOOKMARK } from "../../../icons/icons"

class PinBox extends PlainComponent {
    constructor() {
        super('agora-pin-box', `${PATHS.MID_COMPONENTS}/PinBox/PinBox.css`)

        this.pinContext = new PlainContext('pin', this, false, 'local')

        this.unfolded = new PlainState(false, this)
        this.data = new PlainState(null, this)

        this.load()
    }

    template() {
        return html`
            <div class="pin-icon ${this.unfolded.getState() ? 'unfolded' : ''}">${BOOKMARK}</div>
            <div class="card-wrapper ${this.data.getState() && this.data.getState().length > 0 ? '' : 'no-cards'}">
                ${
                    this.data.getState() && this.data.getState().length > 0
                        ? this.data.getState().map(pin => html`
                        <agora-pin-card data-data='${JSON.stringify(pin, stringifyReplacer)}'></agora-pin-card>
                        `).join('')
                        : ``
                }
                <div class="drop-placeholder">Drop and save your items here</div>
            </div>
        `
    }

    listeners() {
        this.$('.pin-icon').onclick = () => this.toogleFold()

        this.wrapper.ondragover = (e) => this.handleDragOver(e)
        this.wrapper.ondragleave = (e) => this.handleDragLeave(e)
        this.wrapper.ondrop = (e) => this.handleDragDrop(e)
    }

    load() {
        const pinContext = this.pinContext.getData('data')
        if (!pinContext) return

        this.data.setState(pinContext, false)
    }

    toogleFold() {
        this.unfolded.setState(!this.unfolded.getState(), false)
        this.$('.pin-icon').classList.toggle('unfolded')
    }

    handleDragOver(e) {
        e.preventDefault()
        this.wrapper.classList.add('dragover')
    }

    handleDragLeave(e) {
        e.preventDefault()
        this.wrapper.classList.remove('dragover')
    }

    handleDragDrop(e) {
        e.preventDefault()
        this.wrapper.classList.remove('dragover')
        const cardId = e.dataTransfer.getData("id")
        const cardModel = e.dataTransfer.getData("model")
        const cardHref = e.dataTransfer.getData("href")
        const cardFeaturedFields = e.dataTransfer.getData("featured-fields")
        const cardFeatured = e.dataTransfer.getData("featured")
        const cardData = JSON.parse(e.dataTransfer.getData("data"))

        const card = {
            id: cardId,
            model: cardModel,
            href: cardHref,
            featured_fields: cardFeaturedFields,
            featured: cardFeatured,
            data: cardData
        }

        this.addPinnedCard(card)
    }

    addPinnedCard(data) {
        if (!this.pinContext.getData('data')) this.pinContext.setData({'data': []})

        const pinContext = this.pinContext.getData('data')
        const ids = extractObjectsWithMatchingKey(pinContext, 'id')

        const idInPinContext = ids.find(id => id.id === data.id)

        if (!idInPinContext) {
            pinContext.push(data)
            this.pinContext.setData({'data':pinContext})
            this.data.setState(pinContext, true)
        }
    }

    removePinnedCard(id) {
        if (!this.pinContext.getData('data')) return

        const pinContext = this.pinContext.getData('data')
        const filteredPinContext = pinContext.filter(card => {
            return card.id !== id
        })

        this.pinContext.setData({'data':filteredPinContext})
        this.data.setState(filteredPinContext, true)
    }
}

export default window.customElements.define('agora-pin-box', PinBox)