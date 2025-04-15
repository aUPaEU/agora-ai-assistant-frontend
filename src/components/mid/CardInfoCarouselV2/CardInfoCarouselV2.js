import { PlainComponent, PlainState, PlainSignal, PlainContext, PlainRouter} from 'plain-reactive'

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { extractObjectsWithMatchingKey, findPropertyByPattern } from "../../../utils/objectHelper.util"

/* Icons */
import { ARROW_LEFT, ARROW_RIGHT, CLOSE } from "../../../icons/icons"

class CardInfoCarouselV2 extends PlainComponent {
    constructor() {
        super(
            `agora-card-info-carousel-v2`, 
            `${PATHS.MID_COMPONENTS}/CardInfoCarouselV2/CardInfoCarouselV2.css`
        )

        this.signals = new PlainSignal(this)

        this.configContext = new PlainContext('config', this, false)
        this.serviceContext = new PlainContext('service', this, false)
        this.resultContext = new PlainContext('result', this, false)

        this.data = new PlainState(null, this)
        this.displayedCardId = new PlainState(null, this)
        this.displayedCardGroup = new PlainState(null, this)
    }

    template() {
        /* TEMPLATE DEFINITIONS */
        const templateCardBreadcrumb = html`
            <span class="root">${findPropertyByPattern(this.data.getState(), ['service'])}</span>
            <span class="separator">></span>
            <a class="leaf" href="${findPropertyByPattern(this.data.getState(), ['model_view_url'])}" target="_blank">
                ${findPropertyByPattern(this.data.getState(), ['model_verbose_name'])}
            </a>
        `
        const templateCardImage = findPropertyByPattern(this.data.getState()?.data, ['image'])
            ? html`<img class="card-image" src="${this.configContext.getData('host')}${findPropertyByPattern(this.data.getState()?.data, ['image'])}">`
            : html`<div class="card-image default-image dynamic-background">${this.data.getState()?.data?.name}</div>`

        const templateDefault = html`
            <!-- Close Button -->
            <button class="close-button">${CLOSE}</button>

            <!-- Card -->
            <div class="card">

                <!-- Card Image -->
                <div class="card-image-wrapper">
                    ${templateCardImage}
                </div>

                <!-- Card Content -->
                <div class="card-content-wrapper">
                    <!-- Card Service -->
                    <span class="card-service">${findPropertyByPattern(this.data.getState(), ['service'])}</span>

                    <!-- Card Origin -->
                    <span class="card-origin-wrapper">
                        <span class="card-origin">
                            ${findPropertyByPattern(this.data.getState()?.data, [
                                'origin', 
                                'institution', 
                                'university_origin', 
                                'home_partner_institution'
                            ])}
                        </span>
                        <span class="card-breadcrumb">${templateCardBreadcrumb}</span>
                    </span>

                    <!-- Card Data -->
                    <span class="card-name">${findPropertyByPattern(this.data.getState()?.data, ['name'])}</span>
                    <span class="card-lastname">${findPropertyByPattern(this.data.getState()?.data, ['lastname'])}</span>
                    <span class="card-summary">
                        ${findPropertyByPattern(
                            this.data.getState()?.data, 
                            ['summary', 'abstract', 'description', 'info', 'details', 'content', 'text', 'body']
                        )}
                    </span>

                    <!-- Inner Actions -->
                    <div class="card-actions__separator"></div>
                    <div class="card-actions__inner">
                        <button 
                            class="card-explore-button"
                            data-url="${this.buildDetailUrl()}"
                        >Explore</button>
                    </div>
                </div>

                <!-- Card Actions -->
                <div class="card-actions">
                    <button 
                        class="card-explore-button"
                        data-url="${this.buildDetailUrl()}"
                    >Explore</button>
                </div>
            </div>

            <!-- Carousel Controls -->
            <div class="controls-wrapper">
                <span class="prev-control">${ARROW_LEFT}</span>
                <span class="next-control">${ARROW_RIGHT}</span>
            </div>
        `
        const templateNoCardDisplayed = html`
            <div class="no-card-displayed">
                <span class="no-card-displayed-text">No card displayed</span>
            </div>
        `

        /* TEMPLATE RENDERING */
        if (
            !this.displayedCardId.getState() ||
            !this.data.getState()
        ) return templateNoCardDisplayed

        return templateDefault
    }

