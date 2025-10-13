import { ACCELERATION_SERVICES, STRUCTURED_DATA } from "../data/mock.data"
import {AI_PROVIDER, AI_MODEL} from "../constants/ai.const.js"

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

export const fetchElementV2 = async (host, model, id, fields=null) => {
    const url = `${host}/catalogue-api/v2/${model}/${id}`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl9pZCI6MSwidG9rZW5fbmFtZSI6IkFzc2lzdGFudCBBUEkgS0VZIiwiY3JlYXRvcl9pZCI6NTc1MywiY3JlYXRvcl9uYW1lIjoiSm9zZSBNYXJ0aW4gQm9sZXQiLCJjcmVhdGVkX2F0IjoiMjAyNS0xMC0wOVQxNDozMzoyMy43NTk3MjQiLCJleHBpcmVzX2F0IjoiMjAyNS0xMS0wN1QxMTo0MToxOC4xNDU0MjgiLCJpc19hY3RpdmUiOnRydWUsImlzX2V4cGlyZWQiOmZhbHNlLCJtb2RlbHMiOlt7Im1vZGVsX2lkIjo3OTgsIm1vZGVsX25hbWUiOiJhbGxpYW5jZV9jYXRhbG9ndWVfYXBwLnJlc2VhcmNoaW5mcmFzdHJ1Y3R1cmVzIiwibW9kZWxfZGlzcGxheV9uYW1lIjoiUmVzZWFyY2ggSW5mcmFzdHJ1Y3R1cmVzIiwiY2F0YWxvZ3VlX2lkIjoxLCJjYXRhbG9ndWVfbmFtZSI6IlJlc2VhcmNoIEluZnJhc3RydWN0dXJlcyIsIndlYnNpdGVfaWQiOjIsIndlYnNpdGVfbmFtZSI6IlVuaXRlIEFnb3JhIiwid2Vic2l0ZV91cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwMTAiLCJwYWdlX2lkIjo3NCwicGFnZV9uYW1lIjoiSW5mcmFzdHJ1Y3R1cmVzIiwicGFnZV91cmwiOiIvcmVzb3VyY2VzL2luZnJhc3RydWN0dXJlIiwiY2FuX3JlYWQiOnRydWUsImNhbl93cml0ZSI6ZmFsc2UsImNhbl9jcmVhdGUiOmZhbHNlLCJjYW5fZGVsZXRlIjpmYWxzZX0seyJtb2RlbF9pZCI6ODMzLCJtb2RlbF9uYW1lIjoiYWxsaWFuY2VfY2F0YWxvZ3VlX2FwcC5tb29jIiwibW9kZWxfZGlzcGxheV9uYW1lIjoiTU9PQ3MiLCJjYXRhbG9ndWVfaWQiOjUsImNhdGFsb2d1ZV9uYW1lIjoiQ2F0YWxvZ3VlIGZvciBTdHVkZW50cyIsIndlYnNpdGVfaWQiOjIsIndlYnNpdGVfbmFtZSI6IlVuaXRlIEFnb3JhIiwid2Vic2l0ZV91cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwMTAiLCJwYWdlX2lkIjozOCwicGFnZV9uYW1lIjoiTU9PQydzIiwicGFnZV91cmwiOiIvc3R1ZGVudC1jYXRhbG9ndWUvbW9vYyIsImNhbl9yZWFkIjp0cnVlLCJjYW5fd3JpdGUiOmZhbHNlLCJjYW5fY3JlYXRlIjpmYWxzZSwiY2FuX2RlbGV0ZSI6ZmFsc2V9LHsibW9kZWxfaWQiOjgzMCwibW9kZWxfbmFtZSI6ImFsbGlhbmNlX2NhdGFsb2d1ZV9hcHAuY291cnNlIiwibW9kZWxfZGlzcGxheV9uYW1lIjoiQ291cnNlcyIsImNhdGFsb2d1ZV9pZCI6NSwiY2F0YWxvZ3VlX25hbWUiOiJDYXRhbG9ndWUgZm9yIFN0dWRlbnRzIiwid2Vic2l0ZV9pZCI6Miwid2Vic2l0ZV9uYW1lIjoiVW5pdGUgQWdvcmEiLCJ3ZWJzaXRlX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAxMCIsInBhZ2VfaWQiOjU0LCJwYWdlX25hbWUiOiJDb3Vyc2VzIiwicGFnZV91cmwiOiIvc3R1ZGVudC1jYXRhbG9ndWUvY291cnNlIiwiY2FuX3JlYWQiOnRydWUsImNhbl93cml0ZSI6ZmFsc2UsImNhbl9jcmVhdGUiOmZhbHNlLCJjYW5fZGVsZXRlIjpmYWxzZX0seyJtb2RlbF9pZCI6ODM0LCJtb2RlbF9uYW1lIjoiYWxsaWFuY2VfY2F0YWxvZ3VlX2FwcC5kb2N0b3JhbGNvdXJzZSIsIm1vZGVsX2Rpc3BsYXlfbmFtZSI6IkRvY3RvcmFsIENvdXJzZXMiLCJjYXRhbG9ndWVfaWQiOjUsImNhdGFsb2d1ZV9uYW1lIjoiQ2F0YWxvZ3VlIGZvciBTdHVkZW50cyIsIndlYnNpdGVfaWQiOjIsIndlYnNpdGVfbmFtZSI6IlVuaXRlIEFnb3JhIiwid2Vic2l0ZV91cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwMTAiLCJwYWdlX2lkIjo1MCwicGFnZV9uYW1lIjoiRG9jdG9yYWwgQ291cnNlcyIsInBhZ2VfdXJsIjoiL3N0dWRlbnQtY2F0YWxvZ3VlL3VkcyIsImNhbl9yZWFkIjp0cnVlLCJjYW5fd3JpdGUiOmZhbHNlLCJjYW5fY3JlYXRlIjpmYWxzZSwiY2FuX2RlbGV0ZSI6ZmFsc2V9LHsibW9kZWxfaWQiOjgzMSwibW9kZWxfbmFtZSI6ImFsbGlhbmNlX2NhdGFsb2d1ZV9hcHAuZXh0cmFjdXJyaWN1bGFyYWN0aXZpdHkiLCJtb2RlbF9kaXNwbGF5X25hbWUiOiJFeHRyYWN1cnJpY3VsYXIgQWN0aXZpdGllcyIsImNhdGFsb2d1ZV9pZCI6NSwiY2F0YWxvZ3VlX25hbWUiOiJDYXRhbG9ndWUgZm9yIFN0dWRlbnRzIiwid2Vic2l0ZV9pZCI6Miwid2Vic2l0ZV9uYW1lIjoiVW5pdGUgQWdvcmEiLCJ3ZWJzaXRlX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAxMCIsInBhZ2VfaWQiOjUxLCJwYWdlX25hbWUiOiJFeHRyYSBDdXJyaWN1bGFyIEFjdGl2aXRpZXMiLCJwYWdlX3VybCI6Ii9zdHVkZW50LWNhdGFsb2d1ZS9leHRyYS1hY3QiLCJjYW5fcmVhZCI6dHJ1ZSwiY2FuX3dyaXRlIjpmYWxzZSwiY2FuX2NyZWF0ZSI6ZmFsc2UsImNhbl9kZWxldGUiOmZhbHNlfSx7Im1vZGVsX2lkIjo4MzIsIm1vZGVsX25hbWUiOiJhbGxpYW5jZV9jYXRhbG9ndWVfYXBwLmpvaW50cHJvZ3JhbW1lIiwibW9kZWxfZGlzcGxheV9uYW1lIjoiSm9pbnQgUHJvZ3JhbW1lcyIsImNhdGFsb2d1ZV9pZCI6NSwiY2F0YWxvZ3VlX25hbWUiOiJDYXRhbG9ndWUgZm9yIFN0dWRlbnRzIiwid2Vic2l0ZV9pZCI6Miwid2Vic2l0ZV9uYW1lIjoiVW5pdGUgQWdvcmEiLCJ3ZWJzaXRlX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAxMCIsInBhZ2VfaWQiOjM3LCJwYWdlX25hbWUiOiJKb2ludCBQcm9ncmFtbWVzIiwicGFnZV91cmwiOiIvc3R1ZGVudC1jYXRhbG9ndWUvanAiLCJjYW5fcmVhZCI6dHJ1ZSwiY2FuX3dyaXRlIjpmYWxzZSwiY2FuX2NyZWF0ZSI6ZmFsc2UsImNhbl9kZWxldGUiOmZhbHNlfSx7Im1vZGVsX2lkIjo4MjIsIm1vZGVsX25hbWUiOiJhbGxpYW5jZV9jYXRhbG9ndWVfYXBwLnJlc2VhcmNocHJvcG9zYWxzIiwibW9kZWxfZGlzcGxheV9uYW1lIjoiUmVzZWFyY2ggJiBJbm5vdmF0aW9uIFByb3Bvc2FscyIsImNhdGFsb2d1ZV9pZCI6MywiY2F0YWxvZ3VlX25hbWUiOiJSZXNlYXJjaCAmIElubm92YXRpb24gUHJvcG9zYWxzIiwid2Vic2l0ZV9pZCI6Miwid2Vic2l0ZV9uYW1lIjoiVW5pdGUgQWdvcmEiLCJ3ZWJzaXRlX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAxMCIsInBhZ2VfaWQiOjc1LCJwYWdlX25hbWUiOiJSZXNlYXJjaCBQcm9wb3NhbCIsInBhZ2VfdXJsIjoiL3Jlc2VhcmNoL3Byb3Bvc2FsIiwiY2FuX3JlYWQiOnRydWUsImNhbl93cml0ZSI6ZmFsc2UsImNhbl9jcmVhdGUiOmZhbHNlLCJjYW5fZGVsZXRlIjpmYWxzZX0seyJtb2RlbF9pZCI6ODI3LCJtb2RlbF9uYW1lIjoiYWxsaWFuY2VfY2F0YWxvZ3VlX2FwcC5pbnRlcm5zaGlwcyIsIm1vZGVsX2Rpc3BsYXlfbmFtZSI6IkludGVybnNoaXBzIiwiY2F0YWxvZ3VlX2lkIjo0LCJjYXRhbG9ndWVfbmFtZSI6IkludGVybnNoaXBzIiwid2Vic2l0ZV9pZCI6Miwid2Vic2l0ZV9uYW1lIjoiVW5pdGUgQWdvcmEiLCJ3ZWJzaXRlX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAxMCIsInBhZ2VfaWQiOjU2LCJwYWdlX25hbWUiOiJJbnRlcm5zaGlwcyIsInBhZ2VfdXJsIjoiL3N0dWRlbnQtY2F0YWxvZ3VlL2ludGVybnNoaXBzIiwiY2FuX3JlYWQiOnRydWUsImNhbl93cml0ZSI6ZmFsc2UsImNhbl9jcmVhdGUiOmZhbHNlLCJjYW5fZGVsZXRlIjpmYWxzZX1dfQ.FWHr7PCP9e7Fq-N-5BMD9hB0gS0fqBNz5V6kIOQQ7js'
            }
        })

        if (!response.ok) {
            if (response.status === 404) {
                const errorData = await response.json()
                throw new Error(JSON.stringify(errorData))
            }

            if (response.status === 401 || response.status === 403) {
                const errorData = await response.json()
                throw new Error(JSON.stringify(errorData))
            }
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

export const sendMessageV3 = async (
    aiHost,
    message,
    history=[],
    context="",
    model=AI_MODEL.GPT_4O_MINI,
    provider=AI_PROVIDER.OPENAI,
    temperature=0.7
) => {
        const payload = {
            "message": message,
            "history": history,
            "context": context,
            "model": model,
            "provider": provider,
            "temperature": temperature
        }

        const response = await fetch(`${aiHost}/assistant/rag/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error('Something went wrong while sending message')
        }

        if (response.body instanceof ReadableStream) {
            console.log("STREAMING RESPONSE", response)
            console.log("BOT RESPONSE IS STREAMING", response.body instanceof ReadableStream)
            return response
        }

        else {
            const data = await response.json()
            return data
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
