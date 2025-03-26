import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"
import { CARD_TYPE } from "../../../constants/cardType.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { stringifyReplacer } from "../../../utils/parsingHelper.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import { clamp } from "../../../utils/mathHelper.util"

/* Icons */
import { SUBTRACT } from "../../../icons/icons"

/* Services */
import * as api from "../../../services/api.service"

class ResultWindow extends PlainComponent {
    constructor() {
        super('agora-result-window', `${PATHS.MID_COMPONENTS}/ResultWindow/ResultWindow.css`)

        this.configContext = new PlainContext('config', this, false)
        this.resultContext = new PlainContext('result', this, true)
        this.serviceContext = new PlainContext('service', this, true)

        this.signals = new PlainSignal(this)
        this.signals.register('cards-fetched') // This signal is used to send the data of a card to the carousel component

        this.builtResults = new PlainState([], this)
        this.isLoading = new PlainState(false, this)

        this.scrollInterval = null
        this.currentScrollSpeed = 0
        this.scrollTreshold = 0.2
        this.scrollSpeed = 0.25
        this.speedMultiplier = 6

        this.configContext.getData('enabled_ai') ? null : this.clear()
    }

    template() {
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

        // Condition to hide the component if there are no results
        if (data.length === 0) {
            this.style.display = 'none'
        } else {
            this.style.display = 'block'
        }

        return html`
            <!-- No Results Message -->
            <div class="no-results-message" style="display: none;">
                <h1>No results found</h1>
                <p>Try changing the search terms.</p>
            </div>

            <!-- Result counter -->
            <!-- TODO -->

            <!-- Cards -->
            <div class="card-wrapper">
                ${
                    data.map(item => {
                        const serviceName = item.service.toLowerCase().replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '').replace(/  /g, '-').replace(/ /g, '-')
                        return html`
                            <div class="${serviceName}-wrapper" data-name="${item.service}">
                                <div class="movable-wrapper">
                                    ${
                                        item.items.map(record => {
                                            const card = this.createCardObject(record)
                                            return html`
                                                <agora-dynamic-card 
                                                    id="${card.id}"
                                                    class="fade-in"
                                                    href="${`${this.configContext.getData('host')}/offering/${card.view_id}/${card.id.split('-')[1]}`}"
                                                    type="${card.type}"
                                                    model="${card.model}"
                                                    model-verbose-name="${card.model_verbose_name}"
                                                    service="${card.service}"
                                                    data-data='${card.dataset}'
                                                    featured-fields="${card.featured_fields}"
                                                    featured="${card.featured}"
                                                    absolute-score="${card.score.absolute}"
                                                    relative-score="${card.score.relative}"
                                                ></agora-dynamic-card>
                                            `
                                        }).join('')
                                    }
                                </div>
                            </div>
                        `
                    }).join('')
                }
            </div>

            <!-- Greetings -->
            <agora-greetings class="hidden" hidden="true"></agora-greetings>
            
            <!-- Loader -->
            ${this.isLoading.getState() 
                ? html`
                    <agora-base-loader width="100" height="100"></agora-base-loader>
                `
                : html `
                    
                `
            }
        `
    }

    listeners() {
        // Manages the service highlightning in the navigator when the user hovers over an item
        Array.from(this.$('.card-wrapper').children).forEach(serviceWrapper => {
            const boundHandleCursorScroll = (e) => this.handleCursorScroll(e, serviceWrapper)
            const movableWrapper = serviceWrapper.querySelector('.movable-wrapper')

            serviceWrapper.onmouseenter = () => {
                document.addEventListener('mousemove', boundHandleCursorScroll)
                this.highlightServiceOnHover(serviceWrapper, true)

                // Start a single interval when the mouse enters
                this.scrollInterval = setInterval(() => {
                    if (this.currentScrollSpeed !== 0) {
                        movableWrapper.scrollLeft += this.currentScrollSpeed
                    }
                }, 0.01)
            }
            serviceWrapper.onmouseleave = () => {
                clearInterval(this.scrollInterval)
                this.scrollInterval = null
                this.currentScrollSpeed = 0

                document.removeEventListener('mousemove', boundHandleCursorScroll)
                this.highlightServiceOnHover(serviceWrapper, false)
            }

            // Handle scroll visuals
            this.handleCardWrapperScroll(serviceWrapper.querySelector('.movable-wrapper'))
        })

        // Manage lateral fades in the scrollable wrapper when the user scrolls
        this.$$('.movable-wrapper').forEach(wrapper => {
            wrapper.onscroll = () => this.handleCardWrapperScroll(wrapper)
        })

        // Unfolds the card wrapper when the user clicks on the show more button (not featured results)
        if (this.$('.show-more')) {
            this.$('.show-more').onclick = (e) => this.$('.show-more').classList.contains('folded') 
                ? this.unfoldCardWrapper(e) 
                : this.foldCardWrapper(e)
        }
    }

    clear() {
        this.resultContext.setData({data: [], grouped: []})
        this.builtResults.setState([])
    }

