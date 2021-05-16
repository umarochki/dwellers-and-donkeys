export interface User {
    username: string
    email: string
    first_name: string
    last_name: string
}

export interface ConnectedUser {
    id: number
    username: string
}

export interface GoogleAuthResponse {
    codeUrl: string
}