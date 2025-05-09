import { ACCELERATION_SERVICES, STRUCTURED_DATA } from "../data/mock.data"

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

export const fetchMetagoraServices = async (host) => {
    try {
        const url = `${host}/catalogue-api/v1/agoras`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Something went wrong while fetching Metagora services')
        }

        const data = await response.json()
        return data
    }

    catch (error) {
        throw error
    }
}

export const fetchAgoraServices = async (host, company_id) => {
    try {
        const url = `${host}/catalogue-api/v1/acceleration-services/${company_id}`
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

export const fetchElement = async (host, model, id, fields=null) => {
    const COMMON_FIELDS = [
        'id',
        'name',
        'description',
        'summary',
        'university_origin'
    ]

    const FIELDS = [...new Set(COMMON_FIELDS.concat(fields))]

    try {
        const url = `${host}/catalogue-api/v1/ai/${model}/${id}?fields=${FIELDS}`
        
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

export const sendMessage = async (host, provider, message, models, history) => {
    const payload = {
        "provider": provider,
        "query": message,
        "models": models,
        "messages": history
    }

    try {
        const url = `${host}/ai_assistant_app/query`
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

export const search = async (host, query, models = [], fieldRelevance = {}, filters = {}) => {
    if (!query || query.length === 0) throw new Error('No query provided')
    if (models.length === 0) throw new Error('No models provided for the search')

    const url = `${host}/elastic/search?query=${query}&models=${models.join()}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            if (response.status === 404) {
                const errorData = await response.json()
                throw new Error(JSON.stringify(errorData))
            }
        }

        const data = await response.json()
        return data
    }

    catch(error) {
        throw error
    }
}

export const ingest = async (host, model) => {
    const url = `${host}/elastic/ingest/${model}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message)
        }

        const data = await response.json()
        return data
    }

    catch (error) {
        throw error
    }
}