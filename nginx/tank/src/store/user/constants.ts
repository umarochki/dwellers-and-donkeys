import { getConstants } from '../../helpers/getConstants'

const userConstants = getConstants([
    'LOGIN_REQUEST_STARTED',
    'LOGIN_REQUEST_FINISHED',
    'LOGIN_REQUEST_ERROR',

    'LOGOUT',

    'SIGNUP_REQUEST_STARTED',
    'SIGNUP_REQUEST_FINISHED',
    'SIGNUP_REQUEST_ERROR',

    'MYSELF_REQUEST_STARTED',
    'MYSELF_REQUEST_FINISHED',
    'MYSELF_REQUEST_ERROR',

    'QUICK_START_REQUEST_STARTED',
    'QUICK_START_REQUEST_FINISHED'
])

export default userConstants
