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
    currentGameData: object
}

const INITIAL_STATE: GameState = {
    createGameState: AsyncState.unknown,
    getGamesState: AsyncState.unknown,
    error: null,
    currentGame: null,
    games: [],
    currentGameData: {}
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
        case gameConstants.UPDATE_GAME_DATA:
            return { ...state, currentGameData: action.payload }
        default:
            return state
    }
}

export default gameReducer