import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { CARD_TYPE } from "../../../constants/cardType.const"
import { CONFIG } from "../../../../agora.config"
import { html } from "../../../utils/templateTags.util"

class DynamicCard extends PlainComponent {
    constructor() {
        super('agora-dynamic-card', `${PATHS.BASE_COMPONENTS}/DynamicCard/DynamicCard.css`)

        this.type = new PlainState(this.getAttribute('type'), this)
        this.data = new PlainState(null, this)

        this.parentService = this.getAttribute('parent-service')
    }

    template() {
        return html`
            ${this.build()}
        `
    }

    listeners() {
        this.wrapper.onclick = () => this.openInfo()
        this.wrapper.onmouseenter = () => this.highlightServiceOnHover(true)
        this.wrapper.onmouseleave = () => this.highlightServiceOnHover(false)
    }

    openInfo() {
        const app = document.querySelector('agora-app')
        const infoDialog = app.$('.card-info-dialog')
        infoDialog.classList.add('fade-in')

        infoDialog.querySelector('.card-info-image').src = `${CONFIG.host}/web/image?model=${this.getAttribute('model')}&id=${this.id.split('-')[1]}&field=image` ?? ''
        infoDialog.querySelector('.card-info-name').innerHTML = this.data.getState().name ?? ''
        infoDialog.querySelector('.card-info-lastname').innerHTML = this.data.getState().lastname ?? ''
        infoDialog.querySelector('.card-info-summary').innerHTML = this.data.getState().summary ?? this.data.getState().description ?? ''
        infoDialog.querySelector('.card-info-origin').innerHTML = this.data.getState().university_origin ? this.data.getState().university_origin[1] : ''
        infoDialog.querySelector('.card-info-explore-button').dataset['url'] = this.getAttribute('href') ?? ''

        infoDialog.showModal()
        infoDialog.scrollTo(0, 0)
    }

    highlightServiceOnHover(state) {
        const app = document.querySelector('agora-app')
        const layout = app.$('agora-layout-v2')
        const navigator = layout.$('agora-navigator')
        const navigatorItems = navigator.$$('agora-navigator-item')

        navigatorItems.forEach((item) => {
            if (state) {
                if (item.dataset.name === this.getAttribute('service')) {
                    item.wrapper.classList.add('highlight')
                }
                else {
                    item.wrapper.classList.remove('highlight')
                }
            }

            else {
                item.wrapper.classList.remove('highlight')
            }
        })
    }

    build() {
        this.data.setState(JSON.parse(this.dataset.data), false)

        const image = this.data.getState().image
            ? html`<img class="card-image" src="${CONFIG.host}/web/image?model=${this.getAttribute('model')}&id=${this.id.split('-')[1]}&field=image"/>`
            : null


        const name = this.data.getState().name
            ? html`<span class="card-name">${this.data.getState().name}</span>`
            : null

        const lastname = this.data.getState().lastname
            ? html`<span class="card-lastname">${this.data.getState().lastname}</span>`
            : null

        const summary = this.data.getState().summary
            ? html`<span class="card-summary">${this.data.getState().summary}</span>`
            : null

        const description = this.data.getState().description
            ? html`<span class="card-summary">${this.data.getState().description}</span>`
            : null

        const origin = this.data.getState().university_origin
            ? html`<span class="card-origin">${this.data.getState().university_origin[1]}</span>`
            : null

        return html`
            ${image}
            <div class="card-content">
                ${origin}
                ${name}
                ${lastname}
                <div class="separator"></div>
                ${summary}
                ${description}
                <div class="fill-space"></div>
            </div>
        `

        // Additional field will be a field (or more) selected by the LLM to be displayed
        // because its information is considered relevant to the user
        const additional = this.data.getState().additional
            ? html`<span>Adadditional field</span>`
            : html`<span>No additional field</span>`

        // ITEM CARD
        if (this.type.getState() === CARD_TYPE.ITEM) {
            return html`
                ${image}
                ${name}
                ${description}
                ${additional}
                ${origin}
            `
        }

        // AVATAR CARD
        else if (this.type.getState() === CARD_TYPE.AVATAR) {
            return html`
                ${image}
                ${name}
                ${lastname}
                ${description}
                ${origin}
            `
        }
    }
}

export default window.customElements.define('agora-dynamic-card', DynamicCard)

