import { combineReducers } from 'redux'
import authReducer, { AuthState } from './user/reducer'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'

export interface RootState {
    router: RouterState
    auth: AuthState
}

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
})

export default createRootReducer