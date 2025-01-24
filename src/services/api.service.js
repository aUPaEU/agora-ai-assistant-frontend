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

    try {
        const url = `${CONFIG.host}/catalogue-api/v1/ai/${model}/${id}?fields=${fields 
            ? `${COMMON_FIELDS.concat(fields)}` 
            : `${COMMON_FIELDS}`
        }`
        
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