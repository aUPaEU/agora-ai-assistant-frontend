import { CONFIG } from "../../../../agora.config"
import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"
import { ITEM_TYPE } from "../../../constants/itemType.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { stringifyReplacer } from "../../../utils/parsingHelper.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import { translateServiceIsAvailable } from "../../../utils/translator.util"
import { throwToast, TOAST_TYPES } from "../../../utils/errorHandling.util"

/* Icons */
import { UNFOLD, FOLD } from "../../../icons/icons"

/* Services */
import * as api from "../../../services/api.service"

class Navigator extends PlainComponent {
    constructor() {
        super('agora-navigator', `${PATHS.BASE_COMPONENTS}/Navigator/Navigator.css`)

        this.signals = new PlainSignal(this)
        this.signals.register('changed-agora')
        this.signals.register('changed-filters')

        this.companyContext = new PlainContext('company', this, false)
        this.configContext = new PlainContext('config', this, false)
        this.resultContext = new PlainContext('result', this, true)
        this.serviceContext = new PlainContext('service', this, false)
        this.metagoraContext = new PlainContext('metagora', this, false)

        this.error = new PlainState(null, this)
        this.items = new PlainState(null, this)
        this.initialLoad = new PlainState(true, this)
        this.filters = new PlainState([], this)

        this.ensureConfig()
        this.fetchItems()
    }

    async ensureConfig() {
        const app = window.document.querySelector('agora-app')
        const customConfig = {
            "name": app.getAttribute('name') ?? CONFIG.name,
            "host": app.getAttribute('host') ?? CONFIG.host,
            "company_id": app.getAttribute('company_id') ?? CONFIG.company_id,
            "enabled_ai": app.hasAttribute('enabled_ai') ?? CONFIG.enabled_ai,
            "ai_host": app.getAttribute('ai_host') ?? CONFIG.ai_host,
            "translation_host": app.getAttribute('translation_host'),
            "current_version": CONFIG.current_version
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

        const serviceSelected = (serviceName) => {
            const results = this.resultContext.getData('data')
            if (!results || results.length === 0) return ''

            return services.includes(serviceName) 
                ? 'selected'
                : 'unselectable'
        }

        return html`
            <div class="menu-unfold-button">${UNFOLD}</div>
            <ul class="menu">
                ${Object.entries(this.items.getState()).map(
                    ([index, data]) => {
                        return html`
                            <agora-navigator-item 
                                class="${servicesInResult(data.fields.name) ? '' : 'not-in-result'} ${this.initialLoad.getState() ? 'initial-load' : ''} ${serviceSelected(data.fields.name)}"
                                style="${
                                    this.initialLoad.getState()
                                        ? `animation-delay: ${index * 0.2}s;`
                                        : ``
                                }"
                                data-component='${data.fields.components?.fields?.name}'
                                data-name='${data.fields.name}'
                                data-info='${JSON.stringify(data.fields, stringifyReplacer)}'
                                data-type='${ITEM_TYPE.ACCELERATION_SERVICE}'>
                            </agora-navigator-item>
                        `
                }).join('')}
            </ul>
            ${
                this.items.getState()?.length === 0
                    ? html`<span >There are no currently available services for this Agora.</span>`
                    : ''
            }
        `
    }

    listeners() {
        this.$$('agora-navigator-item').forEach(item => {
            item.selected.getState()
                ? item.addToFilters()
                : item.removeFromFilters()
        })


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
            let agora

            this.configContext.getData('name') === 'Metagora'
                ? agora = await api.fetchMetagoraServices(this.configContext.getData('host'))
                : agora = await api.fetchAgoraServices(this.configContext.getData('host'), this.configContext.getData('company_id'))

            
            // We need to set the company name and the colors in the company context
            this.updateCompanyContext(agora.items[0])

            this.configContext.getData('name') === 'Metagora'
                ? this.updateMetagoraContext(agora)
                : this.updateServiceContext(agora.items[0])

            if (this.configContext.getData('name') === 'Metagora') this.$('.menu').style.display = 'none' // This hides the menu when the metagora is selected
        }

