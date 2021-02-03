import * as gameConstants from './constants'
import { Reducer } from 'redux'
import { AsyncState } from '../user/reducer'
import { Game, SocketMessage } from '../../models/game'

export interface GameState {
    createGameState: AsyncState
    getGamesState: AsyncState
    error: Error | null
    currentGame: Game | null
    games: Game[]
    currentGameData: SocketMessage | null
    connectGameState: AsyncState
}

const INITIAL_STATE: GameState = {
    createGameState: AsyncState.unknown,
    getGamesState: AsyncState.unknown,
    error: null,
    currentGame: null,
    games: [],
    currentGameData: null,
    connectGameState: AsyncState.unknown,
}

const gameReducer: Reducer<GameState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case gameConstants.CREATE_GAME_REQUEST_STARTED:
            return { ...state, createGameState: AsyncState.inProcess, connectGameState: AsyncState.inProcess }
        case gameConstants.CREATE_GAME_REQUEST_FINISHED:
            return {
                ...state,
                connectGameState: AsyncState.inProcess,
                createGameState: AsyncState.success,
                currentGame: action.payload,
            }
        case gameConstants.CREATE_GAME_REQUEST_ERROR:
            return { ...state, createGameState: AsyncState.error }
        case gameConstants.GET_GAMES_REQUEST_STARTED:
            return { ...state, getGamesState: AsyncState.inProcess }
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
        case gameConstants.CONNECT_GAME_STARTED:
            return {
                ...state,
                currentGame: { invitation_code: action.payload },
                connectGameState: AsyncState.inProcess
            }
        case gameConstants.CONNECT_GAME_FINISHED:
            return { ...state, connectGameState: AsyncState.success }
        case gameConstants.DISCONNECT_GAME:
            return {
                ...state,
                currentGame: null,
                currentGameData: null,
                connected: false,
                connectGameState: AsyncState.unknown
            }
        case gameConstants.CONNECT_GAME_ERROR:
            return {
                ...state,
                currentGame: null,
                currentGameData: null,
                connected: false,
                connectGameState: AsyncState.error
            }
        default:
            return state
    }
}

export default gameReducer