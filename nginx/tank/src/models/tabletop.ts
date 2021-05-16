import { SocketMessageBase, SocketMessageType } from './socket'
import { GameObject } from './game'
import { ChatMessagePayload } from './chat'
import { ConnectedUser } from './user'
import { Hero } from './hero'

export interface ClearMessage extends SocketMessageBase {
    type: SocketMessageType.Clear
}

export interface RefreshMessage extends SocketMessageBase {
    type: SocketMessageType.Refresh
    meta: RefreshMessagePayload
}

interface RefreshMessagePayload {
    game_objects: GameObject[]
    chat: ChatMessagePayload[]
    active_users: ConnectedUser[]
    map: string
    my_hero: Hero
    is_gm: boolean
    maps: string[]
}

// Добавление объекта
export interface AddMessage extends SocketMessageBase {
    type: SocketMessageType.Add
    meta: GameObject
}

export interface AddMessagePayload {
    type: 'marker' | 'character'
    sprite: string
    xy: [number, number]
}

// Обновление объекта
export interface UpdateMessage extends SocketMessageBase {
    type: SocketMessageType.Update
    meta: UpdateMessagePayload
}

export interface UpdateAndStartMessage extends SocketMessageBase {
    type: SocketMessageType.UpdateAndStart
    meta: UpdateMessagePayload
}

export interface UpdateAndSaveMessage extends SocketMessageBase {
    type: SocketMessageType.UpdateAndSave
    meta: UpdateMessagePayload
}

export interface UpdateMessagePayload {
    id: number,
    hp: number,
    xy: [number, number]
}

// Удаление объекта
export interface DeleteMessage extends SocketMessageBase {
    type: SocketMessageType.Delete
    meta: DeleteMessagePayload
}

export interface DeleteMessagePayload {
    id: string
}