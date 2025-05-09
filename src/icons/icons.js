import { html } from "../utils/templateTags.util"

export const LEFT_ARROW = html`
    <svg width="24" height="24" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 34L2 18L18 2" stroke="#0080FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const RIGHT_ARROW = html`
    <svg width="24" height="24" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 34L18 18L2 2" stroke="#0080FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const DROPDOWN_ARROW = html`
    <svg width="24" height="24" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2L18 18L34 2" stroke="#0080FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const ADD = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20" stroke="currentColor" stroke-width="2"  stroke-linejoin="round"/>
    <path d="M4 12H20" stroke="currentColor" stroke-width="2"  stroke-linejoin="round"/>
    </svg>
`

export const SUBTRACT = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12H20" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
`

export const BOOST = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.9365 3.4896V1.6H16.7429V0H10.2921V1.6H11.0984V3.4928C8.66324 4.0648 6.46675 5.5048 5 7.5336L6.31032 8.4664C7.67698 6.58507 9.73496 5.31287 12.0394 4.9248C13.0182 4.75882 14.0183 4.75882 14.9971 4.9248C17.0667 5.26453 18.9468 6.32399 20.3009 7.91351C21.6549 9.50303 22.3946 11.5188 22.3873 13.6C22.3873 18.452 18.408 22.4 13.5175 22.4C12.1094 22.3985 10.7218 22.0653 9.46887 21.4279C8.21591 20.7905 7.13338 19.8671 6.31032 18.7336L5.00081 19.6664C5.97334 21.006 7.25252 22.0973 8.73313 22.8507C10.2137 23.6041 11.8535 23.998 13.5175 24C19.2974 24 24 19.3344 24 13.6C24 8.7288 20.6456 4.5856 15.9365 3.4896ZM12.7111 3.2344V1.6H14.3238V3.2344C13.7871 3.1929 13.2479 3.1929 12.7111 3.2344Z" fill="currentColor"/>
    <path d="M0 12.7169H7.32115V14.4779H0V12.7169ZM1.62692 9.19486H8.94807V10.9559H1.62692V9.19486ZM1.62692 16.239H8.94807V18H1.62692V16.239ZM17.8498 8L14.8741 11.2209C14.5485 11.0487 14.1912 10.9581 13.8288 10.9559C12.4834 10.9559 11.3884 12.1411 11.3884 13.5974C11.3884 15.0538 12.4834 16.239 13.8288 16.239C15.1743 16.239 16.2692 15.0538 16.2692 13.5974C16.2692 13.1906 16.1773 12.8102 16.0252 12.466L19 9.24505L17.8498 8ZM13.8288 14.4779C13.3806 14.4779 13.0154 14.0826 13.0154 13.5974C13.0154 13.1123 13.3806 12.7169 13.8288 12.7169C14.277 12.7169 14.6423 13.1123 14.6423 13.5974C14.6423 14.0826 14.277 14.4779 13.8288 14.4779Z" fill="currentColor"/>
    </svg>
`

export const CATALOGUE = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="4" width="4" height="4" fill="currentColor"/>
    <rect x="16" y="4" width="4" height="4" fill="currentColor"/>
    <rect x="4" y="10" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="10" width="4" height="4" fill="currentColor"/>
    <rect x="16" y="10" width="4" height="4" fill="currentColor"/>
    <rect x="4" y="16" width="4" height="4" fill="currentColor"/>
    <rect x="10" y="16" width="4" height="4" fill="currentColor"/>
    <rect x="16" y="16" width="4" height="4" fill="currentColor"/>
    </svg>
`

export const EYE = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const WEBSITE = html`
<svg 
    xmlns="http://www.w3.org/2000/svg" 
    height="24px" 
    viewBox="0 -960 960 960" 
    width="24px" 
    fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q146 0 255.5 91.5T872-559h-82q-19-73-68.5-130.5T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h80v120h-40L168-552q-3 18-5.5 36t-2.5 36q0 131 92 225t228 95v80Zm364-20L716-228q-21 12-45 20t-51 8q-75 0-127.5-52.5T440-380q0-75 52.5-127.5T620-560q75 0 127.5 52.5T800-380q0 27-8 51t-20 45l128 128-56 56ZM620-280q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z"/></svg>
`

export const SEND_MESSAGE = html`
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.0152381 30.6667L32 16.6667L0.0152381 2.66669L0 13.5556L22.8571 16.6667L0 19.7778L0.0152381 30.6667Z" fill="currentColor"/>
    </svg>
`

