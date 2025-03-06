// This could be fetched automatically from the server depending on an environment variable,
// a cookie or the domain name.

const CURRENT_VERSION = "1.0.2-pre.3"

export const ENV = {
    LOCAL: {
        "name": "Unite!",
        "host": "http://localhost:8000",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": CURRENT_VERSION
    },

    UNITE: {
        "name": "Unite!",
        "host": "https://agora.unite-university.eu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": CURRENT_VERSION
    },

    UNITE_PRE: {
        "name": "Unite!",
        "host": "https://unite.pre.upc.edu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": CURRENT_VERSION
    },

    CIVIS_DEV: {
        "name": "CIVIS",
        "host": "https://aupaeu-dev.widening.eu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": CURRENT_VERSION
    }
}

export const CONFIG = ENV.UNITE