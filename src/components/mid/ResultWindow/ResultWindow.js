import { CONFIG } from "../../../../agora.config"
import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"
import { CARD_TYPE } from "../../../constants/cardType.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { stringifyReplacer } from "../../../utils/parsingHelper.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"

/* Icons */
import { SUBTRACT } from "../../../icons/icons"

/* Services */
import * as api from "../../../services/api.service"

class ResultWindow extends PlainComponent {
    constructor() {
        super('agora-result-window', `${PATHS.MID_COMPONENTS}/ResultWindow/ResultWindow.css`)

        this.resultContext = new PlainContext('result', this, true)
        this.serviceContext = new PlainContext('service', this, true)

        this.signals = new PlainSignal(this)
        this.signals.register('cards-fetched') // This signal is used to send the data of a card to the carousel component

        this.builtResults = new PlainState([], this)
        this.isLoading = new PlainState(false, this)

        CONFIG.enabled_ai ? null : this.clear()
    }

    template() {
        /* const results = this.resultContext.getData('data')
        results && results.length > 0
            ? this.showResults()
            : this.hideResults() */

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

        return html`
            <!-- Fades -->
            <div class="right-fade"></div>
            <div class="left-fade"></div>

            <!-- Result counter -->
            <!-- TODO -->

            <!-- Cards -->
            <div class="card-wrapper">

                ${
                    /* this.resultContext.getData('data') 
                        ? [...new Set(
                            this.resultContext.getData('data')
                                .sort((a, b) => a.service.localeCompare(b.service))
                                .map(result => result.service)
                        )].map((result) => {
                            const serviceName = result.toLowerCase().replace(/ /g, '-').replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '')
                            return html`
                                <div class="${serviceName}-wrapper" data-name="${result}">
                                    <!-- Scrollable wrapper -->
                                    <div class="movable-wrapper"></div>

                                    <!-- Show more results -->
                                    <div class="show-more folded">+${this.countResults(result).notFeaturedElementIds}</div>
                                </div>
                            `
                        }).join('')
                        : `` */

                        data.map(item => {
                            const serviceName = item.service.toLowerCase().replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '').replace(/  /g, '-').replace(/ /g, '-')
                            return html`
                                <div class="${serviceName}-wrapper" data-name="${item.service}">
                                    <div class="movable-wrapper">
                                        <div class="autoscroll-left"></div>
                                        <div class="autoscroll-right"></div>
                                        ${
                                            item.items.map(record => {
                                                const card = this.createCardObject(record)
                                                return html`
                                                    <agora-dynamic-card 
                                                        id="${card.id}"
                                                        class="fade-in"
                                                        href="${`${CONFIG.host}/offering/${card.view_id}/${card.id.split('-')[1]}`}"
                                                        type="${card.type}"
                                                        model="${card.model}"
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
            serviceWrapper.onmouseenter = () => this.highlightServiceOnHover(serviceWrapper, true)
            serviceWrapper.onmouseleave = () => this.highlightServiceOnHover(serviceWrapper, false)

            // Handle scroll visuals
            this.handleCardWrapperScroll(serviceWrapper.querySelector('.movable-wrapper'))

            // Handle autoscroll
            let leftScrollInterval;
            let rightScrollInterval;

            serviceWrapper.querySelector('.movable-wrapper > .autoscroll-left').addEventListener('mouseenter', () => {
                leftScrollInterval = setInterval(() => {
                    serviceWrapper.querySelector('.movable-wrapper').scrollLeft -= 2
                }, 0.1)
            })

            serviceWrapper.querySelector('.movable-wrapper > .autoscroll-right').addEventListener('mouseenter', () => {
                rightScrollInterval = setInterval(() => {
                    serviceWrapper.querySelector('.movable-wrapper').scrollLeft += 2
                }, 0.1)
            })

            serviceWrapper.querySelector('.movable-wrapper > .autoscroll-left').onmouseleave = () => clearInterval(leftScrollInterval)
            serviceWrapper.querySelector('.movable-wrapper > .autoscroll-right').onmouseleave = () => clearInterval(rightScrollInterval)
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

    createCardObject(record) {
        const availableWebsites = extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'websites')

        const data = {
            type: CARD_TYPE.ITEM,
            id: `element-${record.data.id}`,
            model: record.model,
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

    showResults() {
        /* if (!CONFIG.enabled_ai) return  */
        this.wrapper.classList.add('showing-results')
        this.isLoading.setState(true, false)
        
        this.fetchResults() 
    }

    hideResults() {
        this.wrapper.classList.remove('showing-results')
    }

    // Old function (This fetch could be done in elasticsearch aswell)
    async fetchResults() {
        console.log("FETCHING RESULTS")
        let timerDelay = 1000
        // We get the data for each item from the resultContext
        // and we set it in the builtResults state
        const results = this.resultContext.getData('data')

        results
        .sort((a, b) => a.service.localeCompare(b.service))
        .forEach((result) => {
            result.element_ids.forEach(async (element) => {
                const response = await api.fetchElement(result.model, element, result.featured_fields)
                if (!response.id) return

                console.log("This is the format of the response we need", response)

                const newCard = {
                    type: CARD_TYPE.ITEM,
                    id: `element-${response.id}`,
                    model: result.model,
                    service: result.service,
                    featured_fields: result.featured_fields,
                    dataset: JSON.stringify(response, stringifyReplacer)
                }

                const parsedCard = {...newCard, dataset: response}
                const updatedBuiltResults = this.builtResults.getState()
                updatedBuiltResults.push(parsedCard)
                this.builtResults.setState(updatedBuiltResults, false)

                timerDelay += 500

                // This timeout is used to add the card to the DOM after a delay 
                // Just for aesthetic and animation purposes
                setTimeout(() => {
                    this.addCard(newCard)
                    this.signals.emit('cards-fetched')
                    console.log("CARDS FETCHED SIGNAL EMITTED")

                    if (
                        result === results.at(-1) && 
                        Number(newCard.id.split('-')[1]) === Number(result.element_ids.at(-1))
                    ) {
                            // We set the loading state to false after the last card has been added
                            setTimeout(() => {
                                this.isLoading.setState(false, false)
                                this.setLoading(false)
                                this.$('.show-more').style.display = 'grid'
                                this.$('.show-more').classList.add('opacity-fade-in')
                            }, 500)
                    }
                }, timerDelay)
            })
        })
        
    }

    addCard(card) {
        let featuredCards = this.resultContext.getData('data')
            ? extractObjectsWithMatchingKey(this.resultContext.getData('data'), 'featured_element_ids')
            : []

        featuredCards = featuredCards[0]
            ? featuredCards[0].featured_element_ids
            : []

        const availableWebsites = extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'websites')
        availableWebsites.forEach(item => {
            item.websites.forEach(website => {
                if (website.model === card.model) {
                    card.view_id = website.view_id
                }
            })
        })

        const newCard = document.createElement('agora-dynamic-card')
        newCard.id = card.id
        newCard.setAttribute('href', `${CONFIG.host}/offering/${card.view_id}/${card.id.split('-')[1]}`)
        newCard.setAttribute('type', card.type)
        newCard.setAttribute('model', card.model)
        newCard.setAttribute('service', card.service)
        newCard.setAttribute('data-data', card.dataset)
        newCard.setAttribute('featured-fields', card.featured_fields)
        newCard.classList.add('fade-in')

        if (featuredCards.includes(Number(card.id.split('-')[1]))) {
            newCard.setAttribute('featured', true)
        }

        // newCard.setAttribute('featured', true)

        const serviceName = card.service.toLowerCase().replace(/ /g, '-').replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '')
        const serviceWrapper = this.$(`.${serviceName}-wrapper > .movable-wrapper`)
        serviceWrapper.appendChild(newCard)

        this.handleCardWrapperScroll(serviceWrapper)
    }

    setLoading(state) {
        if (state) {
            this.$('agora-base-loader').wrapper.classList.add('fade-in')
        } else {
            this.$('agora-base-loader').wrapper.classList.remove('fade-in')
            this.$('agora-base-loader').wrapper.classList.add('fade-out')
        }
    }

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

    clear() {
        this.resultContext.setData({data: [], grouped: []})
        this.builtResults.setState([])
    }
}

export default window.customElements.define('agora-result-window', ResultWindow)