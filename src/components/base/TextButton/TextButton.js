import { PlainComponent, PlainState } from "plain-reactive"
import { html } from "../../../utils/templateTags.util"
import { PATHS } from "../../../constants/paths.const"
import { gsap } from "gsap"

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
        this.$('.button').onmouseenter = () => this.handleMouseEnter()
        this.$('.button').onmouseleave = () => this.handleMouseLeave()
    }

    handleMouseEnter() {
        /* gsap.to(this.$('.button'), {
            duration: 0.3,
            scale: 1.1,
            boxShadow: "0px 4px 20px rgba(0, 255, 200, 0.6)",
            ease: "power2.out",
        }) */
    }

    handleMouseLeave() {
        /* gsap.to(this.$('.button'), {
            duration: 0.3,
            scale: 1,
            boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
            ease: "power2.out",
        }) */
    }
}

export default window.customElements.define('agora-text-button', TextButton)