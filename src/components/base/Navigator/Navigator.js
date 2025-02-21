import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"
import { ITEM_TYPE } from "../../../constants/itemType.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { stringifyReplacer } from "../../../utils/parsingHelper.util"

/* Services */
import * as api from "../../../services/api.service"

class Navigator extends PlainComponent {
    constructor() {
        super('agora-navigator', `${PATHS.BASE_COMPONENTS}/Navigator/Navigator.css`)

        this.signals = new PlainSignal(this)

        this.resultContext = new PlainContext('result', this, true)
        this.serviceContext = new PlainContext('service', this, false)

        this.error = new PlainState(null, this)
        this.items = new PlainState(null, this)

        this.fetchItems()
    }

    template() {
        if (!this.items.getState()) return html`
            <agora-base-loader width="500" height="500"></agora-base-loader>
        `

        if (this.error.getState()) return html`
            <h1>Error!</h1>
            <p>${this.error.getState()}</p>
        `
        const services = this.resultContext.getData('data') 
            ? [...new Set(this.resultContext.getData('data').map(result => result.service))]
            : []

        const servicesInResult = (serviceName) => {
            const results = this.resultContext.getData('data')
            if (!results || results.length === 0) return true

            return services.includes(serviceName)
        }

        return html`
            <ul class="menu">
                ${Object.entries(this.items.getState()).map(
                    ([index, data]) => {
                        return html`
                            <agora-navigator-item 
                                class="${servicesInResult(data.fields.name) ? '' : 'not-in-result'}"
                                data-name='${data.fields.name}'
                                data-info='${JSON.stringify(data.fields, stringifyReplacer)}'
                                data-type='${ITEM_TYPE.ACCELERATION_SERVICE}'>
                            </agora-navigator-item>
                        `
                }).join('')}
            </ul>
        `
    }

    /* DATA FETCHING */
    async fetchItems() {
        try {
            const agora = await api.fetchAgoraServices()

            let services = []

            if (agora.items[0].fields.sub_acceleration_services.length === undefined) {
                services = [agora.items[0].fields.sub_acceleration_services]
            }

            else if (agora.items[0].fields.sub_acceleration_services.length > 1) {
                services = [...agora.items[0].fields.sub_acceleration_services]
            }

            services.sort((a, b) => {
                if (a.fields.name < b.fields.name) return -1
                if (a.fields.name > b.fields.name) return 1
                return 0
            })

            this.items.setState(services)
            console.log("Services has been fetched", services)
            this.serviceContext.setData({services: services}, true)
        }

        catch (error) {
            this.error.setState(error)
            throw error
            console.error("Exception manage when fetching services have to be implemented", error)
        }
    }

    initialDisplay() {
        Array.from(this.$('.menu').children).forEach(item => {
            console.log("ITEM", item)
            item.classList.remove('not-in-result')
        })
    }
}

export default window.customElements.define('agora-navigator', Navigator)