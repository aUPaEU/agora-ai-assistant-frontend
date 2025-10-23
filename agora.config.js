// This could be fetched automatically from the server depending on an environment variable,
// a cookie or the domain name.

const CURRENT_VERSION = "1.2.7"

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
        "host": "http://localhost:8010",
        "company_id": 1,
        "enabled_ai": true,
        "ai_host": "http://localhost:2020/api",
        "translation_host": "http://localhost:5000",
        "current_version": CURRENT_VERSION
    },

    ARQUS: {
        "name": "ARQUS",
        "host": "https://arqus.widening.eu/",
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": "Set the ai_host in the attribute of the html element <agora-app ai_host='https://yourdomain.com'>, usually should be deployed on http://localhost:2020",
        "translation_host": "Set the translation_host in the attribute of the html element <agora-app translation_host='https://yourdomain.com/translation'>",
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
    },

    PRODUCTION_DEFAULT: {
        "name": null,
        "host": null,
        "company_id": 1,
        "enabled_ai": false,
        "ai_host": null,
        "translation_host": null,
        "current_version": CURRENT_VERSION
    },

    LOCAL_DEFAULT: {
        "name": "Set the name in the attribute of the html element <agora-app name='Your company name'>",
        "host": "Set the host in the attribute of the html element <agora-app host='https://yourdomain.com'>",
        "company_id": 1,
        "enabled_ai": true,
        "ai_host": "Set the ai_host in the attribute of the html element <agora-app ai_host='https://yourdomain.com'>, usually should be deployed on http://localhost:2020",
        "translation_host": "Set the translation_host in the attribute of the html element <agora-app translation_host='https://yourdomain.com/translation'>",
        "current_version": CURRENT_VERSION
    },

    AUPAEU_PRODUCTION: {
        "name": "aUPaEU",
        "host": "https://aupaeu.widening.eu/",
        "enabled_ai": true,
        "company_id": 1,
        "ai_host": "https://aupaeu.widening.eu/aida-api",
        "current_version": CURRENT_VERSION
    }
}

export const CONFIG = ENV.PRODUCTION_DEFAULT