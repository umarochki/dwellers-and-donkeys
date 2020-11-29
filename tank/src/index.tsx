import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.scss'
import App from './components/App/App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import configureStore from './store'
import { ConnectedRouter } from 'connected-react-router'
import { history } from './helpers/history'
import { setupInterceptors } from './services'

const store = configureStore()
setupInterceptors(store)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
