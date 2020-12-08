import React, { useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'
import { connectGame } from '../../store/game/actions'
import { useDispatch, useSelector } from 'react-redux'
import { selectConnectGameState } from '../../store/game/selectors'
import { AsyncState } from '../../store/user/reducer'

const useStyles = makeStyles(() => ({
    root: {
        minWidth: '600px'
    },
    loader: {

    }
}))

interface Props {
    open: boolean
    close: () => void
}

const InvitationCodeDialog: React.FC<Props> = props => {
    const { open, close } = props
    const classes = useStyles()
    const dispatch = useDispatch()
    const connected = useSelector(selectConnectGameState)

    const [invitationCodeValue, setInvitationCodeValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const handleConnect = useCallback(() => {
        setIsLoading(true)
        dispatch(connectGame(invitationCodeValue))
    }, [dispatch, invitationCodeValue])

    useEffect(() => {
        if (connected === AsyncState.error) {
            setIsLoading(false)
        }
    }, [connected, dispatch])

    return (
        <Dialog
            disableBackdropClick
            fullWidth
            maxWidth="xs"
            open={open} onClose={close} aria-labelledby="form-dialog-title" className={classes.root}>
            <DialogTitle id="form-dialog-title">Введите код приглашения</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Код приглашения"
                    value={invitationCodeValue}
                    onChange={e => setInvitationCodeValue(e.target.value)}
                    type="email"
                    fullWidth
                    autoComplete="off"
                />
            </DialogContent>
            <DialogActions>
                {isLoading
                    ? (<Button color="primary"><CircularProgress size={26} className={classes.loader}/></Button>)
                    : <>
                        <Button onClick={close} color="primary">
                            Отменить
                        </Button>
                        <Button onClick={handleConnect} color="primary" disabled={!invitationCodeValue}>
                            Присоединиться
                        </Button>
                    </>}
            </DialogActions>
        </Dialog>
    )
}

export default InvitationCodeDialog