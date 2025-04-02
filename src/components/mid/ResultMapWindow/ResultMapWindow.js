import { PlainComponent, PlainState, PlainSignal, PlainContext} from 'plain-reactive'

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { CLOSE } from "../../../icons/icons"

class ResultMapWindow extends PlainComponent {
    constructor() {
        super('agora-result-map', `${PATHS.MID_COMPONENTS}/ResultMapWindow/ResultMapWindow.css`)
    }

    template() {
        return html`
            <!-- Close Button -->
            <button class="close-button">${CLOSE}</button>
            
            <iframe
                width="600"
                height="400"
                seamless
                frameBorder="0"
                scrolling="no"
                sandbox="allow-scripts allow-same-origin"
                src="http://superset.widening.eu/superset/explore/p/dwao9E728ZN/?standalone=1&height=400"
            ></iframe>
        `
    }

    listeners() {
        // Cierre al hacer clic en el botón de cierre
        this.$('.close-button').onclick = (e) => this.close(e)
        
        // Cierre al hacer clic en el fondo
        this.wrapper.onclick = (e) => this.handleBackgroundClick(e)
        
        // Cierre al presionar ESC
        document.addEventListener('keydown', (e) => this.handleKeyDown(e))
    }

    toogleMapWindow() {
        this.wrapper.classList.toggle('active')
    }
    
    close() {
        this.wrapper.classList.remove('active')
    }
    
    handleBackgroundClick(e) {
        // Si el clic fue directamente en el wrapper (fondo) y no en sus hijos
        if (e.target === this.wrapper) {
            this.close()
        }
    }
    
    handleKeyDown(e) {
        if (e.key === 'Escape' && this.wrapper.classList.contains('active')) {
            this.close()
        }
    }
}

export default window.customElements.define('agora-result-map', ResultMapWindow)