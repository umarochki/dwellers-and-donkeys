import API from './index'
import { User } from '../models/user'

export interface LoginRequest {
    username: string
    password: string
}

export interface SignupRequest {
    username: string
    email: string
    password: string
}

const userService = {
    login: (loginRequest: LoginRequest): Promise<string> =>
        API.post(`/auth/login`, loginRequest)
            .then(response => response.data),
    logout: (): Promise<void> =>
        API.get('/auth/logout')
            .then(response => response.data),
    signup: (request: SignupRequest): Promise<void> =>
        API.post('/auth/signup', request)
            .then(response => response.data),
    me: (): Promise<User> =>
        API.get('/auth/me')
            .then(response => response.data),
    quickStart: (): Promise<void> =>
        API.get('/auth/quickstart')
}

export default userService