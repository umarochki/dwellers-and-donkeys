export function authHeader() {
    const userStorage = localStorage.getItem('user')
    const user = userStorage ? JSON.parse(userStorage) : null

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token }
    } else {
        return {}
    }
}
