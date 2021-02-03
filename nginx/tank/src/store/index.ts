import { Action, applyMiddleware, createStore } from 'redux'
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { history } from '../helpers/history'
import createRootReducer, { RootState } from './reducers'
import { routerMiddleware } from 'connected-react-router'

export type Dispatch = ThunkDispatch<RootState, undefined, Action>

const loggerMiddleware = createLogger()

export default function configureStore(initialState = {}) {
    return createStore(
        createRootReducer(history),
        initialState,
        applyMiddleware(
            routerMiddleware(history),
            thunkMiddleware,
            loggerMiddleware
        )
    )
}