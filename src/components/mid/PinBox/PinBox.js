import { CONFIG } from "../../../../agora.config"
import { PlainComponent, PlainState, PlainContext } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { PIN, BOOKMARK } from "../../../icons/icons"

class PinBox extends PlainComponent {
    constructor() {
        super('agora-pin-box', `${PATHS.MID_COMPONENTS}/PinBox/PinBox.css`)

        this.pinContext = new PlainContext('pin', this, true)

        this.data = new PlainState(null, this)

        this.load()
    }

    template() {
        return html`
            <div class="pin-icon">${BOOKMARK}</div>
            ${
                this.data.getState() 
                    ? this.data.getState().map(pin => html`
                       <div>Pinned Card</div>
                    `).join('')
                    : `No cards pinned`
            }
        `
    }

    load() {
        const pinContext = this.pinContext.getData('data')
        if (!pinContext) return

        this.data.setState(pinContext, false)
    }

    dropCard(card) {

    }
}

export default window.customElements.define('agora-pin-box', PinBox)