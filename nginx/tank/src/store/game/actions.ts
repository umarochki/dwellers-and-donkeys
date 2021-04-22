import { showErrorNotification } from '../notifications/actions'
import * as gameConstants from './constants'
import { Dispatch } from '..'
import gameService from '../../services/game'
import { push } from 'connected-react-router'
import { AuthRoutes } from '../../routes'
import { Game } from '../../models/game'

export const createGame = (name: string, description: string) => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        gameService.create({ name, description })
            .then((game: Game) => {
                dispatch(success(game))
                dispatch(push(`${AuthRoutes.tabletop}/${game.invitation_code}`))
            }, error => {
                dispatch(failure(error))
                dispatch(showErrorNotification(error.message))
            })
    }

    function request() { return { type: gameConstants.CREATE_GAME_REQUEST_STARTED } }
    function success(game: Game) { return { type: gameConstants.CREATE_GAME_REQUEST_FINISHED, payload: game } }
    function failure(error: Error) { return { type: gameConstants.CREATE_GAME_REQUEST_ERROR, error } }
}

export const updateGameData = (data: object) => {
    return {
        type: gameConstants.UPDATE_GAME_DATA,
        payload: data
    }
}

export const connectGameWithRedirect = (code: string) => {
    return (dispatch: Dispatch) => {
        dispatch(request(code))
        dispatch(push(`${AuthRoutes.tabletop}/${code}`))
    }

    function request(code: string) { return { type: gameConstants.CONNECT_GAME_STARTED, payload: code } }
}

export const connectGame = (code: string) => {
    return (dispatch: Dispatch) => {
        dispatch(request(code))
    }

    function request(code: string) { return { type: gameConstants.CONNECT_GAME_STARTED, payload: code } }
}

export const connectGameSuccess = () => {
    return { type: gameConstants.CONNECT_GAME_FINISHED }
}

export const connectGameError = () => {
    return (dispatch: Dispatch) => {
        dispatch(failure())
        dispatch(push('/'))
    }

    function failure() { return { type: gameConstants.CONNECT_GAME_ERROR } }
}
export const disconnectGame = () => {
    return {
        type: gameConstants.DISCONNECT_GAME
    }
}

export const getGameHistory = () => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        gameService.getGameHistory()
            .then((games: Game[]) => {
                dispatch(success(games))
            }, error => {
                dispatch(failure(error))
                dispatch(showErrorNotification(error.message))
            })
    }

    function request() { return { type: gameConstants.GET_GAME_HISTORY_REQUEST_STARTED } }
    function success(games: Game[]) { return { type: gameConstants.GET_GAME_HISTORY_REQUEST_FINISHED, payload: games } }
    function failure(error: Error) { return { type: gameConstants.GET_GAME_HISTORY_REQUEST_ERROR, error } }
}

export const getGMGameHistory = () => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        gameService.getGMGameHistory()
            .then((games: Game[]) => {
                dispatch(success(games))
            }, error => {
                dispatch(failure(error))
                dispatch(showErrorNotification(error.message))
            })
    }

    function request() { return { type: gameConstants.GET_GM_GAME_HISTORY_REQUEST_STARTED } }
    function success(games: Game[]) { return { type: gameConstants.GET_GM_GAME_HISTORY_REQUEST_FINISHED, payload: games } }
    function failure(error: Error) { return { type: gameConstants.GET_GM_GAME_HISTORY_REQUEST_ERROR, error } }
}