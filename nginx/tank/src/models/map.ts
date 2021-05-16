import { SocketMessageBase, SocketMessageType } from './socket'
import { GameObject } from './game'

export interface MapFile extends Map {
    id: number
    type: string
    created: number
    creator: number
}

export interface Map {
    name: string
    file: string
    hash: string
}

export interface MapMessage extends SocketMessageBase {
    type: SocketMessageType.Map
    meta: MapMessagePayload
}

export interface MapMessagePayload {
    map: string
    game_objects: GameObject[]
}

export interface GlobalMapMessage extends SocketMessageBase {
    type: SocketMessageType.GlobalMap
    meta: GlobalMapMessagePayload
}

export interface GlobalMapMessagePayload extends MapMessagePayload {
    map: 'Global'
}
