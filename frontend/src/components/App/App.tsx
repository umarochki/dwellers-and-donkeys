import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Main from '../../pages/Main/Main'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import theme from '../../styles/mui-theme'
import Tabletop from '../../pages/Tabletop/Tabletop'

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route path="/" exact component={Main}/>
                    <Route path="/tabletop" component={Tabletop}/>
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default App