import { alertActions } from '../notifications/actions'
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
                dispatch(push(AuthRoutes.tabletop))
            }, error => {
                dispatch(failure(error))
                dispatch(alertActions.error(error))
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

export const connectGame = (code: string) => {
    return {
        type: gameConstants.CONNECT_GAME_STARTED,
        payload: code
    }
}

export const connectGameSuccess = () => {
    return {
        type: gameConstants.CONNECT_GAME_FINISHED
    }
}

export const disconnectGameError = () => {
    return {
        type: gameConstants.DISCONNECT_GAME_ERROR
    }
}
export const disconnectGame = () => {
    return {
        type: gameConstants.DISCONNECT_GAME
    }
}