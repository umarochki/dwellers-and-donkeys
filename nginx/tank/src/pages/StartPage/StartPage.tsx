import React, { useCallback, useEffect, useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import StartPageHeader from './StartPageHeader'
import CreatedGameWorlds from './CreatedGameWorlds'
import seaDark from '../../assets/Sea_dark.png'
import { Avatar, Menu, MenuItem } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, selectQuickStartState } from '../../store/user/selectors'
import { logout } from '../../store/user/actions'
import { AsyncState } from '../../store/user/reducer'
import ImageLoader from '../../components/common/ImageLoader'
import CreateWorldDialog from '../../components/Dialogs/CreateWorldDialog'
import FullscreenLoader from '../../components/Containers/FullscreenLoader'
import { getGameHistory, getGMGameHistory, getPublicGames } from '../../store/game/actions'
import { selectGameHistory, selectGMGameHistory, selectPublicGames } from '../../store/game/selectors'

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
    },
    toolbarAvatar: {
        marginLeft: 'auto'
    },
    avatar: {
        cursor: 'pointer'
    }
}))

const StartPage = () => {
    const classes = useStyles()
    const user = useSelector(selectCurrentUser)
    const quickStartState = useSelector(selectQuickStartState)
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const dispatch = useDispatch()

    const [worldDialogOpen, setWorldDialogOpen] = React.useState(false)
    const openWorldDialog = useCallback(() => setWorldDialogOpen(true), [])
    const closeWorldDialog = useCallback(() => setWorldDialogOpen(false), [])

    const gameHistory = useSelector(selectGameHistory)
    const gameHistoryGM = useSelector(selectGMGameHistory)
    const gamesPublic = useSelector(selectPublicGames)

    const handleProfileClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }, [])

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    const handleLogout = useCallback(() => {
        handleClose()
        dispatch(logout())
    }, [handleClose, dispatch])

    useEffect(() => {
        dispatch(getGameHistory())
        dispatch(getGMGameHistory())
        dispatch(getPublicGames())
    }, [dispatch])

    if (!user && quickStartState !== AsyncState.success) {
        return <FullscreenLoader/>
    }

    return (
        <>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar className={classes.toolbarAvatar}>
                    {user && <Avatar onClick={handleProfileClick} className={classes.avatar}/>}
                    <Menu
                        id="profile-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <MenuItem onClick={handleLogout}>Log out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <main>
                <StartPageHeader className={classes.content} openWorldDialog={openWorldDialog}/>
                <CreatedGameWorlds title="Created games (as Game Master):" games={gameHistoryGM} openWorldDialog={openWorldDialog} showAddCard/>
                <CreatedGameWorlds title="Game history (as Player):" games={gameHistory} openWorldDialog={openWorldDialog}/>
                <CreatedGameWorlds title="Public games:" games={gamesPublic} openWorldDialog={openWorldDialog} removable={false}/>
                <ImageLoader src={seaDark} className={classes.seaDark}/>
                {/*<CreatedCharacters />*/}
            </main>
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    U M R Team
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Nothing important here.
                </Typography>
                <Copyright/>
            </footer>
            <CreateWorldDialog open={worldDialogOpen} onClose={closeWorldDialog}/>
        </>
    )
}

export default StartPage