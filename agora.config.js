// This could be fetched automatically from the server depending on an environment variable,
// a cookie or the domain name.

export const ENV = {
    LOCAL: {
        "name": "Unite!",
        "host": "http://localhost:8000",
        "company_id": 1,
    },

    UNITE: {
        "name": "Unite!",
        "host": "https://agora.unite-university.eu",
        "company_id": 1,
    },

    CIVIS_DEV: {
        "name": "CIVIS",
        "host": "https://aupaeu-dev.widening.eu",
        "company_id": 1,
    }
}

export const CONFIG = ENV.CIVIS_DEV