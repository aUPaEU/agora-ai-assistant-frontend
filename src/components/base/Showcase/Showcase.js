import { PlainComponent, PlainState } from "plain-reactive"
import { html } from "../../../utils/templateTags.util"
import { gsap } from "gsap"
import { PATHS } from "../../../constants/paths.const"
import { BOOST } from "../../../icons/icons"
import * as api from "../../../services/api.service"

class Showcase extends PlainComponent {
    constructor() {
        super('agora-showcase', `${PATHS.BASE_COMPONENTS}/Showcase/Showcase.css`)

        this.loading = new PlainState(true, this)
        this.error = new PlainState(null, this)
        this.data = new PlainState(null, this)
        this.lastShown = new PlainState(null, this)
        this.updateTime = new PlainState(7500, this)

        this.fetchData()
    }

    template() {
        if (this.loading.getState()) {
            return html`
                <h1>Loading...</h1>
            `
        }

        else if (this.error.getState()) {
            return html`
                <h1>Error!</h1>
            `
        }

        else if (this.data.getState()) {
            const randomItem = this.displayRandomItem()
            return html`
                <div class="item-info">
                    <div>
                        <h1>${randomItem.name}</h1>
                        <span class="icon">${BOOST}</span>
                    </div>
                    <p>${randomItem.description}</p>
                </div>
                <div class="item-link">
                    <span>
                        <agora-text-button class="learn-more-button" href="${randomItem.link}">Learn more</agora-text-button>
                    </span>
                </div>
                
            `
        }
    }

    listeners() {
        this.$('.learn-more-button').onClick.setState(() => {
            // Navigate to the link
            window.open(this.$('.learn-more-button').getAttribute('href'), '_blank')
        })
    }

    flattenData(obj) {
        let flattened = {}

        Object.keys(obj).forEach(key => {
            flattened[key] = obj[key]
            console.log(Object.keys(obj[key].subServices).length, "Sub services")
            if (Object.keys(obj[key].subServices).length > 0) {
                flattened = {...flattened, ...this.flattenData(obj[key].subServices)}
            }
        })

        console.log(flattened)
        return flattened
    }

    displayRandomItem() {
        // Get all keys
        const keys = Object.keys(this.data.getState());

        // Select a random key
        const randomKey = keys[Math.floor(Math.random() * keys.length)];

        // Ensure that the last shown item is not the same as the current one
        if (this.lastShown.getState() === randomKey) {
            return this.displayRandomItem()
        }

        // Set the last shown item
        this.lastShown.setState(randomKey, false)

        // Set a timeout to re-render the component
        setTimeout(() => {
            // Animate the component to exit it and when animation ends, re-render it
            gsap.to(this, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    this.render()

                    setTimeout(() => {
                        gsap.to(this, {
                            opacity: 1,
                            duration: 0.5
                        });
                    }, 500)
                }
            })
        }, this.updateTime.getState())

        // Use the key to get the value
        return {'name': randomKey, ...this.data.getState()[randomKey]};
    }

    async fetchData() {
        const items = await api.fetchAccelerationServicesV1()
        const flattenedData = this.flattenData(items)
        this.data.setState(flattenedData, false)
        this.loading.setState(false)

        console.log(this.data.getState())
    }
}

export default window.customElements.define("agora-showcase", Showcase)