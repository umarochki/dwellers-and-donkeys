import * as alertConstants from './constants'

export const alertActions = {
    success,
    error,
    clear
}

function success(message: string) {
    return { type: alertConstants.ALERT_SUCCESS, message }
}

function error(message: string) {
    return { type: alertConstants.ALERT_ERROR, message }
}

function clear() {
    return { type: alertConstants.ALERT_CLEAR }
}
