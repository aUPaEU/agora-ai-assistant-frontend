import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import { capitalize } from "../../../utils/parsingHelper.util"

/* Icons */
import { SEARCH, AUPAEU_LOGO, UNFOLD, FOLD } from "../../../icons/icons"

/* Services */
import * as api from "../../../services/api.service"

class Searchbar extends PlainComponent {
  constructor() {
    super('agora-searchbar', `${PATHS.BASE_COMPONENTS}/Searchbar/Searchbar.css`)

    this.currentSource = new PlainState('all', this)

    this.resultContext = new PlainContext('result', this, false)
    this.serviceContext = new PlainContext('service', this, false)
    this.searchHistoryContext = new PlainContext('searchHistory', this, false) // We'll use this to autocomplete queries

    this.signals = new PlainSignal(this)
    this.signals.register('search-results-updated')
  }

  template() {
    return html`
        <div class="source-select folded">
            <span class="source-option selected" data-model="all">All</span>
            ${
                this.getAvailableModels().map((model) => html`
                    <span class="source-option" data-model="${model.replace('.', '_')}">${capitalize(model.split('.')[0])} ${capitalize(model.split('.')[1])}</span>
                `).join('')
            }
        </div>
        <span class="source-select-unfold-button">${UNFOLD}</span>
        <input class="searchbar-input folded" type="text" placeholder="Search..."/>
        <span class="agora-logo">${AUPAEU_LOGO}</span>
        <button class="searchbar-button">${SEARCH}</button>
    `
  }

  listeners() {
    this.$('.searchbar-input').onkeydown = (e) => this.handleIntro(e)
    this.$('.searchbar-input').onfocus = () => this.unfold()
    this.$('.searchbar-input').onblur = (e) => this.fold(e)

    this.$('.searchbar-button').onclick = () => this.query()

    this.$$('.source-option').forEach(option => option.onclick = (e) => this.selectOption(e))

    this.$('.source-select-unfold-button').onclick = () => this.toogleFoldSelect()
  }

  async query() {
    this.storeQueryInContext(this.$('.searchbar-input').value)

    const models = this.currentSource.getState() === 'all' 
        ? extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'model').map(model => model.model)
        : [this.currentSource.getState()]

    if (this.$('.searchbar-input').value.length === 0) return

    try {
      const response = await api.search(this.$('.searchbar-input').value, models)

      this.handleResponse(response)

      this.$('.searchbar-input').value = ''
    }

    catch(error) {
      throw error
    }

  }

  handleResponse(response) {
    if (response.results.length === 0) return

    const serviceModels = [...new Set(this.serviceContext.getData('services').map((service) => {
        return {
            "service": service.fields.name,
            "models": extractObjectsWithMatchingKey(service, 'model').map(model => model.model)
        }
    }))]

    response.results.forEach(result => {
        const resultService = serviceModels.find(service => service.models.includes(result.model)).service
        result.service = resultService
    })

    console.log("Results:", response.results)
    this.signals.emit('search-results-updated', response.results)
  }

  handleIntro(e) {
    if (e.key !== 'Enter') return
    this.query()
  }   

  unfold() {
    this.$('.searchbar-input').classList.remove('folded')
  }

  fold(e) {
    this.$('.searchbar-input').classList.add('folded')
  }

  toogleFoldSelect() {
    this.$('.source-select').classList.toggle('folded')
    this.$('.source-select-unfold-button').innerHTML = this.$('.source-select').classList.contains('folded') ? UNFOLD : FOLD
  }

  selectOption(e) {
    const options = this.$$('.source-option')
    const selectedOption = Array.from(options).find(option => option.classList.contains('selected'))
    selectedOption.classList.remove('selected')
    e.target.classList.add('selected')

    this.currentSource.setState(e.target.dataset.model, false)

    setTimeout(() => this.toogleFoldSelect(), 300)
  }

  getAvailableModels() {
    return extractObjectsWithMatchingKey(
        this.serviceContext.getData('services'), 'model'
    ).map(model => model.model)
  }

  storeQueryInContext(query) {
    // TODO
  }
}

export default window.customElements.define('agora-searchbar', Searchbar)