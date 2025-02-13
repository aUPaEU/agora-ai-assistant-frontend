import { CONFIG } from "../../../../agora.config"
import { PlainComponent, PlainState, PlainSignal, PlainContext } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { ARROW_LEFT, ARROW_RIGHT } from "../../../icons/icons"

class CardInfoCarousel extends PlainComponent {
    constructor() {
        super('agora-card-info-carousel', `${PATHS.MID_COMPONENTS}/CardInfoCarousel/CardInfoCarousel.css`)

        this.resultContext = new PlainContext('result', this, true)

        this.groupData = new PlainState(null, this) // We'll use this to store all the cards in a group so we can display them in the carousel and be able to scroll through them
        this.displayedCardId = new PlainState(null, this)

        this.signals = new PlainSignal(this)
    }

    template() {
        return html`
            <!-- Card Content -->
            <div class="card-info-wrapper">
                <!-- Card Image -->
                <div class="card-info-image-container">
                    <img class="card-info-image" src="">
                </div>

                <!-- Card Main Content -->
                <div class="card-info-content">
                    <span class="card-info-origin"></span>
                    <span class="card-info-name"></span>
                    <span class="card-info-lastname"></span>
                    <span class="card-info-summary"></span>
                </div>

                <!-- Card Actions -->
                <div class="card-info-actions">
                    <button class="card-info-explore-button">Explore</button>
                </div>
            </div>

            <!-- Carousel Controls -->
            <div class="controls-wrapper">
                <span class="prev-control">${ARROW_LEFT}</span>
                <span class="next-control">${ARROW_RIGHT}</span>
            </div>
        `
    }

    listeners() {
        this.wrapper.onclick = (e) => this.close(e)

        this.$('.card-info-explore-button').onclick = () => window.open(this.$('.card-info-explore-button').dataset.url, '_blank')
    }

    show(id, detailUrl, hasImage) {
        const services = this.resultContext.getData('data') 
            ? [...new Set(this.resultContext.getData('data').map(result => result.service))].sort()
            : []

        const data = (() => {
            return services.map(service => {
                const items = this.resultContext.getData('data').filter(result => result.service === service)
                return {
                    service: service,
                    items: items
                }
            })
        })()

        // We make the dialog visible
        this.style.display = 'block'

        const cardData = this.resultContext.getData('data').find(card => Number(card.data.id) === Number(id))
        console.log("CARD DATA:", cardData)
        
        this.$('.card-info-wrapper').classList.add('fade-in')
        this.wrapper.classList.remove('no-image')

        // Check if the card has an image
        if (!hasImage) {
            this.wrapper.classList.add('no-image')
        }

        // Fill the card info
        this.$('.card-info-image').src = `${CONFIG.host}/web/image?model=${cardData.model}&id=${cardData.data.id}&field=image` ?? ''
        this.$('.card-info-name').textContent = cardData.data.name ?? ''
        this.$('.card-info-lastname').innerHTML = cardData.data.lastname ?? ''
        this.$('.card-info-summary').innerHTML = cardData.data.summary ?? cardData.data.description ?? ''
        this.$('.card-info-origin').textContent = cardData.data.origin ?? ''
        this.$('.card-info-explore-button').dataset['url'] = detailUrl ?? ''

        //this.displayAdditionalFields(cardData.data, cardData.featured_fields)

        this.$('.card-info-content').scrollTo(0, 0)
        this.wrapper.style.display = 'flex'
    }

    showNext() {

    }

    showPrevious() {

    }

    close(e) {
        e.stopPropagation()
        if (e.target === this.wrapper) {
            this.style.display = 'none'
        }
    }

    setData(data) {
        this.data.setState(data, false)
        console.log("Data fetched by the result window into the card info carousel:", data)
    }

    displayAdditionalFields(cardData, additionalFields) {
        const data = cardData
        // Delete the container for the additional fields if it exists and there's no additional fields
        if (additionalFields.length === 0) {
            if (this.$('.card-info-additional-fields')) {
                this.$('.card-info-additional-fields').remove()
                return 
            }
        }

        // Create a container for the additional fields if it does not exist and there's any additional field
        if (!this.$('.card-info-additional-fields')) {
            const additionalFieldsContainer = document.createElement('div')
            additionalFieldsContainer.classList.add('card-info-additional-fields')
            this.$('.card-info-content').appendChild(additionalFieldsContainer)
        } else {
            this.$('.card-info-additional-fields').innerHTML = ''
        }

        // Map the additional fields and add them to the container
        additionalFields.forEach(field => {
            if (!data[field]) return
            
            let fieldName = field.replace(/_/g, ' ')
            fieldName = fieldName.toUpperCase()

            const additionalField = html`
                <div class="additional-field">
                    <span class="field-name">${fieldName}</span>
                    <span class="field-value">${data[field]}</span>
                </div>
            `
            this.$('.card-info-additional-fields').innerHTML += additionalField
        })
    }
}

export default window.customElements.define('agora-card-info-carousel', CardInfoCarousel)