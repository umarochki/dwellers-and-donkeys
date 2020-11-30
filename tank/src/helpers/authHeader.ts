export function authHeader() {
    const userStorage = localStorage.getItem('user')
    const user = userStorage ? JSON.parse(userStorage) : null

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token }
    } else {
        return {}
    }
}

export const getUrl = () => {
    if (window.location.host.includes('localhost')) {
        return 'http://localhost'
    }
    return ''
}

export const getUrlWithoutProtocol = () => {
    return getUrl().replace(/(^\w+:|^)\/\//, '')
}