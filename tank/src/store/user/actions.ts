import userService from '../../services/user'
import { alertActions } from '../notifications/actions'
import * as userConstants from './constants'
import { push } from 'connected-react-router'
import { User } from '../../models/user'
import { Dispatch } from '..'

export const login = (username: string, password: string) => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        userService.login({ username, password })
            .then(() => {
                dispatch(success())
                dispatch(push('/'))
                dispatch(getMyself())
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
    return (dispatch: Dispatch) => {
        dispatch(request())
        userService.logout()
        dispatch(push('/login'))
    }

    function request() { return { type: userConstants.LOGOUT } }
}

export const signup = (username: string, email: string, password: string) => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        userService.signup({ username, email, password })
            .then(() => {
                dispatch(success())
                dispatch(push('/'))
                dispatch(getMyself())
            }, error => {
                dispatch(failure(error))
                dispatch(alertActions.error(error))
            })
    }

    function request() { return { type: userConstants.SIGNUP_REQUEST_STARTED } }
    function success() { return { type: userConstants.SIGNUP_REQUEST_FINISHED } }
    function failure(error: Error) { return { type: userConstants.SIGNUP_REQUEST_ERROR, error } }
}

export const getMyself = () => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        userService.me()
            .then(user => {
                dispatch(success(user))
            }, error => {
                dispatch(failure(error))
                dispatch(alertActions.error(error))
            })
    }

    function request() { return { type: userConstants.MYSELF_REQUEST_STARTED } }
    function success(user: User) { return { type: userConstants.MYSELF_REQUEST_FINISHED, payload: user } }
    function failure(error: Error) { return { type: userConstants.MYSELF_REQUEST_ERROR, payload: error } }
}