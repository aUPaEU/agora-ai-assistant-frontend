import { ACCELERATION_SERVICES, STRUCTURED_DATA } from "../data/mock.data"
import { CONFIG, CURRENT_CONFIG } from "../../agora.config"

export const fetchAccelerationServices = async () => {
    try {
        //const response = ACCELERATION_SERVICES
        const response = STRUCTURED_DATA
        /* const data = await response.json()
        return data */
        return response
    }

    catch (error) {
        throw error
    }
}

export const fetchAccelerationServicesV1 = async () => {
    try {
        const response = ACCELERATION_SERVICES
        /* const data = await response.json()
        return data */
        return response
    }

    catch (error) {
        throw error
    }
}

export const fetchAgoraServices = async () => {
    try {
        const url = `${CONFIG.host}/catalogue-api/v1/acceleration-services/${CONFIG.company_id}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Something went wrong while fetching Agora services')
        }

        const data = await response.json()
        return data
    }

    catch (error) {
        throw error
    }
}

export const fetchElement = async (model, id, fields=null) => {
    const COMMON_FIELDS = [
        'id',
        'name',
        'description',
        'summary',
        'university_origin'
    ]

    const FIELDS = [...new Set(COMMON_FIELDS.concat(fields))]

    try {
        const url = `${CONFIG.host}/catalogue-api/v1/ai/${model}/${id}?fields=${FIELDS}`
        
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Something went wrong while fetching element')
        }

        const data = await response.json()
        return data
    }

    catch (error) {
        throw error
    }
}

export const sendMessage = async (message, models, history) => {
    const payload = {
        "user_input": message,
        "models": models,
        "history_messages": history
    }

    try {
        const url = `${CONFIG.host}/ai_assistant_app/send_message/openai`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error('Something went wrong while sending message')
        }

        const data = await response.json()
        return data
    }

    catch (error) {
        throw error
    }
}

export const search = async (query, models = [], fieldRelevance = {}, filters = {}) => {
    if (!query || query.length === 0) throw new Error('No query provided')
    if (models.length === 0) throw new Error('No models provided for the search')

    const url = `${CONFIG.host}/elastic/search?query=${query}&models=${models.join()}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Something went wrong while making the search')
        }

        const data = await response.json()
        return data
    }

    catch(error) {
        throw error
    }
}