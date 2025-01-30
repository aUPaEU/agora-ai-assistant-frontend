import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { CARD_TYPE } from "../../../constants/cardType.const"
import { CONFIG } from "../../../../agora.config"
import { html } from "../../../utils/templateTags.util"

class DynamicCard extends PlainComponent {
    constructor() {
        super('agora-dynamic-card', `${PATHS.BASE_COMPONENTS}/DynamicCard/DynamicCard.css`)

        this.data = new PlainState(null, this)
    }

    template() {
        this.highlightIfFeatured()
        this.hideIfNotFeatured()

        return html`
            ${this.build()}
        `
    }

    listeners() {
        this.wrapper.onclick = () => this.openInfo()
        this.$('.card-image').onload = () => this.replaceImageIfItsPlaceholder()
    }

    build() {
        this.data.setState(JSON.parse(this.dataset.data), false)

        const image = true
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
                ${this.wrapper.classList.contains('featured') ? html`<span title="This element is recommended by AIDA" class="featured-badge"></span>` : ``}
            </div>
        `
    }

    openInfo() {
        const infoDialog = document.querySelector('agora-app').$('.card-info-dialog')

        infoDialog.classList.add('fade-in')
        infoDialog.classList.remove('no-image')
        if (this.wrapper.classList.contains('no-image')) {
            infoDialog.classList.add('no-image')
        }
        
        infoDialog.querySelector('.card-info-image').src = `${CONFIG.host}/web/image?model=${this.getAttribute('model')}&id=${this.id.split('-')[1]}&field=image` ?? ''
        infoDialog.querySelector('.card-info-name').textContent = this.data.getState().name ?? ''
        infoDialog.querySelector('.card-info-lastname').innerHTML = this.data.getState().lastname ?? ''
        infoDialog.querySelector('.card-info-summary').innerHTML = this.data.getState().summary ?? this.data.getState().description ?? ''
        infoDialog.querySelector('.card-info-origin').textContent = this.data.getState().university_origin ? this.data.getState().university_origin[1] : ''
        infoDialog.querySelector('.card-info-explore-button').dataset['url'] = this.getAttribute('href') ?? ''

        this.displayAdditionalFieldsInDialog(infoDialog)

        infoDialog.showModal()
        infoDialog.scrollTo(0, 0)
    }

    displayAdditionalFieldsInDialog(dialog) {
        const additionalFields = this.parseAdditionalFields()

        // Delete the container for the additional fields if it exists and there's no additional fields
        if (additionalFields.length === 0) {
            if (dialog.querySelector('.card-info-additional-fields')) {
                dialog.querySelector('.card-info-additional-fields').remove()
                return 
            }
        }

        // Create a container for the additional fields if it does not exist and there's any additional field
        if (!dialog.querySelector('.card-info-additional-fields')) {
            const additionalFieldsContainer = document.createElement('div')
            additionalFieldsContainer.classList.add('card-info-additional-fields')
            dialog.querySelector('.card-info-content').appendChild(additionalFieldsContainer)
        } else {
            dialog.querySelector('.card-info-additional-fields').innerHTML = ''
        }

        // Map the additional fields and add them to the container
        additionalFields.forEach(field => {
            if (!this.data.getState()[field]) return
            
            let fieldName = field.replace(/_/g, ' ')
            fieldName = fieldName.toUpperCase()

            const additionalField = html`
                <div class="additional-field">
                    <span class="field-name">${fieldName}</span>
                    <span class="field-value">${this.data.getState()[field]}</span>
                </div>
            `
            dialog.querySelector('.card-info-additional-fields').innerHTML += additionalField
        })
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
            this.wrapper.style.display = 'none'
        }
    }

    showNotFeatured() {}
}

export default window.customElements.define('agora-dynamic-card', DynamicCard)

