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

    this.treshold = 0.5

    this.currentSource = new PlainState('all', this)

    this.resultContext = new PlainContext('result', this, false)
    this.serviceContext = new PlainContext('service', this, false)
    this.searchHistoryContext = new PlainContext('searchHistory', this, false) // We'll use this to autocomplete queries

    this.signals = new PlainSignal(this)
    this.signals.register('results-updated')
  }

  template() {
    return html`
        <div class="treshold">
          <input type="range" min="0" max="1" value="0.35" step="0.01" id="treshold"/>
          <label class="treshold-label" for="treshold">A: 0.35</label>
        </div>

        <div class="source-select folded">
            <span class="source-option selected" data-model="all">All</span>
            ${
                this.getAvailableModels().map((model) => html`
                    <span class="source-option" data-model="${model.replace('.', '_')}">${capitalize(model.split('.')[0])} ${capitalize(model.split('.')[1])}</span>
                `).join('')
            }
        </div>
        <span class="source-select-unfold-button" style="display: none; pointer-events: none;">${UNFOLD}</span>
        <input class="searchbar-input folded" type="text" placeholder="Search..."/>
        <span class="agora-logo">${AUPAEU_LOGO}</span>
        <button class="searchbar-button">${SEARCH}</button>
    `
  }

  listeners() {
    this.$('.searchbar-input').onkeydown = (e) => this.handleKeyDown(e)
    this.$('.searchbar-input').onfocus = () => this.unfold()
    this.$('.searchbar-input').onblur = (e) => this.fold(e)

    this.$('.searchbar-button').onclick = () => this.query()

    this.$$('.source-option').forEach(option => option.onclick = (e) => this.selectOption(e))

    this.$('.source-select-unfold-button').onclick = () => this.toogleFoldSelect()

    this.$('#treshold').oninput = (e) => this.$('.treshold-label').innerHTML = `A: ${e.target.value}`
  }

  async query() {
    // If there's no text in the input we just return
    if (this.$('.searchbar-input').value.length === 0) return

    // We store the query in a search history so we can autocomplete later
    this.storeQueryInContext(this.$('.searchbar-input').value)

    // We extract all the availablel models in the Agora from the service context
    const models = this.currentSource.getState() === 'all' 
        ? extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'model').map(model => model.model)
        : [this.currentSource.getState()]

    // We call the elasticsearch api to get search results
    try {
      const query = this.$('.searchbar-input').value
      const response = await api.search(query, models)

      this.handleResponse(response)

      this.$('.searchbar-input').placeholder = query
      this.$('.searchbar-input').value = ''
    }

    catch(error) {
      throw error
    }

  }

  handleResponse(response) {
    // If the response is empty, we return
    if (response.results.length === 0) return

    // We get an array to store all the models of each service
    // This is used to map the results to the correct service afterwards
    const serviceModels = [...new Set(this.serviceContext.getData('services').map((service) => {
        return {
            "service": service.fields.name,
            "models": extractObjectsWithMatchingKey(service, 'model').map(model => model.model)
        }
    }))]

    // We map the results to the correct service
    response.results.forEach(result => {
        const resultService = serviceModels.find(service => service.models.includes(result.model)).service
        result.service = resultService
    })

    // Sort results by score and give the expected format to the data
    const sortedResults = response.results
      .sort((a, b) => b.score - a.score)
      .map(result => {
        return {
          model: result.model,
          service: result.service,
          featured_fields: result.featured_fields || ['web_link', 'url', 'website'],
          featured: result.featured || false, 
          data: result.data,
          score: {
            absolute: Number(result.score / this.getMaxScore(response.results)).toFixed(2) || 1.00,
            relative: Number(result.score / this.getGroupMaxScore(response.results, result.service)).toFixed(2) || 1.00
          }
        }
      })
    
    // Apply the treshold
    const filteredResults = this.applyScoreTreshold(sortedResults, 'absolute')

    // Group data by service
    const services =  [...new Set(filteredResults.map(result => result.service))].sort()

    const groupedData = (() => {
        return services.map(service => {
            const items = filteredResults.filter(result => result.service === service)
            return {
                service: service,
                items: items
            }
        })
    })()
    
    // Update the result context with the new results
    this.resultContext.setData({
      grouped: groupedData,
      data: filteredResults
    }, true)

    this.signals.emit('results-updated', groupedData)
  }

  getMaxScore(results) {
    return Math.max(...results.map(result => result.score))
  }

  getGroupMaxScore(results, service) {
    return Math.max(...results.filter(result => result.service === service).map(result => result.score))
  }

  applyScoreTreshold(results, type = 'absolute') {
    const treshold = this.$('#treshold').value
    if (type === 'absolute') return results.filter(result => result.score.absolute >= treshold)
    if (type === 'relative') return results.filter(result => result.score.relative >= treshold)
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') this.query()
    if (e.key === 'Tab') this.autocomplete(e)

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

  autocomplete(e) {
    e.preventDefault()
    const placeholder = this.$('.searchbar-input').placeholder
    this.$('.searchbar-input').value = placeholder
    this.$('.searchbar-input').focus()
  }
}

export default window.customElements.define('agora-searchbar', Searchbar)