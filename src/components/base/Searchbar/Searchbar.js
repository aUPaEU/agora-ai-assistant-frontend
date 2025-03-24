import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"

/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { html } from "../../../utils/templateTags.util"
import { extractObjectsWithMatchingKey } from "../../../utils/objectHelper.util"
import { isDebugMode } from "../../../utils/core.util"
import { translate } from "../../../utils/translator.util"

/* Icons */
import { SEARCH, AUPAEU_LOGO} from "../../../icons/icons"

/* Services */
import * as api from "../../../services/api.service"

class Searchbar extends PlainComponent {
  constructor() {
    super('agora-searchbar', `${PATHS.BASE_COMPONENTS}/Searchbar/Searchbar.css`)

    //this.defaultTreshold = 0.45
    this.defaultTreshold = 0.05

    this.configContext = new PlainContext('config', this, false)
    this.resultContext = new PlainContext('result', this, false)
    this.serviceContext = new PlainContext('service', this, false)
    this.searchContext = new PlainContext('search', this, false, 'local') // We'll use this to autocomplete queries

    this.currentSource = new PlainState('all', this)

    this.signals = new PlainSignal(this)
    this.signals.register('results-updated')
    this.signals.register('no-results')
  }

  template() {
    return html`
        <!-- Score Treshold -->
        <div class="treshold">
          ${
            isDebugMode()
              ? html`
                <input type="range" min="0" max="1" value="0.35" step="0.01" id="treshold"/>
                <label class="treshold-label" for="treshold">A: 0.35</label>
              `
              : html``
          }
        </div>

        <!-- Searchbar Input -->
        <input 
          class="searchbar-input folded" 
          type="text" 
          placeholder="${this.searchContext.getData('current') && this.searchContext.getData('current').length > 0
              ? `${this.searchContext.getData('current').join(' ')}`
              : `Search...`
          }"/>
        <span class="agora-logo">${AUPAEU_LOGO}</span>
        <button class="searchbar-button">${SEARCH}</button>

        <!-- Autocomplete Dropdown -->
        <ul class="autocomplete-dropdown"></ul>
    `
  }

  listeners() {
    this.$('.searchbar-input').onkeydown = (e) => this.handleKeyDown(e)
    this.$('.searchbar-input').onfocus = () => this.unfold()
    this.$('.searchbar-input').onblur = () => this.fold()
    this.$('.searchbar-input').oninput = () => this.autocompleteWhileTyping()

    this.$('.searchbar-button').onclick = () => this.query()

    if (this.$('#treshold')) {
      this.$('#treshold').oninput = (e) => this.$('.treshold-label').innerHTML = `A: ${e.target.value}`
    }
  }

  /* Search & Query Handling */
  async query() {
    // If there's no text in the input we just return
    if (this.$('.searchbar-input').value.length === 0) return

    /* const translatedQuery = await translate(this.$('.searchbar-input').value, navigator.language.split('-')[0]) */
    const translatedQuery = await translate(this.$('.searchbar-input').value)
    console.log(translatedQuery)

    // We extract all the availablel models in the Agora from the service context
    const models = this.currentSource.getState() === 'all' 
        ? extractObjectsWithMatchingKey(this.serviceContext.getData('services'), 'model').map(model => model.model)
        : [this.currentSource.getState()]

    // We call the elasticsearch api to get search results
    try {
      const query = {
        raw: this.$('.searchbar-input').value,
        translated: translatedQuery
      }

      const response = await api.search(this.configContext.getData('host'), query.translated, models)

      this.handleResponse(query, response)

      /* this.$('.searchbar-input').placeholder = this.searchContext.getData('current').join(' ').replace(/\/$/, '') */
      this.$('.searchbar-input').placeholder = query.raw
      this.$('.searchbar-input').value = ''
    }

    catch(error) {
      const errorData = JSON.parse(error.message)

      if (errorData.missing_model) {
        await api.ingest(this.configContext.getData('host'), errorData.missing_model)
        console.warn(`Ingesting missing data from the model: '${errorData.missing_model}' into Elasticsearch`)

        this.query()
      }
    }
  }

  handleResponse(query, response) {
    // If the response is empty, we return
    if (response.results.length === 0) {
      // Update the result context with the new results
      this.resultContext.setData({
        grouped: groupedData,
        data: filteredResults
      }, true)
      
      this.signals.emit('no-results')

      return
    }

    // We just store the query in the context if it brings results
    this.storeQueryInContext(query)

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
          roots: result.roots,
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
    let treshold = this.defaultTreshold
    if (isDebugMode()) treshold = this.$('#treshold').value

    if (type === 'absolute') return results.filter(result => result.score.absolute >= treshold)
    if (type === 'relative') return results.filter(result => result.score.relative >= treshold)
  }

  storeQueryInContext(query) {
    // TODO: There's a bug when the query have special characters and it crash. Check it!
    const queryHistory = this.searchContext.getData('history') || []

    this.searchContext.setData({
      history: [...new Set([...queryHistory, query.raw])],
      current: query.translated.split(' '),
    }, false)
  }

