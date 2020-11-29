import { alertActions } from '../notifications/actions'
import * as gameConstants from './constants'
import { Dispatch } from '..'
import gameService from '../../services/game'
import { push } from 'connected-react-router'
import { AuthRoutes } from '../../routes'

export const createGame = (name: string, description: string) => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        gameService.create({ name, description })
            .then(() => {
                dispatch(success())
                dispatch(push(AuthRoutes.tabletop))
            }, error => {
                dispatch(failure(error))
                dispatch(alertActions.error(error))
            })
    }

    function request() { return { type: gameConstants.CREATE_GAME_REQUEST_STARTED } }
    function success() { return { type: gameConstants.CREATE_GAME_REQUEST_FINISHED } }
    function failure(error: Error) { return { type: gameConstants.CREATE_GAME_REQUEST_ERROR, error } }
}
