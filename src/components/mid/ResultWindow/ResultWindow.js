import { PlainComponent, PlainState, PlainContext } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { CARD_TYPE } from "../../../constants/cardType.const"
import { CONFIG } from "../../../../agora.config"

import { html } from "../../../utils/templateTags.util"
import { stringifyReplacer } from "../../../utils/parsingHelper.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import * as api from "../../../services/api.service"

class ResultWindow extends PlainComponent {
    constructor() {
        super('agora-result-window', `${PATHS.MID_COMPONENTS}/ResultWindow/ResultWindow.css`)

        this.resultContext = new PlainContext('result', this, true)
        this.serviceContext = new PlainContext('service', this, true)

        this.builtResults = new PlainState([], this)
        this.isLoading = new PlainState(false, this)
    }

    template() {
        const results = this.resultContext.getData('data')
        results && results.length > 0
            ? this.showResults()
            : this.hideResults()

        return html`
            <!-- Cards -->
            <div class="card-wrapper">
                ${
                    this.resultContext.getData('data') 
                        ? this.resultContext.getData('data').map((result) => {
                            const serviceName = result.service.toLowerCase().replace(/ /g, '-').replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '')
                            return html`
                                <!-- <span class="service-name">${result.service}</span> -->
                                <div class="${serviceName}-wrapper"></div>
                            `
                        }).join('')
                        : ``
                }
            </div>

            <!-- Greetings -->
            <agora-greetings class=${results ? "hidden" : ''}></agora-greetings>
            
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

    showResults() {
        this.wrapper.classList.add('showing-results')
        this.isLoading.setState(true, false)
        this.fetchResults()
    }

    hideResults() {
        this.wrapper.classList.remove('showing-results')
    }

    async fetchResults() {
        let timerDelay = 1000
        // We get the data for each item from the resultContext
        // and we set it in the builtResults state
        const results = this.resultContext.getData('data')

        results.forEach((result) => {
            result.element_ids.forEach(async (element) => {
                console.log(result.model, element)
                const response = await api.fetchElement(result.model, element)
                if (!response.id) return

                const newCard = {
                    type: CARD_TYPE.ITEM,
                    id: `element-${response.id}`,
                    model: result.model,
                    service: result.service,
                    dataset: JSON.stringify(response, stringifyReplacer)
                }

                timerDelay += 500

                // This timeout is used to add the card to the DOM after a delay 
                // Just for aesthetic and animation purposes
                setTimeout(() => {
                    this.addCard(newCard)

                    if (
                        result === results.at(-1) && 
                        Number(newCard.id.split('-')[1]) === Number(result.element_ids.at(-1))
                    ) {
                            // We set the loading state to false after the last card has been added
                            setTimeout(() => {
                                this.isLoading.setState(false, false)
                                this.setLoading(false)
                            }, 500)
                    }
                }, timerDelay)
            })

        })

        console.log(this.builtResults.getState())
    }

    addCard(card) {
        const availableWebsites = extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'websites')
        availableWebsites.forEach(item => {
            item.websites.forEach(website => {
                if (website.model === card.model) {
                    card.view_id = website.view_id
                }
            })
        })
        console.log(availableWebsites)

        const newCard = document.createElement('agora-dynamic-card')
        newCard.id = card.id
        newCard.setAttribute('href', `${CONFIG.host}/offering/${card.view_id}/${card.id.split('-')[1]}`)
        newCard.setAttribute('type', card.type)
        newCard.setAttribute('model', card.model)
        newCard.setAttribute('service', card.service)
        newCard.setAttribute('data-data', card.dataset)
        newCard.classList.add('fade-in')

        const serviceName = card.service.toLowerCase().replace(/ /g, '-').replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '')
        const serviceWrapper = this.$(`.${serviceName}-wrapper`)
        serviceWrapper.appendChild(newCard)
    }

    setLoading(state) {
        if (state) {
            this.$('agora-base-loader').wrapper.classList.add('fade-in')
        } else {
            this.$('agora-base-loader').wrapper.classList.remove('fade-in')
            this.$('agora-base-loader').wrapper.classList.add('fade-out')
        }
    }

}

export default window.customElements.define('agora-result-window', ResultWindow)