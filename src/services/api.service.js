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
        // const url = `${host}/ai_assistant_app/query`
        /* const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }) */

        const response = await fetch(`http://localhost:2000/fetch-elements-from-db`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "query": payload.query,
                "system": 'You are a helpful AI assistant.',
                "models": [
                    {
                        "name": "student.jp",
                        "description": "This is a database that contains information about the available joint programs of the universities in alliance."
                    },
                    {
                        "name": "student.mooc",
                        "description": "This is a database that contains information about the available MOOCs of the universities in alliance."
                    },
                    {
                        "name": "student.course",
                        "description": "This is a database that contains information about the available courses of the universities in alliance."
                    },
                    {
                        "name": "staff.course",
                        "description": "This is a database that contains information about the available courses for staff members of the universities in alliance."
                    },
                    {
                        "name": "resources.infrastructure",
                        "description": "This is a database that contains information about the available infrastructures of the universities in alliance."
                    }
                ],
                "message_history": payload.messages,
                "result_history": []
            })
        })

        if (response.body instanceof ReadableStream) {
            console.log("STREAMING RESPONSE", response)
            console.log("BOT RESPONSE IS STREAMING", response.body instanceof ReadableStream)
            return response
        }

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

export const sendMessageV2 = async (aiHost, provider, query, models, messageHistory, resultHistory) => {
        const payload = {
            "provider": provider,
            "query": query,
            "models": models,
            "message_history": messageHistory,
            "result_history": resultHistory
        }

        const response = await fetch(`${aiHost}/agora-assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error('Something went wrong while sending message')
        }

        return response
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