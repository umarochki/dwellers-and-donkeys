import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import StartPage from '../../pages/StartPage/StartPage'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import theme from '../../styles/mui-theme'
import Tabletop from '../../pages/Tabletop/Tabletop'
import GameCreationPage from '../../pages/GameCreationPage/GameCreationPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import { AuthRoutes, NonAuthRoutes } from '../../routes'
import { useDispatch } from 'react-redux'
import { getMyself } from '../../store/user/actions'
import { ConnectedRouter } from 'connected-react-router'
import { history } from '../../helpers/history'
import WebSocketProvider from '../Contexts/WebSocketContext'

const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMyself())
    }, [dispatch])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <ConnectedRouter history={history}>
                <WebSocketProvider>
                    <Switch>
                        <Route path="/" exact component={StartPage}/>
                        <Route path={NonAuthRoutes.login} exact component={LoginPage}/>
                        <Route path={AuthRoutes.newGame} exact component={GameCreationPage}/>
                        <Route path={AuthRoutes.tabletop} exact component={Tabletop}/>
                    </Switch>
                </WebSocketProvider>
            </ConnectedRouter>
        </ThemeProvider>
    )
}

export default App