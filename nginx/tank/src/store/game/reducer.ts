import * as gameConstants from './constants'
import { Reducer } from 'redux'
import { AsyncState } from '../user/reducer'
import { Game, SocketMessage } from '../../models/game'

export interface GameState {
    createGameState: AsyncState
    getGameHistoryState: AsyncState
    getGMGameHistoryState: AsyncState
    error: Error | null
    currentGame: Game | null
    games: Game[]
    gamesGM: Game[]
    currentGameData: SocketMessage | null
    connectGameState: AsyncState
}

const INITIAL_STATE: GameState = {
    createGameState: AsyncState.unknown,
    getGameHistoryState: AsyncState.unknown,
    getGMGameHistoryState: AsyncState.unknown,
    error: null,
    currentGame: null,
    games: [],
    gamesGM: [],
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
        case gameConstants.GET_GAME_HISTORY_REQUEST_STARTED:
            return { ...state, getGameHistoryState: AsyncState.inProcess }
        case gameConstants.GET_GAME_HISTORY_REQUEST_FINISHED:
            return {
                ...state,
                getGameHistoryState: AsyncState.success,
                games: action.payload
            }
        case gameConstants.GET_GAME_HISTORY_REQUEST_ERROR:
            return { ...state, getGameHistoryState: AsyncState.error }
        case gameConstants.GET_GM_GAME_HISTORY_REQUEST_STARTED:
            return { ...state, getGMGameHistoryState: AsyncState.inProcess }
        case gameConstants.GET_GM_GAME_HISTORY_REQUEST_FINISHED:
            return {
                ...state,
                getGMGameHistoryState: AsyncState.success,
                gamesGM: action.payload
            }
        case gameConstants.GET_GM_GAME_HISTORY_REQUEST_ERROR:
            return { ...state, getGamesState: AsyncState.error }
        case gameConstants.UPDATE_GAME_DATA:
            return { ...state, getGMGameHistoryState: action.payload }
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