import React, { useCallback, useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import StartPageHeader from './StartPageHeader'
import CreatedGameWorlds from './CreatedGameWorlds'
import seaDark from '../../assets/Sea_dark.png'
import { Menu, MenuItem } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, selectQuickStartState } from '../../store/user/selectors'
import { logout } from '../../store/user/actions'
import FullscreenLoader from '../../components/Containers/FullscreenLoader/FullscreenLoader'
import { AsyncState } from '../../store/user/reducer'
import ImageLoader from '../../components/Containers/ImageLoader'

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
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()

    // const handleProfileClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget)
    // }, [])

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    const handleLogout = useCallback(() => {
        handleClose()
        dispatch(logout())
    }, [handleClose, dispatch])

    if (!user && quickStartState !== AsyncState.success) {
        return <FullscreenLoader/>
    }

    return (
        <>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar className={classes.toolbarAvatar}>
                    {/*{user && <Avatar onClick={handleProfileClick} className={classes.avatar}>?</Avatar>}*/}
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
                        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <main>
                <StartPageHeader className={classes.content}/>
                <CreatedGameWorlds/>
                <ImageLoader src={seaDark} className={classes.seaDark}/>
                {/*<CreatedCharacters />*/}
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