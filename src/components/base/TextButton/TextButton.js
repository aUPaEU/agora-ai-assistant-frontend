import { PlainComponent, PlainState } from "plain-reactive"
import { html } from "../../../utils/templateTags.util"
import { PATHS } from "../../../constants/paths.const"

class TextButton extends PlainComponent {
    constructor() {
        super('agora-text-button', `${PATHS.BASE_COMPONENTS}/TextButton/TextButton.css`)

        this.onClick = new PlainState(null, this)
    }

    template() {
        return html`
            <button class="button">
                <div>
                    <span class="text">${this.textContent}</span>
                    <span class="text">${this.textContent}</span>
                </div>
            </button>
        `
    }

    listeners() {
        this.$('.button').onclick = () => this.onClick.getState()()
    }
}

export default window.customElements.define('agora-text-button', TextButton)