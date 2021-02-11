import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

interface Props {
    title: string
    open: boolean
    setOpen: Function
    onConfirm: () => void
}

const ConfirmDialog: React.FC<Props> = props => {
    const { title, children, open, setOpen, onConfirm } = props

    return (
        <Dialog
            style={{ zIndex: 3000 }}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    color="primary"
                >
                    No
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpen(false)
                        onConfirm()
                    }}
                    color="primary"
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmDialog