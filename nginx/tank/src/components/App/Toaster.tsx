import React, { useCallback } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IconButton, Snackbar } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { clearNotifications } from '../../store/notifications/actions'
import { selectNotificationState } from '../../store/notifications/selectors'
import Grow from '@material-ui/core/Grow'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import CloseIcon from '@material-ui/icons/Close'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { primary700 } from '../../styles/colors'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        close: {
            padding: theme.spacing(0.5),
        },
        alert: {
            backgroundColor: primary700
        }
    }),
)

const GrowTransition = (props: TransitionProps) => {
    return <Grow {...props} />
}

const Alert = (props: AlertProps) => {
    const classes = useStyles()
    return <MuiAlert className={classes.alert} elevation={6} variant="filled" {...props} />
}

const Toaster: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const notificationState = useSelector(selectNotificationState)

    const close = useCallback((event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        return dispatch(clearNotifications())
    }, [dispatch])

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            open={notificationState.show}
            autoHideDuration={4000}
            onClose={close}
            aria-describedby="snackbar"
            message={notificationState.message}
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    className={classes.close}
                    onClick={close}
                >
                    <CloseIcon/>
                </IconButton>
            ]}
            TransitionComponent={GrowTransition}
        >
            <Alert onClose={close} severity={notificationState.type || 'info'}>
                {notificationState.message}
            </Alert>
        </Snackbar>
    )
}

export default Toaster