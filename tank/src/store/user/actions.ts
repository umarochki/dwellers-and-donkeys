import { Dispatch } from 'react'
import userService from '../../services/user'
import { alertActions } from '../notifications/actions'
import * as userConstants from './constants'
import { push } from 'connected-react-router'

export const login = (username: string, password: string) => {
    return (dispatch: Dispatch<any>) => {
        dispatch(request())

        userService.login({ username, password })
            .then(() => {
                dispatch(success())
                dispatch(push('/'))
            }, error => {
                dispatch(failure(error))
                dispatch(alertActions.error(error))
            })
    }

    function request() { return { type: userConstants.LOGIN_REQUEST_STARTED } }
    function success() { return { type: userConstants.LOGIN_REQUEST_FINISHED } }
    function failure(error: any) { return { type: userConstants.LOGIN_REQUEST_ERROR, error } }
}

export const logout = () => {
    userService.logout()
    return { type: userConstants.LOGOUT }
}

export const signup = (username: string, email: string, password: string) => {
    return (dispatch: Dispatch<any>) => {
        dispatch(request())

        userService.signup({ username, email, password })
            .then(user => {
                dispatch(success(user))
                dispatch(push('/'))
            }, error => {
                dispatch(failure(error))
                dispatch(alertActions.error(error))
            })
    }

    function request() { return { type: userConstants.LOGIN_REQUEST_STARTED } }
    function success(user: any) { return { type: userConstants.LOGIN_REQUEST_FINISHED, user } }
    function failure(error: any) { return { type: userConstants.LOGIN_REQUEST_ERROR, error } }
}