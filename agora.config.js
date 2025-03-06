// This could be fetched automatically from the server depending on an environment variable,
// a cookie or the domain name.

export const ENV = {
    LOCAL: {
        "name": "Unite!",
        "host": "http://localhost:8000",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": "1.0.0"
    },

    UNITE: {
        "name": "Unite!",
        "host": "https://agora.unite-university.eu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": "1.0.0"
    },

    UNITE_PRE: {
        "name": "Unite!",
        "host": "https://unite.pre.upc.edu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": "1.0.0"
    },

    CIVIS_DEV: {
        "name": "CIVIS",
        "host": "https://aupaeu-dev.widening.eu",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "http://localhost:2000",
        "current_version": "1.0.0"
    }
}

export const CONFIG = ENV.UNITE