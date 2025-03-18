import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"
/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { gsap } from "gsap/gsap-core"
import { html } from "../../../utils/templateTags.util"

/* Icons */
import { BOOST, WEBSITE_LINK } from "../../../icons/icons"

class Landing extends PlainComponent {
    constructor() {
        super('agora-landing', `${PATHS.BASE_COMPONENTS}/Landing/Landing.css`)

        this.signals = new PlainSignal(this)

        this.configContext = new PlainContext('config', this, true)
        this.servicesContext = new PlainContext('service', this, true)
        this.resultContext = new PlainContext('result', this, true)

        this.servicesContext.setData({services: []})

        this.lastShown = new PlainState(-1, this)
        this.updateTime = new PlainState(10000, this)
        this.serviceTree = new PlainState(null, this)
        this.isAnimating = new PlainState(false, this)

        this.greetingsDuration = new PlainState(7500, this)
        this.isGreeting = new PlainState(false, this)
        this.isGreeted = new PlainState(false, this)
        this.greetingTimeout = null
    }

    template() {
        /* GREETING RENDERING */
        console.log(this.isGreeted.getState(), this.isGreeting.getState())
        if (!this.isGreeted.getState() && !this.isGreeting.getState()) {
            this.isGreeting.setState(true, false)

            this.greetingTimeout = setTimeout(() => {
                const greetings = this.$('agora-greetings')
                gsap.to(greetings, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        // if (!this.greetingTimeout) return

                        this.isGreeting.setState(false, false)
                        this.isGreeted.setState(true, true)

                        /* const showcase = this.$('.showcase-card-wrapper')
                        console.log(showcase)
                        
                        const showcaseCardWrapper = this.$('.showcase-card-wrapper')
                        console.log("!!!!", this.wrapper)
                        // Reset the x position
                        gsap.set(showcaseCardWrapper, {
                            opacity: 0,
                            x: -500,
                            onComplete: () => {
                                // Animate in
                                gsap.to(showcaseCardWrapper, {
                                    delay: 0.3,
                                    x: 0,
                                    opacity: 1,
                                    duration: 1
                                })
                            }
                        })

                        this.render() */
                    }
                })
            }, this.greetingsDuration.getState())
        }

        if (this.isGreeting.getState() && !this.isGreeted.getState()) return html`
            <agora-greetings></agora-greetings>
        ` 

        /* SHOWCASE RENDERING */
        const services = this.servicesContext.getData('services')

        if (
            !services ||
            !this.resultContext.getData('data') ||
            this.resultContext.getData('data').length > 0
        ) {
            this.parentElement.style.display = 'none'
            return ''
        }

        const displayedService = this.displayOrderedService(services)
        if (!displayedService) return ''

        const suggestedSearchTerms = Array.from(new Set(displayedService.fields.suggested_search_terms.split(','))).map(term => term.trim())

        const learnMoreButton = displayedService.fields.website && !(displayedService.fields.website instanceof Array) && displayedService.fields.website.fields.domain
            ? html`<agora-text-button 
                    class="learn-more-button" 
                    href="${displayedService.fields.website.fields.domain}"
                >Learn more</agora-text-button>`
            : html``

        return html`
            <div class="showcase-card-wrapper first-fade-in">
                <canvas class="node-connection-canvas"></canvas>
                <!-- Banner Image -->
                <div class="banner-image default-image">
                    <h1>${displayedService.fields.name}</h1>
                    <span class="icon">${BOOST}</span>
                </div>

                <!-- Item Image -->
                <div class="item-image-wrapper">
                    ${
                        displayedService.fields.image
                            ? html`<img class="item-image" src="${this.configContext.getData('host')}${displayedService.fields.image}" alt="${displayedService.fields.name}" />`
                            : ''
                    }
                </div>

                <!-- Item Info -->
                <div class="item-info">
                    <p>${displayedService.fields.description}</p>
                </div>

                <!-- Item Structure -->
                <span class="node-view-label">Service Content</span>
                <div class="node-wrapper">${this.renderNodeView(displayedService)}</div>

                <!-- Suggested Search Terms Tags -->
                <span class="search-tags-label">Suggested Search Terms</span>
                <div class="search-terms-wrapper">
                    ${suggestedSearchTerms.map(term => html`<span class="search-term-tag">${term}</span>`).join('')}
                </div>

                <!-- Learn More Button -->
                <div class="item-link">
                    <span>${learnMoreButton}</span>
                </div>
            </div>
        `
    }

    listeners() {
        if (this.$('.learn-more-button')) {
            this.$('.learn-more-button').onClick.setState(() => {
                window.open(this.$('.learn-more-button').getAttribute('href'), '_blank')
            })
        }

        window.addEventListener('resize', () => {
                this.drawConnections()
        })

        const tags = this.$$('.search-term-tag')
        const searchBar = document.querySelector('agora-app').$('agora-layout-v2').$('agora-searchbar')
        tags.forEach(tag => {
            tag.onclick = () => {
                searchBar.autocompleteFromSuggestedTag(tag.innerText)
            }
        })
    }

    animateShowcaseCard() {
        const card = this.$('.showcase-card-wrapper')
        gsap.to(card, {
            y: 300
        })
    }

    displayOrderedService(data) { 
        let nextIndex = this.lastShown.getState() + 1

        if (nextIndex === data.length) nextIndex = 0

        // Don't proceed if we're already showing a service
        if (this.isAnimating.getState()) return data[this.lastShown.getState()]

        this.animateShowcaseCard()

        /* this.isAnimating.setState(true, false) */

        // Set a timeout to re-render the component
        /* setTimeout(() => {
            const showcaseCardWrapper = this.$('.showcase-card-wrapper')
            console.log(showcaseCardWrapper)
            // Animate the component to exit it and when animation ends, re-render it
            gsap.to(showcaseCardWrapper, {
                opacity: 0,
                x: 500,
                duration: 0.5,
                onComplete: () => {
                    this.isAnimating.setState(false, false)
                    this.render()

                    const showcaseCardWrapper = this.$('.showcase-card-wrapper')
                    // Reset the x position
                    gsap.set(showcaseCardWrapper, {
                        opacity: 0,
                        x: 0,
                        onComplete: () => {
                            // Animate in
                            gsap.to(showcaseCardWrapper, {
                                delay: 0.3,
                                opacity: 1,
                                duration: 0.5
                            })
                        }
                    })
                }
            })
        }, this.updateTime.getState()) */

        if (!data[nextIndex]) return

        this.lastShown.setState(nextIndex, false)
        return data[nextIndex]

        // This is for testing purposes (write the index of the card you want to keep on the screen)
        /* this.lastShown.setState(2, false)
        return data[2] */
    }

    animateShowcaseCard() {
        this.isAnimating.setState(true, false)

        setTimeout(() => {
            const card = this.$('.showcase-card-wrapper')
            if (!card) return
            console.log(card)
            // Animate the component to exit it and when animation ends, re-render it
            gsap.to(card, {
                opacity: 0,
                x: 500,
                duration: 0.5,
                onComplete: () => {
                    this.isAnimating.setState(false, false)
                    this.render()
                }
            })
        }, this.updateTime.getState())
    }

    renderNodeView(service) {
        setTimeout(() => {
            //this.drawNodeConnectionBetween('a', 'b')
            this.drawConnections()
        }, 100)

        const buildDataTree = (root, type) => {
            const node = {
                type: type,
                data: root.fields,
                children: []
            }

            const subServices = root.fields.sub_acceleration_services
                ? Array.from(root.fields.sub_acceleration_services)
                : []

            const catalogues = root.fields.catalogues.websites
                ? Array.from(root.fields.catalogues.websites)
                : []

            
            if (subServices.length > 0) {
                subServices.forEach(subService => {
                    const subNode = buildDataTree(subService, 'sub-service')

                    if (subNode) {
                        node.children.push(subNode)
                    }
                })
            }

            if (catalogues.length > 0) {
                catalogues.forEach(catalogue => {
                    const subNode = {
                        type: 'catalogue',
                        data: catalogue
                    }

                    if (subNode) {
                        node.children.push(subNode)
                    }
                })
            }

            /* if (website) {
                nodes.push(buildDataTree(website))
            } */
            
            return node ? node : null
        }

        const dataTree = buildDataTree(service, 'root-service')
        this.serviceTree.setState(dataTree, false)
        
        let currentLayer = 0
        let flatData = []

        const recursive = (node, layer) => {
            if (!flatData[layer]) flatData.push([])

            flatData[layer].push(node)

            if (node.children && Array.from(node.children).length > 0) {
                Array.from(node.children).forEach(child => {
                    recursive(child, layer + 1)
                })
            }
        }

        recursive(dataTree, currentLayer)

        if (flatData.length <= 1) return ''

        return html`
            ${
                flatData.map((layer, index) => {
                    if (index === 0) return ''

                    return html`
                        <div class="layer" data-layer="${index}">
                            ${
                                layer.map(node => {
                                    return html`
                                        <div class="node ${node.type}" id="${node.data.name.toLowerCase().replaceAll(/ /g, '-')}">
                                            <span class="node-name">${node.data.name}</span>
                                            <span class="node-description">${node.data.description}</span>
                                            <div class="node-actions">
                                                <div class="node-actions-info">
                                                    ${
                                                        node.type === 'sub-service'
                                                            ? 'Service'
                                                            : 'Catalogue'
                                                    }
                                                </div>
                                                <div class="node-actions-icons">
                                                    <!-- <span class="node-action-icon">${WEBSITE_LINK}</span> -->
                                                </div>
                                            </div> 
                                        </div>
                                    `
                                }).join('')
                            }
                        </div>
                    `
                }).join('')
            }
        `
    }

    drawConnections() {
        // For each node, draw a connection with each one of its children
        // We will need the nodes id which is build dinamically parsing the data.name to lowercase and replacing spaces with dashes
        // We have al the node data within the serviceTree state
        // We do it between layers
        const canvas = this.$('.node-connection-canvas')
        if (!canvas) return

        canvas.width = this.wrapper.clientWidth
        canvas.height = this.wrapper.clientHeight
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const serviceTree = this.serviceTree.getState()
        if (!serviceTree) return

        const drawConnectionsRecursive = (node) => {
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    const nodeAId = node.data.name.toLowerCase().replaceAll(/ /g, '-')
                    const nodeBId = child.data.name.toLowerCase().replaceAll(/ /g, '-')
    
                    const nodeA = this.$(`[id="${nodeAId}"]`)
                    const nodeB = this.$(`[id="${nodeBId}"]`)
    
                    if (nodeA && nodeB) {
                        this.drawNodeConnectionBetween(nodeA, nodeB, ctx)
                    }
    
                    drawConnectionsRecursive(child)
                })
            }
        }
    
        // Start drawing connections from the second layer
        if (serviceTree.children && serviceTree.children.length > 0) {
            serviceTree.children.forEach(child => {
                drawConnectionsRecursive(child)
            })
        }
    }

    drawNodeConnectionBetween(nodeA, nodeB, ctx) {
        const nodeARect = nodeA.getBoundingClientRect()
        const nodeBRect = nodeB.getBoundingClientRect()

        // Calculate the center points
        const borderOffset = 1
        const containerRect = this.wrapper.getBoundingClientRect()
        const nodeACenterX = (nodeARect.left + nodeARect.width - borderOffset) - containerRect.left
        const nodeACenterY = (nodeARect.top + nodeARect.height / 2) - containerRect.top
        const nodeBCenterX = (nodeBRect.left - borderOffset) - containerRect.left
        const nodeBCenterY = (nodeBRect.top + nodeBRect.height / 2) - containerRect.top

        // Control points for the bezier curve
        const cpOffset = 60
        const cpNodeACenterX = nodeACenterX + cpOffset
        const cpNodeACenterY = nodeACenterY
        const cpNodeBCenterX = nodeBCenterX - cpOffset
        const cpNodeBCenterY = nodeBCenterY

        // Draw the bezier curve
        ctx.beginPath()
        ctx.moveTo(nodeACenterX, nodeACenterY)
        ctx.bezierCurveTo(cpNodeACenterX, cpNodeACenterY, cpNodeBCenterX, cpNodeBCenterY, nodeBCenterX, nodeBCenterY)
        //ctx.lineTo(nodeBCenterX, nodeBCenterY)
        ctx.strokeStyle = 'grey'
        ctx.lineWidth = 3
        ctx.stroke()
    }

    reset() {
        clearTimeout(this.greetingTimeout)
        this.greetingTimeout = null
        this.isGreeting.setState(false, false)
        this.isGreeted.setState(false, true)
    }
}

export default window.customElements.define("agora-landing", Landing)