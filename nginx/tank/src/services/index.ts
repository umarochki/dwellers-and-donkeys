import axios from 'axios'
import { getUrl } from '../helpers/authHeader'
import { Store } from 'redux'
import { push } from 'connected-react-router'
import { NonAuthRoutes } from '../routes'

const instance = axios.create({
    baseURL: `${getUrl()}/api/v1`,
    timeout: 3000,
    withCredentials: true
})

export const setupInterceptors = (store: Store) => {
    instance.interceptors.response.use(response => response,
        error => {
            if (error && error.response && error.response.status && error.response.status === 401) {
                store.dispatch(push(NonAuthRoutes.login))
            }
            return Promise.reject(error)
        })
}

export default instance