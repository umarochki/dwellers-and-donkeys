import { combineReducers } from 'redux'
import authReducer, { AuthState } from './user/reducer'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import gameReducer, { GameState } from './game/reducer'
import notificationReducer, { NotificationState } from './notifications/reducer'
import mapReducer, { MapState } from './map/reducer'
import heroReducer, { HeroState } from './hero/reducer'

export interface RootState {
    router: RouterState
    auth: AuthState
    game: GameState
    notification: NotificationState
    map: MapState,
    hero: HeroState
}

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    game: gameReducer,
    notification: notificationReducer,
    map: mapReducer,
    hero: heroReducer
})

export default createRootReducer