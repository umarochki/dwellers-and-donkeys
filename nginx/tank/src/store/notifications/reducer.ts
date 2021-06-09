import notificationConstants from './constants'
import { Reducer } from 'redux'
import { Color } from '@material-ui/lab'

export type NotificationState = Readonly<{
    show: boolean
    type: Color | null
    message: string
}>

const INITIAL_STATE: NotificationState = {
    show: false,
    type: null,
    message: ''
}

export const notificationReducer: Reducer<NotificationState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case notificationConstants.ALERT_SUCCESS: {
            return {
                show: true,
                type: 'success',
                message: action.message
            }
        }
        case notificationConstants.ALERT_ERROR: {
            return {
                show: true,
                type: 'error',
                message: action.message
            }
        }
        case notificationConstants.ALERT_CLEAR: {
            return {
                show: false,
                type: null,
                message: ''
            }
        }
        default:
            return state
    }
}

export default notificationReducer