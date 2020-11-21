import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import StartPage from '../../pages/StartPage/StartPage'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import theme from '../../styles/mui-theme'
import Tabletop from '../../pages/Tabletop/Tabletop'
import GameCreationPage from '../../pages/GameCreationPage/GameCreationPage'

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route path="/" exact component={StartPage}/>
                    <Route path="/new-game" exact component={GameCreationPage}/>
                    <Route path="/tabletop" component={Tabletop}/>
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default App