    /* Card Creation & Management */
    createCardObject(record) {
        const availableWebsites = extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'websites')

        const data = {
            type: CARD_TYPE.ITEM,
            id: `element-${record.data.id}`,
            model: record.model,
            model_verbose_name: record.model_verbose_name,
            service: record.service,
            featured_fields: record.featured_fields || [],
            dataset: JSON.stringify(record.data, stringifyReplacer),
            score: {
                absolute: record.score.absolute || 1,
                relative: record.score.relative || 1
            }
        }

        availableWebsites.forEach(item => {
            item.websites.forEach(website => {
                if (website.model === data.model) {
                    data.view_id = website.view_id
                }
            })
        })

        return data
    }

    countResults(service) {
        const results = this.resultContext.getData('data').find(result => result.service === service)
        const numElementIds = results.element_ids.length
        const numFeaturedElementIds = results.featured_element_ids.length
        const notFeaturedElementIds = numElementIds - numFeaturedElementIds

        return {
            numElementIds,
            numFeaturedElementIds,
            notFeaturedElementIds
        }
    }

    /* Scroll & Display Handlers */
    handleCardWrapperScroll(wrapper) {
        const scrollLeft = wrapper.scrollLeft
        const maxScroll = wrapper.scrollWidth - wrapper.clientWidth

        if (scrollLeft < 10) {
            // Set wrapper::before opacity to 1
            wrapper.classList.remove('scroll-left-active')
        }

        if (scrollLeft > 10) {
            // Set wrapper::before opacity to 0
            wrapper.classList.add('scroll-left-active')
        }

        if (maxScroll - scrollLeft < 10) {
            // Set wrapper::after opacity to 1
            wrapper.classList.remove('scroll-right-active')
        }

        if (maxScroll - scrollLeft > 10) {
            // Set wrapper::after opacity to 0
            wrapper.classList.add('scroll-right-active')
        }
    }

    handleCursorScroll(e, wrapper) {
        const movableWrapper = wrapper.querySelector('.movable-wrapper')
        const wrapperVisibleWidth = wrapper.clientWidth

        // If wrapper is smaller than movable wrapper there's no scroll bar so we return
        if (movableWrapper.scrollWidth <= wrapperVisibleWidth + 50) return

        const wrapperRect = wrapper.getBoundingClientRect()

        // Create the interval that recalculates the cursor position
        const wrapperXCenter = wrapperRect.x + wrapperRect.width / 2
        const cursorXPosition = e.clientX
        const cursorDistanceToWrapperCenter = Math.round(wrapperXCenter - cursorXPosition) * -1
        const cursorDistancePercentage = clamp(
            Math.round(cursorDistanceToWrapperCenter / wrapperVisibleWidth * 100) / 100 * 2.0, -1.0, 1.0
        )

        if (Math.abs(cursorDistancePercentage) > this.scrollTreshold) {
            const direction = Math.sign(cursorDistancePercentage)
            // const speedFactor = Math.pow(Math.abs(cursorDistancePercentage), 2) // Exponential factor
            const speedFactor = Math.abs(cursorDistancePercentage) * this.speedMultiplier // Linear factor
            this.currentScrollSpeed = direction * (this.scrollSpeed + speedFactor)
        } else {
            this.currentScrollSpeed = 0
        }
    }

    unfoldCardWrapper(e) {
        const showMoreButton = e.target
        showMoreButton.classList.remove('folded')
        showMoreButton.innerHTML = SUBTRACT

        const wrapper = this.$('.show-more').parentElement.querySelector('.movable-wrapper')
        Array.from(wrapper.children).forEach(card => {
            if (!card.hasAttribute('featured')) {
                card.style.display = 'block'
            }
        })

        this.handleCardWrapperScroll(wrapper)
    }

    foldCardWrapper(e) {
        const showMoreButton = e.target
        showMoreButton.classList.add('folded')
        showMoreButton.innerHTML = `+${this.countResults(showMoreButton.parentElement.dataset.name).notFeaturedElementIds}`

        const wrapper = this.$('.show-more').parentElement.querySelector('.movable-wrapper')
        Array.from(wrapper.children).forEach(card => {
            if (!card.hasAttribute('featured')) {
                card.style.display = 'none'
            }
        })

        this.handleCardWrapperScroll(wrapper)
    }

    /* Navigation & Highlighting */
    highlightServiceOnHover(wrapper, state) {
        const app = document.querySelector('agora-app')
        const layout = app.$('agora-layout-v2')
        const navigator = layout.$('agora-navigator')
        const navigatorItems = navigator.$$('agora-navigator-item')

        navigatorItems.forEach((item) => {
            if (state) {
                if (item.dataset.name === wrapper.dataset.name) {
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

    displayNoResultsMessage() {
        this.style.display = 'block'
        this.$('.no-results-message').style.display = 'grid'
    }
}

export default window.customElements.define('agora-result-window', ResultWindow)