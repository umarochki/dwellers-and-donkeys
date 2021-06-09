export const getUrl = () => {
    return `http://${window.location.host}`
}

export const getUrlWithoutProtocol = () => {
    return getUrl().replace(/(^\w+:|^)\/\//, '')
}