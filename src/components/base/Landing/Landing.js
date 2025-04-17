import { PlainComponent, PlainState, PlainContext, PlainSignal } from "plain-reactive"
/* Constants */
import { PATHS } from "../../../constants/paths.const"

/* Utils */
import { gsap } from "gsap"
import { CSSPlugin } from "gsap/CSSPlugin"
gsap.registerPlugin(CSSPlugin)

import { html } from "../../../utils/templateTags.util"

/* Icons */
import { BOOST, WEBSITE_LINK, METAGORA_LOGO, CALENDAR, BOOK_PILE, WEBSITE } from "../../../icons/icons"

class Landing extends PlainComponent {
    constructor() {
        super('agora-landing', `${PATHS.BASE_COMPONENTS}/Landing/Landing.css`)

        this.signals = new PlainSignal(this)

        this.configContext = new PlainContext('config', this, true)
        this.servicesContext = new PlainContext('service', this, true)
        this.resultContext = new PlainContext('result', this, true)
        this.companyContext = new PlainContext('company', this, true)
        this.metagoraContext = new PlainContext('metagora', this, false)

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
        if (!this.isGreeted.getState() && !this.isGreeting.getState()) {
            this.isGreeting.setState(true, false)

            this.greetingTimeout = setTimeout(() => {
                const greetings = this.$('agora-greetings')
                gsap.to(greetings, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        this.isGreeting.setState(false, false)
                        this.isGreeted.setState(true, true)
                    }
                })
            }, this.greetingsDuration.getState())
        }

        if (
            this.isGreeting.getState() && !this.isGreeted.getState() ||
            this.servicesContext.getData('services').length === 0 // TODO: Check if this works properly
        ) return html`
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

        const isMetagora = this.companyContext.getData('info') && this.companyContext.getData('info').name === 'Metagora'

        const displayedService = this.displayOrderedService(services)
        const currentAgora = this.getServiceParentAgora(displayedService)
        if (!displayedService) return ''

        const suggestedSearchTerms = Array.from(new Set(displayedService.fields.suggested_search_terms.split(','))).map(term => term.trim())

        const learnMoreButton = displayedService.fields.website && !(displayedService.fields.website instanceof Array) && displayedService.fields.website.fields.domain
            ? html`<agora-text-button 
                    class="learn-more-button" 
                    href="${displayedService.fields.website.fields.domain}"
                >Learn more</agora-text-button>`
            : html``

        const serviceIcon = (() => {
            switch (displayedService.fields.components?.fields?.name) {
                case 'Showcase':
                    return WEBSITE
                case 'Catalogues':
                    return BOOK_PILE
                case 'Events':
                    return CALENDAR
                default:
                    return BOOST
            }
        })()

        const card = html`
            <div class="showcase-card-wrapper first-fade-in ${isMetagora ? 'showcase-metagora-display' : ''}">
                <!-- Node Connection Rendering Canvas -->
                <canvas class="node-connection-canvas"></canvas>

                <!-- Banner Image -->
                <div class="banner-image default-image">
                    <h1>${displayedService.fields.name}</h1>
                    <span class="icon">
                        ${
                            isMetagora 
                                ? html`<img src="${this.configContext.getData('host')}${currentAgora.agora.fields.image}" alt="${currentAgora.agora.fields.name}" />`
                                : serviceIcon
                        }
                    </span>
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

        return card
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

    getServiceParentAgora(displayedService) {
        const metagora = this.metagoraContext.getData('data') ?? {agoras: []}
        const mappedServices = metagora.agoras.map(agora => {
            return {
                agora: agora,
                services: agora.fields.sub_acceleration_services instanceof Array
                    ? Array.from(agora.fields.sub_acceleration_services).map(service => {
                        return {
                            id: service.id,
                            name: service.fields.name
                        }
                    })
                    : [{
                        id: agora.fields.sub_acceleration_services.id,
                        name: agora.fields.sub_acceleration_services.fields.name
                    }]
            }
        })

        return mappedServices.find(agora => {
            return agora.services.find(service => {
                return service.id === displayedService.id && service.name === displayedService.fields.name
            })
        })
    }

    displayOrderedService(data) { 
        let nextIndex = this.lastShown.getState() + 1

        if (nextIndex === data.length) nextIndex = 0

        // Don't proceed if we're already showing a service
        if (this.isAnimating.getState()) return data[this.lastShown.getState()]

        this.animateShowcaseCard()

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

    hide() {
        this.style.display = 'none'
    }

    show() {
        this.style.display = 'block'
    }
}

export default window.customElements.define("agora-landing", Landing)