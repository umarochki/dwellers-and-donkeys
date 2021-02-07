export interface Game {
    id?: number
    name?: string
    description?: string
    game_master?: number
    is_private?: boolean
    invitation_code?: string
    game_objects?: GameObject[]
}

export interface GameObject {

}

export interface SocketMessage {
    type: string
    meta: any
}

export interface GameDataMessage {
    type: string
    time: string
    message?: string
    total?: object
    sender: string
}