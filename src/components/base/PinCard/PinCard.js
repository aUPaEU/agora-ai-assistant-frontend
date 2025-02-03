import { PlainComponent, PlainState } from "plain-reactive"
import { CONFIG } from "../../../../agora.config"
import { PATHS } from "../../../constants/paths.const"
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { DELETE, INFO } from "../../../icons/icons"

class PinCard extends PlainComponent {
    constructor() {
        super('agora-pin-card', `${PATHS.BASE_COMPONENTS}/PinCard/PinCard.css`)

        this.data = new PlainState(JSON.parse(this.dataset.data), this)

        this.loadAttributes()
    }

    template() {
        const data = JSON.parse(this.dataset.data)
        return html`
            <div class="image-wrapper">
                <img class="image" src="${data.data.image}" />
            </div>
            <span class="name">${data.data.name}</span>
            <div class="icon-wrapper">
                <span class="info-icon">${INFO}</span>
                <span class="delete-icon">${DELETE}</span>
            </div>
        `
    }

    listeners() {
        this.$('.info-icon').onclick = () => this.openInfo()
        this.$('.delete-icon').onclick = () => this.delete()
        
        this.$('.image').onload = () => this.replaceImageIfItsPlaceholder()
    }

    loadAttributes() {
        this.id = this.data.getState().id
        this.setAttribute('model', this.data.getState().model)
        this.setAttribute('href', this.data.getState().href)
        this.setAttribute('featured-fields', this.data.getState().featured_fields)
        this.setAttribute('featured', this.data.getState().featured)

        this.data.setState(this.data.getState().data, false)
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
        
        const image = this.$('.image')

        if (image.naturalWidth === 256 && image.naturalHeight === 256) {
            this.wrapper.classList.add('no-image')

            const defaultImage = document.createElement('div')
            defaultImage.classList.add('card-image')
            defaultImage.classList.add('default-image')
            
            image.remove()
            this.$('.image-wrapper').appendChild(defaultImage)
        }
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

    delete() {
        this.parentComponent.removePinnedCard(this.id)
    }
}

export default window.customElements.define('agora-pin-card', PinCard)