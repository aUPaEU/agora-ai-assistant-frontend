export const translate = async (serviceHost, value, from="auto", to="en") => {
    try {
        const res = await fetch(`${serviceHost}/translate`, {
            method: "POST",
            body: JSON.stringify({
                q: value,
                source: from,
                target: to,
                format: "text",
                alternatives: 1,
                api_key: ""
            }),
            headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json()

        if (!data || !data.translatedText) return value
    
        return data.translatedText
    }
    
    catch (error) {
        console.warn(`TRANSLATION SERVICE INFO\nThe translation service is not available.\nThe query will be searched in the original language.\nMore information: ${error}.\nProbably the host is blocking the request or doesn't have the service running.`)
        return value
    }
}

export const translateServiceIsAvailable = async (serviceHost) => {
    try {
        const res = await fetch(`${serviceHost}/translate`, {
            method: "POST",
            body: JSON.stringify({
                q: 'ping',
                source: 'auto',
                target: 'en',
                format: "text",
                alternatives: 1,
                api_key: ""
            }),
            headers: { "Content-Type": "application/json" }
        });

        return res.ok
    }
    
    catch (error) {
        console.warn(`TRANSLATION SERVICE INFO\nThe translation service is not available.\nMore information: ${error}.\nProbably the host is blocking the request or doesn't have the service running.`)
        return false
    }
}

