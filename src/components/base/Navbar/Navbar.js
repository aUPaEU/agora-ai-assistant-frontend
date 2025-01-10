import { PlainComponent, PlainState } from "plain-reactive"
import { PATHS } from "../../../constants/paths.const"
import { gsap } from "gsap"
import { html } from "../../../utils/templateTags.util"
import * as api from "../../../services/api.service"

/* ICONS */
import { LEFT_ARROW, RIGHT_ARROW, ADD } from "../../../icons/icons"

class Navbar extends PlainComponent {
    constructor() {
        super('agora-navbar', `${PATHS.BASE_COMPONENTS}/Navbar/Navbar.css`)

        this.menuItems = new PlainState(null, this)

        this.fetchMenuItems()
    }

    template() {
        if (!this.menuItems.getState()) return ``
        return html`
            <div class="main-wrapper">
                <div class="left-fade">
                    <div class="left-arrow-icon">${LEFT_ARROW}</div>
                </div>

                <ul class="menu">
                    <li class="separator"></li>
                    ${Object.entries(this.menuItems.getState()).map(
                        ([item, info]) => html`
                            <li class="item" data-info='${JSON.stringify(info)}'>
                                <a href="${info.link}">${item}</a>
                                ${
                                    Object.entries(info.subServices).length > 0 
                                        ? html`<div class="unfold-icon">${ADD}</div>`
                                        : ``
                                }
                            </li>
                        `
                    ).join('')}
                    <li class="separator"></li>
                </ul>
                
                <div class="right-fade">
                    <div class="right-arrow-icon">${RIGHT_ARROW}</div>
                </div>
            </div>
            
            <div class="secondary-wrapper"></div>
        `
    }

    listeners() {
        document.addEventListener('wheel', (e) => this.handleScroll(e))
        this.$('.left-arrow-icon') ? this.$('.left-arrow-icon').onclick = () => this.scrollLeft() : null
        this.$('.right-arrow-icon') ? this.$('.right-arrow-icon').onclick = () => this.scrollRight() : null

        const menuItems = this.$$('.menu .item:has(> .unfold-icon)')
        menuItems.forEach((item) => {
            const unfoldButton = item.querySelector('.unfold-icon')
            unfoldButton.onclick = () => this.updateSubmenu(item)
        })
    }

    /* UPDATE SUBMENUS */
    updateSubmenu(parent) {
        this.setUnfoldedItem(parent)

        const secondaryWrapper = this.$('.secondary-wrapper')
        secondaryWrapper.innerHTML = html`
            <div class="submenu"></div>
        `

        const submenu = this.$('.secondary-wrapper .submenu')

        Object.entries(JSON.parse(parent.dataset.info).subServices).forEach(([item, info]) => {
            submenu.innerHTML += html`
                <li class="item" data-info='${JSON.stringify(info)}'>
                    <a href="${info.link}">${item}</a>
                    ${
                        Object.entries(info.subServices).length > 0 
                            ? html`<div class="unfold-icon">${ADD}</div>`
                            : ``
                    }
                </li>
            `
        })

        this.animateSubmenu(secondaryWrapper)
        this.addSubmenuItemListener()
    }

    addSubmenu(parent) {
        this.setUnfoldedItem(parent)

        const items = JSON.parse(parent.dataset.info).subServices

        // We check if there's already a next submenu and remove all of them
        let nextSibling = parent.parentElement.nextElementSibling
        while (nextSibling) {
            nextSibling.remove()
            nextSibling = parent.parentElement.nextElementSibling
        }

        const submenu = html`
            <ul class="submenu">
                ${Object.entries(items).map(
                    ([item, info]) => html`
                        <li class="item" data-info='${JSON.stringify(info)}'>
                            <a href="${info.link}">${item}</a>
                            ${
                                Object.entries(info.subServices).length > 0 
                                    ? html`<div class="unfold-icon">${ADD}</div>`
                                    : ``
                            }
                        </li>
                    `
                ).join('')}
            </ul>
        `
        const secondaryWrapper = this.$('.secondary-wrapper')
        secondaryWrapper.innerHTML += submenu
      
        this.animateSubmenu(secondaryWrapper)
        this.addSubmenuItemListener()
    }

    addSubmenuItemListener() {
        const submenuItems = this.$$('.submenu .item:has(> .unfold-icon)')
        submenuItems.forEach((item) => {
            const unfoldButton = item.querySelector('.unfold-icon')
            unfoldButton.onclick = () => this.addSubmenu(item)
        })
    }

    animateSubmenu(wrapper) {
        wrapper.querySelector('.submenu:last-child').classList.add('fade-in')
        wrapper.querySelector('.submenu:last-child').onanimationend = () => wrapper.querySelector('.submenu:last-child').classList.remove('fade-in')
    }

    setUnfoldedItem(item) {
        const submenu = item.parentElement
        const submenuItems = submenu.querySelectorAll('.item')
        submenuItems.forEach((item) => {
            if (!item.querySelector('.unfold-icon')) return
            item.querySelector('.unfold-icon').classList.remove('unfolded')
        })

        item.querySelector('.unfold-icon').classList.add('unfolded')
    }

    foldAllSubmenus() {
        const menu = this.$('.menu')
        const menuItems = menu.querySelectorAll('.item')
        menuItems.forEach((item) => {
            if (!item.querySelector('.unfold-icon')) return
            item.querySelector('.unfold-icon').classList.remove('unfolded')
        })

        const secondaryWrapper = this.$('.secondary-wrapper')
        secondaryWrapper.innerHTML = ``
    }

    /* SCROLLING */
    scrollRight() {
        if (this.scrollIsAtEnd()) {
            this.$('.main-wrapper').scrollTo({
                left: this.$('.main-wrapper').scrollLeft + 200,  
                behavior: 'smooth'
            });
        }
    }

    mouseScrollRight() {
        if (this.scrollIsAtEnd()) {
            this.$('.main-wrapper').scrollTo({
                left: this.$('.main-wrapper').scrollLeft + 10,  
            });
        }
    }

    scrollLeft() {
        if (this.scrollIsAtStart()) {
            this.$('.main-wrapper').scrollTo({
                left: this.$('.main-wrapper').scrollLeft - 200,  
                behavior: 'smooth'
            });
        }
    }

    mouseScrollLeft() {
        if (this.scrollIsAtStart()) {
            // Check the cursor is over the main wrapper

            this.$('.main-wrapper').scrollTo({
                left: this.$('.main-wrapper').scrollLeft - 10,  
            });
        }
    }

    scrollIsAtEnd() {
        // TODO: Apply styles when scroll is at the end
        return this.$('.main-wrapper').scrollLeft < this.$('.main-wrapper').scrollWidth - this.$('.main-wrapper').clientWidth
    }

    scrollIsAtStart() {
        // TODO: Apply styles when scroll is at the end
        return this.$('.main-wrapper').scrollLeft > 0
    }

    handleScroll(event) {
        if (event.deltaY > 0) {
            this.mouseScrollRight()
        } else if (event.deltaY < 0) {
            this.mouseScrollLeft()
        }
    }

    /* DATA FETCHING */
    async fetchMenuItems() {
        const items = await api.fetchAccelerationServices()
        console.log(items)
        this.menuItems.setState(items)
    }
}

export default window.customElements.define('agora-navbar', Navbar)