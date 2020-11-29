import { combineReducers } from 'redux'
import authReducer, { AuthState } from './user/reducer'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import gameReducer, { GameState } from './game/reducer'

export interface RootState {
    router: RouterState
    auth: AuthState
    game: GameState
}

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    game: gameReducer
})

export default createRootReducer