  /* Input Event Handlers */
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.toogleAutocompleteDropdown('fold')
      this.query()
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      
      const selectedItem = Array.from(this.$('.autocomplete-dropdown').children).find(
        item => item.classList.contains('selected-match')
      )

      if (selectedItem) {
        this.autocompleteFromDropdown()
        this.toogleAutocompleteDropdown('fold')
      } else {
        this.autocompleteFromPlaceholder(e)
      }
    }
    
    
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      this.moveThroughAutocompleteOptions('up')
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.moveThroughAutocompleteOptions('down')}
  }   

  unfold() {
    this.$('.searchbar-input').classList.remove('folded')
  }

  fold() {
    setTimeout(() => {
      this.$('.searchbar-input').classList.add('folded')
    }, 100)
  }

  /* Autocomplete Logic */
  autocompleteWhileTyping() {
    const queryHistory = this.searchContext.getData('history') || []
    const autocompleteDropdown = this.$('.autocomplete-dropdown')

    if (queryHistory.length === 0) return

    const inputValue = this.$('.searchbar-input').value

    if (inputValue.length === 0) {
      autocompleteDropdown.innerHTML = ''
      return
    }

    const inputLength = inputValue.length

    const matches = queryHistory.filter(query => {
      const slice = query.slice(0, inputLength)
      return slice === inputValue
    })

    autocompleteDropdown.innerHTML = ''

    matches.forEach(match => {
      const item = document.createElement('li')
      item.innerHTML = html`
        <div class="match-container">
          <span class="match highlighted">${match.slice(0, inputLength)}</span>
          <span class="match">${match.slice(inputLength)}</span>
        </div>
        <span class="tab-word">TAB</span>
      `
      this.setupAutocompleteOptionListener(item)
      autocompleteDropdown.appendChild(item)
    })

    const firstMatch = autocompleteDropdown.children[0]
    if (firstMatch) firstMatch.classList.add('selected-match')
  }

  autocompleteFromDropdown() {
    const selectedItem = Array.from(this.$('.autocomplete-dropdown').children).find(item => item.classList.contains('selected-match'))
    const selectedItemValue = selectedItem.querySelector('.match-container').innerText
    this.$('.searchbar-input').value = selectedItemValue
    this.$('.searchbar-input').focus()
  }

  autocompleteFromPlaceholder() {
    const placeholder = this.$('.searchbar-input').placeholder
    this.$('.searchbar-input').value = placeholder
    this.$('.searchbar-input').focus()
  }

  autocompleteFromSuggestedTag(tagValue) {
    this.$('.searchbar-input').value = tagValue
  }

  setupAutocompleteOptionListener(item) {
    item.onmouseenter = () => this.handleMatchOptionHover(item)
    item.onmouseleave = () => item.classList.remove('selected-match')
    item.onclick = () => {
      this.autocompleteFromDropdown()
      this.toogleAutocompleteDropdown('fold')
      this.$('.searchbar-input').blur()
    }
  }

  handleMatchOptionHover(selectedItem) {
    const autocompleteDropdown = this.$('.autocomplete-dropdown')

    Array.from(autocompleteDropdown.children).forEach(item => {
      item.classList.remove('selected-match')
     })

    selectedItem.classList.add('selected-match')
  }

  moveThroughAutocompleteOptions(direction) {
    const autocompleteDropdown = this.$('.autocomplete-dropdown')
    const selectedItem = Array.from(autocompleteDropdown.children).find(item => item.classList.contains('selected-match'))
    const selectedIndex = Array.from(autocompleteDropdown.children).indexOf(selectedItem)

    if (!selectedItem) {
      autocompleteDropdown.children[0].classList.add('selected-match')
      return
    }

    if (direction === 'up') {
      if (selectedIndex === 0) {
        autocompleteDropdown.children[autocompleteDropdown.children.length - 1].classList.add('selected-match')
        autocompleteDropdown.children[selectedIndex].classList.remove('selected-match')
        return
      }

      autocompleteDropdown.children[selectedIndex - 1].classList.add('selected-match')
      autocompleteDropdown.children[selectedIndex].classList.remove('selected-match')
    }

    else if (direction === 'down') {
      if (selectedIndex === autocompleteDropdown.children.length - 1) {
        autocompleteDropdown.children[0].classList.add('selected-match')
        autocompleteDropdown.children[selectedIndex].classList.remove('selected-match')
        return
      }

      autocompleteDropdown.children[selectedIndex + 1].classList.add('selected-match')
      autocompleteDropdown.children[selectedIndex].classList.remove('selected-match')
    }
  }

  toogleAutocompleteDropdown(state) {
    if (state === 'unfold') {
      this.$('.autocomplete-dropdown').style.height = '100px'
    }

    else if (state === 'fold') {
      const autocompleteDropdown = this.$('.autocomplete-dropdown')
      autocompleteDropdown.innerHTML = ''
    }
  }

  isDebugMode() {
    const queryParams = new URLSearchParams(window.location.search)
    return queryParams.get('debug') === '1'
  }

}

export default window.customElements.define('agora-searchbar', Searchbar)