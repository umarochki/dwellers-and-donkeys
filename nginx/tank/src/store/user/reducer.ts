import userConstants from './constants'
import { Reducer } from 'redux'
import { User } from '../../models/user'

export enum AsyncState {
    inProcess,
    success,
    error,
    unknown
}

export interface AuthState {
    loginState: AsyncState
    signupState: AsyncState
    quickStartState: AsyncState
    error: Error | null
    user: User | null
}

const INITIAL_STATE: AuthState = {
    loginState: AsyncState.unknown,
    signupState: AsyncState.unknown,
    quickStartState: AsyncState.unknown,
    error: null,
    user: null
}

const authReducer: Reducer<AuthState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST_STARTED:
            return { ...state, loginState: AsyncState.inProcess }
        case userConstants.LOGIN_REQUEST_FINISHED:
            return { ...state, loginState: AsyncState.success }
        case userConstants.LOGIN_REQUEST_ERROR:
            return { ...state, loginState: AsyncState.error }
        case userConstants.LOGOUT:
            return { ...state, loginState: AsyncState.unknown }
        case userConstants.SIGNUP_REQUEST_STARTED:
            return { ...state, signupState: AsyncState.inProcess }
        case userConstants.SIGNUP_REQUEST_FINISHED:
            return {
                ...state,
                signupState: AsyncState.success,
                loginState: AsyncState.success
            }
        case userConstants.SIGNUP_REQUEST_ERROR:
            return { ...state, signupState: AsyncState.error }
        case userConstants.MYSELF_REQUEST_STARTED:
            return { ...state, user: null }
        case userConstants.MYSELF_REQUEST_FINISHED:
            return {
                ...state,
                user: action.payload,
                loginState: AsyncState.success
            }
        case userConstants.MYSELF_REQUEST_ERROR:
            return { ...state, user: null }
        case userConstants.QUICK_START_REQUEST_STARTED:
            return { ...state, quickStartState: AsyncState.inProcess }
        case userConstants.QUICK_START_REQUEST_FINISHED:
            return { ...state, quickStartState: AsyncState.success }
        default:
            return state
    }
}

export default authReducer