import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { history } from '../helpers/history'
import createRootReducer from './reducers'
import { routerMiddleware } from 'connected-react-router'

const loggerMiddleware = createLogger()

export default function configureStore(initialState = {}) {
    return createStore(
        createRootReducer(history), // root reducer with router state
        initialState,
        applyMiddleware(
            routerMiddleware(history),
            thunkMiddleware,
            loggerMiddleware
        )
    )
}