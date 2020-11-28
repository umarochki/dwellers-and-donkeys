import * as notificationConstants from './constants'
import { Reducer } from 'redux'

export type NotificationState = Readonly<{
    type: string | null
    message: string
}>

const INITIAL_STATE: NotificationState = {
    type: null,
    message: ''
}

export const notificationReducer: Reducer<NotificationState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case notificationConstants.ALERT_SUCCESS: {
            return {
                type: 'alert-success',
                message: action.message
            }
        }
        case notificationConstants.ALERT_ERROR: {
            return {
                type: 'alert-danger',
                message: action.message
            }
        }
        case notificationConstants.ALERT_CLEAR: {
            return {
                type: null,
                message: ''
            }
        }
        default:
            return state
    }
}

export default notificationReducer