import { LIST_ACCELERATION_SERVICE, ACCELERATION_SERVICES } from "../data/mock.data"

export const fetchAccelerationServices = async () => {
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