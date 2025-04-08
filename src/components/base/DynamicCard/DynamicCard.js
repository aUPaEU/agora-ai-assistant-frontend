import { PlainComponent, PlainState, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { isDebugMode } from "../../../utils/core.util"
import { extractObjectsWithMatchingKey, findPropertyByPattern } from "../../../utils/objectHelper.util"

/* Icons */
import { AUPAEU_LOGO } from "../../../icons/icons"

class DynamicCard extends PlainComponent {
    constructor() {
        super('agora-dynamic-card', `${PATHS.BASE_COMPONENTS}/DynamicCard/DynamicCard.css`)

        this.configContext = new PlainContext('config', this, false)
        this.serviceContext = new PlainContext('service', this, false)

        this.data = new PlainState(null, this)

        this.enableDrag()
    }

    template() {
        this.highlightIfFeatured()
        this.hideIfNotFeatured()

        return html`
            ${this.build()}
        `
    }

    listeners() {
        this.wrapper.ondragstart = (e) => this.handleDrag(e)
        this.wrapper.ondragend = (e) => this.handleDrop(e)

        this.wrapper.onclick = () => this.openInfoDialog()
    }

    build() {
        this.data.setState(JSON.parse(this.dataset.data), false)

        const image = findPropertyByPattern(this.data.getState(), 'image')
            ? html`<img class="card-image" src="${this.configContext.getData('host')}${findPropertyByPattern(this.data.getState(), 'image')}"/>`
            : html`<div class="card-image default-image-0"></div>`

        const name = findPropertyByPattern(this.data.getState(), 'name')
            ? html`<span class="card-name">${findPropertyByPattern(this.data.getState(), 'name')}</span>`
            : null

        const lastname = findPropertyByPattern(this.data.getState(), 'lastname')
            ? html`<span class="card-lastname">${findPropertyByPattern(this.data.getState(), 'lastname')}</span>`
            : null

        const summary = findPropertyByPattern(this.data.getState(), ['summary', 'abstract'])
            ? html`<span class="card-summary">${findPropertyByPattern(this.data.getState(), ['summary', 'abstract'])}</span>`
            : null

        const description = findPropertyByPattern(this.data.getState(), ['description', 'info', 'details'])
            ? html`<span class="card-summary">${findPropertyByPattern(this.data.getState(), ['description', 'info', 'details'])}</span>`
            : null

        const content = findPropertyByPattern(this.data.getState(), ['content', 'text', 'body'])
            ? html`<span class="card-summary">${findPropertyByPattern(this.data.getState(), ['content', 'text', 'body'])}</span>`
            : null

        // For origin, we use multiple patterns
        const originValue = findPropertyByPattern(this.data.getState(), ['university_origin', 'home_partner_institution', 'origin', 'institution']);
        const origin = originValue
            ? html`<span class="card-origin">${originValue}</span>`
            : null

        let publicScore = Math.round(Number(this.getAttribute('absolute-score')) * 10) 
        if (isNaN(publicScore) || publicScore === 0) publicScore = '~'

        const isFeatured = findPropertyByPattern(this.data.getState(), ['featured', 'highlight', 'premium'])

        return html`
            <div class="catalogue">${this.getAttribute('model-verbose-name')}</div>
            ${image}
            <div class="card-content">
                ${origin}
                ${name}
                ${lastname}
                <div class="separator"></div>
                ${summary}
                ${description}
                ${content}
                <div class="fill-space"></div>

                <div class="additional-info">
                    ${
                        isFeatured 
                            ? html`
                                <span title="This element is featured by Agora" class="featured-badge">
                                    ${AUPAEU_LOGO}
                                </span>
                            `
                            : ``
                    }
                    <div 
                        class="public-score" 
                        title="This score represents the relevance of this\nitem in the search results."
                        style="filter: hue-rotate(${(publicScore-10) * 20}deg);"
                    >${publicScore}</div>
                    ${
                        this.wrapper.classList.contains('featured') 
                            ? html`
                                <!-- <span title="This element is recommended by AIDA" class="featured-badge">
                                    ${AUPAEU_LOGO}
                                </span>-->` 
                            : ``
                    }
                </div>
                <span 
                    class="score" 
                    title="(A)bsolute and (R)elative (to the group) scores"
                    style="${isDebugMode() ? '' : 'display:none'}"
                >
                        A: ${this.getAttribute('absolute-score')}, R: ${this.getAttribute('relative-score')}
                </span>
            </div>
        `
    }

    openInfoDialog() {
        const app = document.querySelector('agora-app')
        const payload = {
            id: this.data.getState().id,
            src: `${this.configContext.getData('host')}/web/image?model=${this.getAttribute('model')}&id=${this.id.split('-')[1]}&field=image` ?? '',
            name: this.data.getState().name ?? '',
            lastname: this.data.getState().lastname ?? '',
            summary: this.data.getState().summary ?? this.data.getState().description ?? '',
            university_origin: this.data.getState().university_origin ? this.data.getState().university_origin[1] : '',
            href: this.getAttribute('href') ?? '',
            additional_fields: this.parseAdditionalFields(),
            data: this.data.getState(),
            has_image: !this.wrapper.classList.contains('no-image')
        }

        app.openInfoDialog(payload)
    }

    parseAdditionalFields() {
        return this.getAttribute('featured-fields').split(',')
    }

    getDefaultImageIndex() {
        return Math.floor(Math.random() * 6)
    }

    highlightIfFeatured() {
        if (this.hasAttribute('featured')) {
            this.wrapper.classList.add('featured')
        }
    }

    hideIfNotFeatured() {
        if (!this.hasAttribute('featured')) {
            this.style.display = 'none'
        }
    }

    enableDrag() {
        this.wrapper.draggable = true
    }

    handleDrag(e) {
        this.wrapper.classList.add('ondrag')
        e.dataTransfer.setData("data", JSON.stringify(this.data.getState()))
        e.dataTransfer.setData("id", this.id)
        e.dataTransfer.setData("model", this.getAttribute('model'))
        e.dataTransfer.setData("href", this.getAttribute('href'))
        e.dataTransfer.setData("featured-fields", this.getAttribute('featured-fields'))
        e.dataTransfer.setData("featured", this.hasAttribute('featured'))
    }

    handleDrop(e) {
        this.wrapper.classList.remove('ondrag')
    }
}

export default window.customElements.define('agora-dynamic-card', DynamicCard)


