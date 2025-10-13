import { CONFIG } from "../../agora.config"

const LOCAL_PATHS = {
    SRC : 'src',
    DIST: 'dist',
    PUBLIC: 'public',
    BASE_COMPONENTS: 'src/components/base',
    MID_COMPONENTS: 'src/components/mid',
    COMPLEX_COMPONENTS: 'src/components/complex',
    LAYOUT_COMPONENTS: 'src/components/layout',
    PAGE_COMPONENTS: 'src/components/page',
}

const CDN_URL = `https://cdn.jsdelivr.net/gh/aUPaEU/agora-ai-assistant-frontend@${CONFIG.current_version}`

const CDN_PATHS = {
    SRC : `${CDN_URL}/src`,
    DIST: `${CDN_URL}/dist`,
    PUBLIC: `${CDN_URL}/public`,
    BASE_COMPONENTS: `${CDN_URL}/src/components/base`,
    MID_COMPONENTS: `${CDN_URL}/src/components/mid`,
    COMPLEX_COMPONENTS: `${CDN_URL}/src/components/complex`,
    LAYOUT_COMPONENTS: `${CDN_URL}/src/components/layout`,
    PAGE_COMPONENTS: `${CDN_URL}/src/components/page`,
}

export const PATHS = LOCAL_PATHS