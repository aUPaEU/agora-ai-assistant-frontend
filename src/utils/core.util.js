export const isDebugMode = () => {
    const queryParams = new URLSearchParams(window.location.search)
    return queryParams.get('debug') === '1'
}