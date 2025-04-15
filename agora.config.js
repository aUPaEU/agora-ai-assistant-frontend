// This could be fetched automatically from the server depending on an environment variable,
// a cookie or the domain name.

const CURRENT_VERSION = "1.1.9"

export const ENV = {
    LOCAL: {
        "name": "Unite!",
        "host": "http://localhost:8000",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "translation_host": "http://localhost:5000",
        "current_version": CURRENT_VERSION
    },

    LOCAL_AI: {
        "name": "Unite!",
        "host": "http://localhost:8000",
        "company_id": 1,
        "enabled_ai": true,
        "ai_host": "http://localhost:2000",
        "translation_host": "http://localhost:5000",
        "current_version": CURRENT_VERSION
    },

    UNITE: {
        "name": "Unite!",
        "host": "https://agora.unite-university.eu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "translation_host": "https://agora.unite-university.eu/translation",
        "current_version": CURRENT_VERSION
    },

    UNITE_PRE: {
        "name": "Unite!",
        "host": "https://unite.pre.upc.edu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "translation_host": "https://aupaeu-pre.widening.eu/translation",
        "current_version": CURRENT_VERSION
    },

    CIVIS_DEV: {
        "name": "CIVIS",
        "host": "https://aupaeu-dev.widening.eu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "translation_host": "https://aupaeu-dev.widening.eu/translation",
        "current_version": CURRENT_VERSION
    },

    METAGORA: {
        "name": "Metagora",
        "host": "http://localhost:8000",
        "company_id": null,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "translation_host": "http://localhost:5000",
        "current_version": CURRENT_VERSION
    }
}

export const CONFIG = ENV.LOCAL