export const CLEAR_CHAT = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 7L7 19C7 19.5304 7.21071 20.0391 7.58579 20.4142C7.96086 20.7893 8.46957 21 9 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19L18 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const PIN = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 19 16 19 9.5C19 5.35786 15.866 2 12 2C8.13401 2 5 5.35786 5 9.5C5 16 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const BOOKMARK = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3H8C7.44772 3 7 3.44772 7 4V21L12 18L17 21V4C17 3.44772 16.5523 3 16 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const AUPAEU_LOGO = html`
    <svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 658.08 657.97">
        <defs>
            <style>
                .cls-1 {
                fill: #3a85fe;
                }

                .cls-2 {
                fill: #febd0b;
                }

                .cls-3 {
                fill: #fe006e;
                }

                .cls-4 {
                fill: #8238eb;
                }

                .cls-5 {
                fill: #fa5607;
                }
            </style>
        </defs>
        <g id="Capa_1-2" data-name="Capa 1">
        <path class="cls-2" d="M318.49,229.28c89.04-7.92,144.11,93.15,88.17,163.02-44.78,55.93-135.14,46.33-167.52-17.41-31.65-62.3,9.58-139.4,79.34-145.61Z"/>
        <path class="cls-5" d="M330.39,459.87l2.84.83c17.63,19.48,39.12,36.96,56.48,56.48,52.92,59.49,11,147.48-68.51,140.38-39.16-3.5-70.49-38.81-72.56-77.37-2.95-55.05,49.76-83.94,81.74-120.32Z"/>
        <path class="cls-5" d="M316.49.48c76-7.75,121.11,79.38,71.23,137.11-17.65,20.43-40.91,38.6-58.98,58.96l-2.55,1.49-2.55-1.49c-37.16-42.18-95.3-71.92-76.22-138.18C256.21,27.88,284.72,3.72,316.49.48Z"/>
        <path class="cls-3" d="M234.69,238.97c-27.69-1.31-56.98,1.76-84.49,0-113.78-7.32-100.41-171.77,8.03-164.88,35.63,2.26,76.46,36.06,76.46,73.47v91.42Z"/>
        <path class="cls-1" d="M71.49,247.26c23.94-2.44,46.51,4.05,64.73,19.66l61.4,61.61-1.39,2.39c-42.26,36.94-72.35,96.51-138.97,76.84-83.95-24.78-72.52-151.67,14.23-160.5Z"/>
        <path class="cls-1" d="M565.49,247.26c59.39-6.04,105.16,46.45,89.49,104.39-15.5,57.32-87.79,78.51-132.81,40.21l-62.4-62.61,1.39-2.39c32.04-26.68,59.42-75.04,104.33-79.6Z"/>
        <path class="cls-4" d="M237.69,422.8v95.41c0,14.05-16.07,39.15-26.53,48.43-61.42,54.54-155.86-3.87-134.76-83.68,7.76-29.36,40.22-60.16,71.78-60.16h89.5Z"/>
        <path class="cls-3" d="M422.69,419.8h93.5c25.66,0,55.74,27.24,64.98,49.97,31.93,78.52-59.75,148.36-126.94,96.85-14.97-11.48-31.54-37.09-31.54-56.41v-90.42Z"/>
        <path class="cls-4" d="M419.69,234.97v-94.41c0-21.13,22.97-49.27,40.69-59.25,66.87-37.68,143.92,26.9,118.76,99.67-8.8,25.46-39.99,53.99-67.96,53.99h-91.5Z"/>
        </g>
        </svg>
`

export const DELETE = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const INFO = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 16V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
`

export const SIMPLE_INFO = html`
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    >
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
    <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
`

export const ARROW_LEFT = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const ARROW_RIGHT = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const FOLD = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const UNFOLD = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const SEARCH = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 16L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const CLOSE = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const WEBSITE_LINK = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M3 8H21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M7 6H7.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M11 6H11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
`

export const NAGIVATE_TO_WEBSITE = html`
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier"> 
        <path d="M18 20.75H6C5.27065 20.75 4.57118 20.4603 4.05546 19.9445C3.53973 19.4288 3.25 18.7293 3.25 18V6C3.25 5.27065 3.53973 4.57118 4.05546 4.05546C4.57118 3.53973 5.27065 3.25 6 3.25H12C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4C12.75 4.19891 12.671 4.38968 12.5303 4.53033C12.3897 4.67098 12.1989 4.75 12 4.75H6C5.66848 4.75 5.35054 4.8817 5.11612 5.11612C4.8817 5.35054 4.75 5.66848 4.75 6V18C4.75 18.3315 4.8817 18.6495 5.11612 18.8839C5.35054 19.1183 5.66848 19.25 6 19.25H18C18.3315 19.25 18.6495 19.1183 18.8839 18.8839C19.1183 18.6495 19.25 18.3315 19.25 18V12C19.25 11.8011 19.329 11.6103 19.4697 11.4697C19.6103 11.329 19.8011 11.25 20 11.25C20.1989 11.25 20.3897 11.329 20.5303 11.4697C20.671 11.6103 20.75 11.8011 20.75 12V18C20.75 18.7293 20.4603 19.4288 19.9445 19.9445C19.4288 20.4603 18.7293 20.75 18 20.75Z" fill="currentColor"></path>
        <path d="M20 8.75C19.8019 8.74741 19.6126 8.66756 19.4725 8.52747C19.3324 8.38737 19.2526 8.19811 19.25 8V4.75H16C15.8011 4.75 15.6103 4.67098 15.4697 4.53033C15.329 4.38968 15.25 4.19891 15.25 4C15.25 3.80109 15.329 3.61032 15.4697 3.46967C15.6103 3.32902 15.8011 3.25 16 3.25H20C20.1981 3.25259 20.3874 3.33244 20.5275 3.47253C20.6676 3.61263 20.7474 3.80189 20.75 4V8C20.7474 8.19811 20.6676 8.38737 20.5275 8.52747C20.3874 8.66756 20.1981 8.74741 20 8.75Z" fill="currentColor"></path>
        <path d="M13.5 11.25C13.3071 11.2352 13.1276 11.1455 13 11C12.877 10.8625 12.809 10.6845 12.809 10.5C12.809 10.3155 12.877 10.1375 13 10L19.5 3.5C19.5687 3.42631 19.6515 3.36721 19.7435 3.32622C19.8355 3.28523 19.9348 3.26319 20.0355 3.26141C20.1362 3.25963 20.2362 3.27816 20.3296 3.31588C20.423 3.3536 20.5078 3.40974 20.579 3.48096C20.6503 3.55218 20.7064 3.63701 20.7441 3.7304C20.7818 3.82379 20.8004 3.92382 20.7986 4.02452C20.7968 4.12523 20.7748 4.22454 20.7338 4.31654C20.6928 4.40854 20.6337 4.49134 20.56 4.56L14 11C13.8724 11.1455 13.6929 11.2352 13.5 11.25Z" fill="currentColor"></path>
    </g>
    </svg>
`