    listeners() {
        this.wrapper.onclick = (e) => this.close(e)

        if (this.$('.prev-control')) this.$('.prev-control').onclick = () => this.setPreviousCardId()
        if (this.$('.next-control')) this.$('.next-control').onclick = () => this.setNextCardId()

        if (this.$('.card-explore-button')) this.$('.card-explore-button').onclick = () => this.navigateToDetail()

        document.addEventListener('keydown', (e) => this.handleKeyDown(e))
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.close()
        }
    }
    
    show() {
        this.wrapper.classList.add('visible')
    }

    close(e) {
        if (!e) {
            this.wrapper.classList.remove('visible')
            return 
        }

        if (e.target.classList.contains('close-button')) {
            this.wrapper.classList.remove('visible')
            return
        }

        e.stopPropagation()
        if (e.target === this.wrapper) {
            this.wrapper.classList.remove('visible')
        }
    }

    buildDetailUrl() {
        let viewId
        const availableWebsites = extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'websites')
            availableWebsites.forEach(item => {
                item.websites.forEach(website => {
                    if (website.model === this.data.getState()?.model) {
                        viewId = website.view_id
                    }
                })
            })

        return `${this.configContext.getData('host')}/offering/${viewId}/${this.data.getState()?.data?.id}`
    }

    navigateToDetail() {
        window.open(this.$('.card-explore-button').dataset.url, '_blank')
    }

    setDisplayedCardId(id, group) {
        this.displayedCardId.setState(id, false)
        const newData = this.resultContext.getData('data').find(card => {
            return card.data.id === id && card.service === group
        })

        this.displayedCardGroup.setState(newData.service, false)
        this.data.setState(newData)
        this.updateNavigationButtonsVisibility(id)
        this.show()
    }

    updateNavigationButtonsVisibility(cardId) {
        const currentGroup = this.resultContext.getData('grouped')
            .find(group => group.service === this.displayedCardGroup.getState())
        const currentIndex = currentGroup?.items
            .findIndex(item => item.data.id === cardId)
        const groupLength = currentGroup?.items?.length

        // Reset visibility
        this.$('.prev-control')?.classList.remove('hidden')
        this.$('.next-control')?.classList.remove('hidden')

        // Hide prev button if we're at the first item
        if (currentIndex === 0) {
            this.$('.prev-control')?.classList.add('hidden')
        }

        // Hide next button if we're at the last item
        if (currentIndex === groupLength - 1) {
            this.$('.next-control')?.classList.add('hidden')
        }
    }

    setNextCardId() {
        const currentGroup = this.resultContext.getData('grouped')
            .find(group => group.service === this.displayedCardGroup.getState())
        const currentCardIndex = currentGroup?.items
            .findIndex(item => item.data.id === this.displayedCardId.getState())
        const nextCard = currentGroup?.items[currentCardIndex + 1]

        if (nextCard) {
            this.displayedCardId.setState(nextCard.data.id, false)
            this.data.setState(nextCard)
            this.updateNavigationButtonsVisibility(nextCard.data.id)
            this.show()
        }
    }

    setPreviousCardId() {
        const currentGroup = this.resultContext.getData('grouped')
            .find(group => group.service === this.displayedCardGroup.getState())
        const currentCardIndex = currentGroup?.items
            .findIndex(item => item.data.id === this.displayedCardId.getState())
        const previousCard = currentGroup?.items[currentCardIndex - 1]

        if (previousCard) {
            this.displayedCardId.setState(previousCard.data.id, false)
            this.data.setState(previousCard)
            this.updateNavigationButtonsVisibility(previousCard.data.id)
            this.show()
        }
    }
}

export default window.customElements.define('agora-card-info-carousel-v2', CardInfoCarouselV2) 