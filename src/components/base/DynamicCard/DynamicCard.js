import { PlainComponent, PlainState, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { isDebugMode } from "../../../utils/core.util"

/* Icons */
import { AUPAEU_LOGO } from "../../../icons/icons"

class DynamicCard extends PlainComponent {
    constructor() {
        super('agora-dynamic-card', `${PATHS.BASE_COMPONENTS}/DynamicCard/DynamicCard.css`)

        this.configContext = new PlainContext('config', this, false)

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
        this.$('.card-image').onload = () => this.replaceImageIfItsPlaceholder()
    }

    build() {
        this.data.setState(JSON.parse(this.dataset.data), false)

        const image = true
            ? html`<img class="card-image" src="${this.configContext.getData('host')}/web/image?model=${this.getAttribute('model')}&id=${this.id.split('-')[1]}&field=image"/>`
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

        const content = this.data.getState().content
            ? html`<span class="card-summary">${this.data.getState().content}</span>`
            : null

        const origin = this.data.getState().university_origin
            ? html`<span class="card-origin">${this.data.getState().university_origin[1]}</span>`
            : null

        const publicScore = Math.round(Number(this.getAttribute('absolute-score')) * 10) 

        return html`
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
    
    async replaceImageIfItsPlaceholder() {
        // TODO: This method have to be more solid. The conditions to see if it's a placeholder are these:
        /* 
            File Extension = png
            Image Size = 256x256
            Content Length = 6078
        */
        // To get all this data, we should fetch the image with HEAD method so they don't get loaded twice,
        // but in order to fetch theme from the script, we need to enable CORS headers in the server.
        // So this is a temporary solution.
        
        const image = this.$('.card-image')

        if (image.naturalWidth === 256 && image.naturalHeight === 256) {
            this.wrapper.classList.add('no-image')

            const defaultImage = document.createElement('div')
            defaultImage.classList.add('card-image')
            defaultImage.classList.add('default-image')
            
            image.remove()
            this.wrapper.insertBefore(defaultImage, this.wrapper.firstChild)
        }
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