        catch (error) {
            throwToast(
                `There was an error while loading the services.\nProbably the service is down or is being restarted.`, 
                TOAST_TYPES.ERROR
            )
            this.error.setState(error)
            console.error(`ERROR WHEN LOADING SERVICES\n${error}\nProbably the service is down or is being restarted.`)
        }
    }

    updateAgora(agoraIndex, isMetagora=false) {
        console.log("Updating Agora")
        this.initialLoad.setState(true, false)
        this.resultContext.setData({data: [], grouped: [], filters: []}, false)

        const metagoraData = this.metagoraContext.getData('data')
        const agora = metagoraData.agoras[agoraIndex]

        isMetagora
            ? this.updateCompanyContext(metagoraData)
            : this.updateCompanyContext(agora)

        isMetagora 
            ? this.updateMetagoraServices(metagoraData.agoras)
            : this.updateServiceContext(agora)

        if (isMetagora) this.$('.menu').style.display = 'none' // This hides the menu when the metagora is selected

        this.signals.emit('changed-agora')
    }

    updateCompanyContext(agora) {
        const companyName = agora.fields.company.fields.name
        const companyPrimaryColor = agora.fields.primary_color
        const companySecondaryColor = agora.fields.secondary_color
        this.companyContext.setData({
            info: {
                name: companyName,
                primary_color: companyPrimaryColor,
                secondary_color: companySecondaryColor
            }
        }, true)
    }

    updateMetagoraContext(metagora) {
        const agoras = metagora.items[0].fields.sub_acceleration_services
        this.metagoraContext.setData({
            data: {
                    fields:{
                        company: metagora.items[0].fields.company,
                        primary_color: metagora.items[0].fields.primary_color,
                        secondary_color: metagora.items[0].fields.secondary_color,
                    },
                    agoras: agoras
                }
        }, false)

        this.updateMetagoraServices(agoras)
    }

    updateMetagoraServices(agoras) {
        this.serviceContext.setData({services: []}, false)
        agoras.forEach((agora) => {
            this.updateServiceContext(agora, true)
        })
        this.initialLoad.setState(false, false)
    }

    updateServiceContext(agora, extend=false) {
        let services = []

        if (agora.fields.sub_acceleration_services?.length === undefined) {
            services = [agora.fields.sub_acceleration_services]
        }

        else if (agora.fields.sub_acceleration_services?.length > 1) {
            services = [...agora.fields.sub_acceleration_services]
        }

        services.sort((a, b) => {
            if (a.fields.name < b.fields.name) return -1
            if (a.fields.name > b.fields.name) return 1
            return 0
        })

        // Filter just active services (this have to be moved to the backend)
        services = services.filter(service => service.fields.stage === 'active')

        if (extend) services = [...this.serviceContext.getData('services'), ...services]

        // Get all the available data models
        const availableModels = extractObjectsWithMatchingKey(services, 'model').map(model => model.model)
        console.log("Available models: ", availableModels)
        
        this.items.setState(services)
        if (!extend) this.initialLoad.setState(false, false)
        this.serviceContext.setData({services: services}, true)
        this.serviceContext.setData({models: availableModels})
    }

    initialDisplay() {
        Array.from(this.$('.menu').children).forEach(item => {
            console.log("ITEM", item)
            item.classList.remove('not-in-result')
        })
    }

    /* FILTERING */
    addFilter(filter) {
        if (!filter) return
        if (this.filters.getState().find(f => f.service === filter.service)) return
        this.filters.setState([...this.filters.getState(), filter], false)
        this.updateFilterContext()
    }

    removeFilter(filter) {
        if (!filter) return
        if (!filter.service) return
        if (this.resultContext.getData('data')?.length === 0 && this.filters.getState()?.length === 0) return

        // Remove search term highlights from breadcrumb 

        this.filters.setState(this.filters.getState().filter(f => f.service !== filter.service), false)
        this.updateFilterContext()
    }

    updateFilterContext() {
        this.resultContext.setData({
            data: this.resultContext.getData('data') ?? [],
            grouped: this.resultContext.getData('grouped') ?? [],
            filters: this.filters.getState()
        })

        this.signals.emit('changed-filters')
    }
}

export default window.customElements.define('agora-navigator', Navigator)