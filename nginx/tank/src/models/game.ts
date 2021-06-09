import { AddHeroPayload } from './hero'
import { AddMessagePayload } from './tabletop'

export interface Game {
    id: number
    name: string
    description: string
    preview?: string
    game_master: number
    is_private: boolean
    invitation_code: string
    game_objects: GameObject[]
}

export type GameObject = AddHeroPayload | AddMessagePayload