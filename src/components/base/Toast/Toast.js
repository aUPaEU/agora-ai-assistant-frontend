import { PlainComponent, PlainState, PlainSignal, PlainContext, PlainRouter} from 'plain-reactive'
import { html } from "../../../utils/templateTags.util"
import { PATHS } from "../../../constants/paths.const"
import { TOAST_TYPES } from "../../../utils/errorHandling.util"

/* Icons */
import { INFO, CLOSE, ERROR, SUCCESS, WARNING } from '../../../icons/icons'

class Toast extends PlainComponent {
    constructor() {
        // The relative path is from the entry point of the App (index.html)
        super(`agora-toast`, `${PATHS.BASE_COMPONENTS}/Toast/Toast.css`)

        this.toastType = null
        this.toastTitle = null
        this.ttl = 3500
    }

    template() {
        return html`
            <div class="inner-wrapper">
                <div class="icon">
                    ${
                        this.toastType === TOAST_TYPES.ERROR ? html`${ERROR}` :
                        this.toastType === TOAST_TYPES.SUCCESS ? html`${SUCCESS}` :
                        this.toastType === TOAST_TYPES.WARNING ? html`${WARNING}` :
                        this.toastType === TOAST_TYPES.INFO ? html`${INFO}` :
                        ''
                    }
                </div>
                <div class="message">
                    <span class="title">${this.toastTitle}!</span>
                    <span class="content">${this.textContent}</span>
                </div>
                <div class="close">
                    ${CLOSE}
                </div>
            </div>
            <div class="progress-bar">
                <div 
                    class="progress-bar-fill"
                    style="animation-duration: ${this.ttl}ms; animation-delay: 0.5s;"
                ></div>
            </div>
        `
    }

    listeners() {
        this.$('.progress-bar-fill').onanimationend = () => {
            this.destroy()
        }

        this.$('.close').onclick = () => this.destroy()
    }

    destroy() {
        // Animate the toast out
        this.wrapper.classList.add('fade-up')
        this.wrapper.onanimationend = () => {
            // Remove the toast from the DOM
            setTimeout(() => {
                this.remove()
            }, 1000)
        }
    }
}

export default window.customElements.define('agora-toast', Toast) 