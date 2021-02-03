import API from './index'
import { Game } from '../models/game'

export interface GameRequest {
    name: string
    description: string
}

const gameService = {
    create: (gameRequest: GameRequest): Promise<Game> =>
        API.post(`/games`, gameRequest)
            .then(response => response.data),
    getGames: (): Promise<Game[]> =>
        API.get('/games')
            .then(response => response.data)
}

export default gameService