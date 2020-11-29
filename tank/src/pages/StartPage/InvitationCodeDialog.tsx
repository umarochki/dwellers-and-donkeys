import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    root: {
        minWidth: '600px'
    }
}))

interface Props {
    open: boolean
    close: () => void
}

const InvitationCodeDialog: React.FC<Props> = props => {
    const { open, close } = props
    const classes = useStyles()

    return (
        <Dialog
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
                    type="email"
                    fullWidth
                    autoComplete="false"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    Отменить
                </Button>
                <Button onClick={close} color="primary">
                    Присоединиться
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default InvitationCodeDialog