import { CONFIG } from "../../../../agora.config"
import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"
import { ITEM_TYPE } from "../../../constants/itemType.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { stringifyReplacer } from "../../../utils/parsingHelper.util"

/* Icons */
import { UNFOLD, FOLD } from "../../../icons/icons"

/* Services */
import * as api from "../../../services/api.service"

class Navigator extends PlainComponent {
    constructor() {
        super('agora-navigator', `${PATHS.BASE_COMPONENTS}/Navigator/Navigator.css`)

        this.signals = new PlainSignal(this)

        this.configContext = new PlainContext('config', this, false)
        this.resultContext = new PlainContext('result', this, true)
        this.serviceContext = new PlainContext('service', this, false)

        this.error = new PlainState(null, this)
        this.items = new PlainState(null, this)

        this.ensureConfig()
        this.fetchItems()
    }

    ensureConfig() {
        const app = window.document.querySelector('agora-app')
        const customConfig = {
            "name": app.getAttribute('name') ?? CONFIG.name,
            "host": app.getAttribute('host') ?? CONFIG.host,
            "company_id": app.getAttribute('company_id') ?? CONFIG.company_id,
            "enabled_ai": app.hasAttribute('enabled_ai') ?? CONFIG.enabled_ai,
            "ai_host": app.getAttribute('ai_host') ?? CONFIG.ai_host
        }

        this.configContext.setData(customConfig)
    }

    template() {
        if (this.error.getState()) return html`
            <div class="error-wrapper">
                <h1>Oops! Looks like an error...</h1>
                <p>Something went wrong while connecting to the server.<br> Wait some seconds and try reloading the page.</p>
            </div>
        `

        if (!this.items.getState()) return html`
            <agora-base-loader width="500" height="500"></agora-base-loader>
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
            <div class="menu-unfold-button">${UNFOLD}</div>
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

    listeners() {
        if (this.$('.menu-unfold-button')) {
            this.$('.menu-unfold-button').onclick = () => this.toogleMenu()
        }
    }

    toogleMenu() {
        this.$('.menu').classList.toggle('expanded')

        if (this.$('.menu').classList.contains('expanded')) {
            this.$('.menu-unfold-button').innerHTML = FOLD
        } else {
            this.$('.menu-unfold-button').innerHTML = UNFOLD
        }
    }

    /* DATA FETCHING */
    async fetchItems() {
        try {
            const agora = await api.fetchAgoraServices(this.configContext.getData('host'), this.configContext.getData('company_id'))

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

            // Filter just active services (this have to be moved to the backend)
            services = services.filter(service => service.fields.stage === 'active')

            this.items.setState(services)
            this.serviceContext.setData({services: services}, true)
        }

        catch (error) {
            this.error.setState(error)
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