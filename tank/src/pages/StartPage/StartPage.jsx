import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import StartPageHeader from './StartPageHeader'
import CreatedGameWorlds from './CreatedGameWorlds'
import seaDark from '../../assets/Sea_dark.png'
import CreatedCharacters from './CreatedCharacters'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            UMR
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const useStyles = makeStyles(theme => ({
    content: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    seaDark: {
        width: '100%'
    }
}))

const StartPage = () => {
    const classes = useStyles()

    return (
        <>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar/>
            </AppBar>
            <main>
                <StartPageHeader className={classes.content}/>
                <CreatedGameWorlds />
                <img  src={seaDark} className={classes.seaDark} alt=""/>
                <CreatedCharacters />
            </main>
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    U M R Team
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Здесь нет ничего важного.
                </Typography>
                <Copyright/>
            </footer>
        </>
    )
}

export default StartPage