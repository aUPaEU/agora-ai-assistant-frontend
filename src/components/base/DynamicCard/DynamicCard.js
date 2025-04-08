import { PlainComponent, PlainState, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { isDebugMode } from "../../../utils/core.util"

/* Icons */
import { AUPAEU_LOGO } from "../../../icons/icons"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"

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

        // Helper method to find property with a specific pattern in the name
        const findPropertyByPattern = (pattern) => {
            const state = this.data.getState();
            if (!state) return null;
            
            // Convert single pattern to array for unified processing
            const patterns = Array.isArray(pattern) ? pattern : [pattern];
            
            for (const currentPattern of patterns) {
                // Look for exact match first
                if (state[currentPattern]) return state[currentPattern];
                
                // Then look for properties containing the pattern
                for (const key in state) {
                    if (key.includes(currentPattern)) {
                        return state[key];
                    }
                }
            }
            
            return null;
        };

        const image = findPropertyByPattern('image')
            ? html`<img class="card-image" src="${this.configContext.getData('host')}${findPropertyByPattern('image')}"/>`
            : html`<div class="card-image default-image-0"></div>`

        const name = findPropertyByPattern('name')
            ? html`<span class="card-name">${findPropertyByPattern('name')}</span>`
            : null

        const lastname = findPropertyByPattern('lastname')
            ? html`<span class="card-lastname">${findPropertyByPattern('lastname')}</span>`
            : null

        const summary = findPropertyByPattern(['summary', 'abstract'])
            ? html`<span class="card-summary">${findPropertyByPattern(['summary', 'abstract'])}</span>`
            : null

        const description = findPropertyByPattern(['description', 'info', 'details'])
            ? html`<span class="card-summary">${findPropertyByPattern(['description', 'info', 'details'])}</span>`
            : null

        const content = findPropertyByPattern(['content', 'text', 'body'])
            ? html`<span class="card-summary">${findPropertyByPattern(['content', 'text', 'body'])}</span>`
            : null

        // For origin, we use multiple patterns
        const originValue = findPropertyByPattern(['university_origin', 'home_partner_institution', 'origin', 'institution']);
        const origin = originValue
            ? html`<span class="card-origin">${originValue}</span>`
            : null

        let publicScore = Math.round(Number(this.getAttribute('absolute-score')) * 10) 
        if (isNaN(publicScore) || publicScore === 0) publicScore = '~'

        const isFeatured = findPropertyByPattern(['featured', 'highlight', 'premium'])

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

