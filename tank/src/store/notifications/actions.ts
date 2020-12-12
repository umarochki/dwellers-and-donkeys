import * as alertConstants from './constants'
import { Dispatch } from '../index'

export const showSuccessNotification = (message?: string) => {
    return (dispatch: Dispatch) => {
        dispatch({ type: alertConstants.ALERT_SUCCESS, message })
    }
}

export const showErrorNotification = (error: string) => {
    return (dispatch: Dispatch) => {
        dispatch({ type: alertConstants.ALERT_ERROR, message: error })
    }
}

export const clearNotifications = () => {
    return (dispatch: Dispatch) => {
        dispatch({ type: alertConstants.ALERT_CLEAR })
    }
}
