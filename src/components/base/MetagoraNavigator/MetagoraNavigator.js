import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

class MetagoraNavigator extends PlainComponent {
    constructor() {
        super('agora-metagora-navigator', `${PATHS.BASE_COMPONENTS}/MetagoraNavigator/MetagoraNavigator.css`)

        this.signals = new PlainSignal(this)
        this.signals.register('changed-agora')

        this.serviceContext = new PlainContext('service', this, false)
        this.resultContext = new PlainContext('result', this, true)
        this.configContext = new PlainContext('config', this, false)
        this.metagoraContext = new PlainContext('metagora', this, false)

        this.currentSelected = new PlainState(-1, this)
    }

    template() {
        return html`
            <div class="agora-button-grid">
                <button class="agora-selector metagora ${this.currentSelected.getState() === -1 ? 'selected' : ''}">
                    Metagora
                </button>
                ${
                    this.metagoraContext.getData('data').agoras.map((agora, index) => {
                        return html`
                            <button 
                                class="agora-selector agora${index === 0 ? '0' : index} ${this.currentSelected.getState() === index ? 'selected' : ''}"
                                title="${agora.fields.name}"
                            >
                                ${
                                    agora.fields.image
                                        ? html`<img src="${this.configContext.getData('host')}${agora.fields.image}" alt="${agora.fields.name}" />`
                                        : html`<span class="no-logo" style="color:${agora.fields.primary_color}">${agora.fields.name[0].toLowerCase()}À</span>`
                                }
                            </button>
                        `
                    }).join('')
                }
            </div>
        `
    }

    listeners() {
        if (this.$('.metagora')) this.$('.metagora').onclick = (e) => this.handleClick(this.$('.metagora'), -1, true)

        Array.from(this.$$('.agora-selector:not(.metagora)')).forEach((button, index) => {
            button.onclick = () => this.handleClick(button, index, false)
        })
    }

    handleClick(button, index, isMetagora) {
        this.signals.emit('changed-agora', {index: index === 0 ? 0 : index, isMetagora: isMetagora})
        this.currentSelected.setState(index, false)
        this.toggleSelected(button)
    }

    toggleSelected(button) {
        const buttons = this.$$('.agora-selector')
        buttons.forEach(button => button.classList.remove('selected'))
        button.classList.add('selected')
    }
}

export default window.customElements.define('agora-metagora-navigator', MetagoraNavigator)
