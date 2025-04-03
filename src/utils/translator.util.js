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
        console.error(error)
        return value
    }
}