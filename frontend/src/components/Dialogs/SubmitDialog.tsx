import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@material-ui/core'

interface Props extends DialogProps {
    title: string
    subtitle?: string
    onSubmit: () => void
    onCancel: () => void
}

const SubmitDialog: React.FC<Props> = props => {
    const { title, subtitle, onSubmit, onCancel, ...dialogProps } = props
    return (
        <Dialog
            {...dialogProps}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            {
                subtitle &&
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{subtitle}</DialogContentText>
                </DialogContent>
            }
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Отменить
                </Button>
                <Button onClick={onSubmit} color="primary" autoFocus>
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SubmitDialog