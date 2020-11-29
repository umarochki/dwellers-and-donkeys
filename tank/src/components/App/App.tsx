import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import StartPage from '../../pages/StartPage/StartPage'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import theme from '../../styles/mui-theme'
import Tabletop from '../../pages/Tabletop/Tabletop'
import GameCreationPage from '../../pages/GameCreationPage/GameCreationPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import { AuthRoutes, NonAuthRoutes } from '../../routes'

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route path="/" exact component={StartPage}/>
                    <Route path={NonAuthRoutes.login} component={LoginPage}/>
                    <Route path={AuthRoutes.newGame} component={GameCreationPage}/>
                    <Route path={AuthRoutes.tabletop} component={Tabletop}/>
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default App