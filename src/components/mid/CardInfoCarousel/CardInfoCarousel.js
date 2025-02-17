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

        this.groupedData = new PlainState(null, this) // We'll use this to store all the cards in a group so we can display them in the carousel and be able to scroll through them
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

        this.$('.next-control').onclick = (e) => this.showNext(e)
        this.$('.prev-control').onclick = (e) => this.showPrevious(e)

        this.$('.card-info-explore-button').onclick = () => window.open(this.$('.card-info-explore-button').dataset.url, '_blank')
    }

    show(id, detailUrl, hasImage) {
        this.displayedCardId.setState(id, false)

        const cardData = this.resultContext.getData('data').find(card => Number(card.data.id) === Number(id))
        
        this.updateVisibility(hasImage)
        this.updateCardConent(cardData, detailUrl)
        this.displayAdditionalFields(cardData.data, cardData.featured_fields)
        this.updateNavigationControls()
    }

    updateVisibility(hasImage) {
        // We make the dialog visible
        this.style.display = 'block'
        this.$('.card-info-wrapper').classList.add('fade-in')

        this.wrapper.classList.remove('no-image')

        // Check if the card has an image
        if (!hasImage) {
            this.wrapper.classList.add('no-image')
        }

        this.wrapper.style.display = 'flex'
    }

    updateCardConent(cardData, detailUrl) {
        this.$('.card-info-image').src = `${CONFIG.host}/web/image?model=${cardData.model}&id=${cardData.data.id}&field=image` ?? ''
        this.$('.card-info-name').textContent = cardData.data.name ?? ''
        this.$('.card-info-lastname').innerHTML = cardData.data.lastname ?? ''
        this.$('.card-info-summary').innerHTML = cardData.data.summary ?? cardData.data.description ?? ''
        this.$('.card-info-origin').textContent = cardData.data.origin ?? ''
        this.$('.card-info-explore-button').dataset['url'] = detailUrl ?? ''

        this.$('.card-info-content').scrollTo(0, 0)
    }

    updateNavigationControls() {
        this.toogleNextControl()
        this.tooglePreviousControl()
    }

    showNext(e) {
        const cardData = this.resultContext.getData('data').find(card => Number(card.data.id) === Number(this.displayedCardId.getState()))
        const currentService = this.groupedData.getState().find(group => group.service === cardData.service)
        const cardIndex = currentService.items.findIndex(item => Number(item.data.id) === Number(cardData.data.id))

        if (cardIndex === currentService.items.length - 1) return

        this.displayedCardId.setState(currentService.items[cardIndex + 1].data.id, false)
        this.show(this.displayedCardId.getState(), cardData.data.detail_url, cardData.data.image_url)
        // this.handleAnimation(e, 'next')
    }

    showPrevious(e) {
        const cardData = this.resultContext.getData('data').find(card => Number(card.data.id) === Number(this.displayedCardId.getState()))
        const currentService = this.groupedData.getState().find(group => group.service === cardData.service)
        const cardIndex = currentService.items.findIndex(item => Number(item.data.id) === Number(cardData.data.id))

        if (cardIndex === 0) return

        this.displayedCardId.setState(currentService.items[cardIndex - 1].data.id, false)
        this.show(this.displayedCardId.getState(), cardData.data.detail_url, cardData.data.image_url)
        // this.handleAnimation(e, 'prev')
    }

    toogleNextControl() {
        const cardData = this.resultContext.getData('data').find(card => Number(card.data.id) === Number(this.displayedCardId.getState()))
        const currentService = this.groupedData.getState().find(group => group.service === cardData.service)
        const cardIndex = currentService.items.findIndex(item => Number(item.data.id) === Number(cardData.data.id))

        this.$('.next-control').classList.toggle('hidden', cardIndex === currentService.items.length - 1)
    }

    tooglePreviousControl() {
        const cardData = this.resultContext.getData('data').find(card => Number(card.data.id) === Number(this.displayedCardId.getState()))
        const currentService = this.groupedData.getState().find(group => group.service === cardData.service)
        const cardIndex = currentService.items.findIndex(item => Number(item.data.id) === Number(cardData.data.id))

        // We hide the previous button if we're at the first card
        this.$('.prev-control').classList.toggle('hidden', cardIndex === 0)
    }

    close(e) {
        e.stopPropagation()
        if (e.target === this.wrapper) {
            this.style.display = 'none'
        }
    }

    setData(data) {
        this.groupedData.setState(data, false)
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

    handleAnimation(e, direction) {
        e.preventDefault()

        this.$('.card-info-wrapper').classList.remove('fade-in')
        this.$('.card-info-wrapper').classList.remove('fade-left')
        this.$('.card-info-wrapper').classList.remove('fade-right')

        if (direction === 'prev') {
            this.$('.card-info-wrapper').classList.add('fade-left')
            this.$('.controls-wrapper').style.opacity = 0
            this.$('.card-info-wrapper').style.overflowY = 'hidden'
            this.$('.card-info-wrapper').onanimationend = () => {
                this.$('.card-info-wrapper').classList.remove('fade-left')
                this.$('.card-info-wrapper').classList.add('fade-in')
                this.$('.card-info-wrapper').onanimationend = () => {
                    this.$('.card-info-wrapper').classList.remove('fade-in')
                    this.$('.controls-wrapper').style.opacity = 1
                    this.$('.card-info-wrapper').style.overflowY = 'auto'
                }
            }
        }

        if (direction === 'next') {
            this.$('.card-info-wrapper').classList.add('fade-right')
            this.$('.controls-wrapper').style.opacity = 0
            this.$('.card-info-wrapper').style.overflowY = 'hidden'
            this.$('.card-info-wrapper').onanimationend = () => {
                this.$('.card-info-wrapper').classList.remove('fade-right')
                this.$('.card-info-wrapper').classList.add('fade-in')
                this.$('.card-info-wrapper').onanimationend = () => {
                    this.$('.card-info-wrapper').classList.remove('fade-in')
                    this.$('.controls-wrapper').style.opacity = 1
                    this.$('.card-info-wrapper').style.overflowY = 'auto'
                }
            }
        }
    }
}

export default window.customElements.define('agora-card-info-carousel', CardInfoCarousel)