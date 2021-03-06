import gameConstants from './constants'
import { Reducer } from 'redux'
import { AsyncState } from '../user/reducer'
import { Game } from '../../models/game'
import { SocketMessage } from '../../models/socket'

export interface GameState {
    createGameState: AsyncState
    getAllGamesState: AsyncState
    error: Error | null
    currentGame: Game | null
    allGames: Game[]
    games: Game[]
    gamesGM: Game[]
    publicGames: Game[]
    currentGameData: SocketMessage | null
    connectGameState: AsyncState
}

const INITIAL_STATE: GameState = {
    createGameState: AsyncState.unknown,
    getAllGamesState: AsyncState.unknown,
    error: null,
    currentGame: null,
    allGames: [],
    games: [],
    gamesGM: [],
    publicGames: [],
    currentGameData: null,
    connectGameState: AsyncState.unknown,
}

const gameReducer: Reducer<GameState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case gameConstants.CREATE_GAME_REQUEST_STARTED:
            return { ...state, createGameState: AsyncState.inProcess }
        case gameConstants.CREATE_GAME_REQUEST_FINISHED:
            return {
                ...state,
                createGameState: AsyncState.success,
                currentGame: action.payload,
            }
        case gameConstants.CREATE_GAME_REQUEST_ERROR:
            return { ...state, createGameState: AsyncState.error }
        case gameConstants.GET_ALL_GAMES_REQUEST_STARTED:
            return { ...state, allGames: [], getAllGamesState: AsyncState.inProcess }
        case gameConstants.GET_ALL_GAMES_REQUEST_FINISHED:
            return { ...state, allGames: action.payload, getAllGamesState: AsyncState.success }
        case gameConstants.GET_ALL_GAMES_REQUEST_ERROR:
            return { ...state, allGames: [], getAllGamesState: AsyncState.error }
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
            return { ...state, getGMGameHistoryState: AsyncState.error }
        case gameConstants.GET_PUBLIC_GAMES_REQUEST_STARTED:
            return { ...state, getPublicGamesState: AsyncState.inProcess }
        case gameConstants.GET_PUBLIC_GAMES_REQUEST_FINISHED:
            return {
                ...state,
                getPublicGamesState: AsyncState.success,
                publicGames: action.payload.filter((game: Game) => !game.is_private)
            }
        case gameConstants.GET_PUBLIC_GAMES_REQUEST_ERROR:
            return { ...state, getPublicGamesState: AsyncState.error, publicGames: [] }
        case gameConstants.UPDATE_GAME_DATA:
            return { ...state, currentGameData: action.payload }
        case gameConstants.CONNECT_GAME_STARTED:
            return {
                ...state,
                currentGame: action.payload,
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
        case gameConstants.DELETE_GAME_REQUEST_FINISHED:
            const id = action.payload
            return {
                ...state,
                games: state.games.filter((game: Game) => game.id !== id),
                gamesGM: state.gamesGM.filter((game: Game) => game.id !== id),
                publicGames: state.publicGames.filter((game: Game) => game.id !== id)
            }
        default:
            return state
    }
}

export default gameReducer