export const METAGORA_LOGO = html`
    <svg 
        fill="currentColor" 
        width="800px" 
        height="800px" 
        viewBox="0 0 32 32" 
        id="Camada_1" 
        version="1.1" 
        xml:space="preserve" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink"
    >
        <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11"/>
    </svg>
`

export const BOOK_PILE = html`
<svg 
    xmlns="http://www.w3.org/2000/svg" 
    height="24px" 
    viewBox="0 -960 960 960" 
    width="24px" 
    fill="currentColor">
        <path d="M200-313q10-3 19.5-5t20.5-2h40v-480h-40q-17 0-28.5 11.5T200-760v447Zm40 233q-50 0-85-35t-35-85v-560q0-50 35-85t85-35h280v80H360v480h240v-120h80v200H240q-17 0-28.5 11.5T200-200q0 17 11.5 28.5T240-160h520v-320h80v400H240Zm-40-233v-487 487Zm500-167q0-92 64-156t156-64q-92 0-156-64t-64-156q0 92-64 156t-156 64q92 0 156 64t64 156Z"/></svg>
`

export const CALENDAR = html`
<svg 
    xmlns="http://www.w3.org/2000/svg" 
    height="24px" 
    viewBox="0 -960 960 960" 
    width="24px" 
    fill="currentColor"
    ><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
`

export const FILLED_SELECTION_SQUARE = html`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"/>
    <rect x="5" y="5" width="14" height="14" fill="currentColor" opacity="0.65" />
    </svg>
`

export const EMPTY_SELECTION_SQUARE = html`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>
`

export const MAP = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 18L1 22V6L8 2M8 18L16 22M8 18V2M16 22L23 18V2L16 6M16 22V6M16 6L8 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const REFRESH = html`
    <svg width="24" height="24" viewBox="0 0 489.698 489.698" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
        <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1 c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8 c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3 c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z" fill="currentColor"/>
        <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1 c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8 c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2 c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z" fill="currentColor"/>
    </g>
    </svg>
`

export const AI_CHAT = html`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g transform="scale(0.1875)">
            <!-- Parte superior y derecha del borde -->
            <path d="M38 20h52c9.941 0 18 8.059 18 18v20" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="8"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
            
            <!-- Parte izquierda e inferior del borde -->
            <path d="M20 38v52c0 9.941 8.059 18 18 18h35" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="8"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
            
            <!-- Letra A -->
            <path d="m49.7 43.72-12 37.44A1.39 1.39 0 0 0 39 83h3.36a1.39 1.39 0 0 0 1.33-1l1.88-6H62l-.23-.37L63.83 82a1.39 1.39 0 0 0 1.33 1h3.36a1.39 1.39 0 0 0 1.33-1.82l-12-37.44a1.4 1.4 0 0 0-1.33-1H51a1.39 1.39 0 0 0-1.3.98ZM47.57 70l6.19-19.27L60 70Z" fill="currentColor"/>
            
            <!-- Letra I -->
            <rect width="6" height="40.24" x="79" y="42.75" rx="1.4" fill="currentColor"/>
            
            <!-- Estrella -->
            <path d="m111.73 101.8 9.06-3.57a1 1 0 0 0 0-1.86l-9.06-3.57a12.61 12.61 0 0 1-7.09-7.09l-3.57-9a1 1 0 0 0-.93-.63 1 1 0 0 0-.93.63l-3.57 9a12.58 12.58 0 0 1-7.09 7.09l-9 3.57a1 1 0 0 0 0 1.86l9 3.57a12.58 12.58 0 0 1 7.09 7.09l3.57 9a1 1 0 0 0 .93.64 1 1 0 0 0 .93-.64l3.57-9a12.61 12.61 0 0 1 7.09-7.09Z" fill="currentColor"/>
        </g>
    </svg>
`

export const WARNING = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L2 21H22L12 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const ERROR = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

export const SUCCESS = html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`

