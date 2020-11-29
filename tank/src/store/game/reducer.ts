import * as gameConstants from './constants'
import { Reducer } from 'redux'
import { AsyncState } from '../user/reducer'
import { Game } from '../../models/game'

export interface GameState {
    createGameState: AsyncState
    getGamesState: AsyncState
    error: Error | null
    currentGame: Game | null
    games: Game[]
}

const INITIAL_STATE: GameState = {
    createGameState: AsyncState.unknown,
    getGamesState: AsyncState.unknown,
    error: null,
    currentGame: null,
    games: []
}

const gameReducer: Reducer<GameState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case gameConstants.CREATE_GAME_REQUEST_STARTED:
            return { ...state, loginState: AsyncState.inProcess }
        case gameConstants.CREATE_GAME_REQUEST_FINISHED:
            return {
                ...state,
                createGameState: AsyncState.success,
                currentGame: action.payload
            }
        case gameConstants.CREATE_GAME_REQUEST_ERROR:
            return { ...state, loginState: AsyncState.error }
        case gameConstants.GET_GAMES_REQUEST_STARTED:
            return { ...state, loginState: AsyncState.inProcess }
        case gameConstants.GET_GAMES_REQUEST_FINISHED:
            return {
                ...state,
                getGamesState: AsyncState.success,
                games: action.payload
            }
        case gameConstants.GET_GAMES_REQUEST_ERROR:
            return { ...state, getGamesState: AsyncState.error }
        default:
            return state
    }
}

export default gameReducer