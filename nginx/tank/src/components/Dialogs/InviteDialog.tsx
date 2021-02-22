import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core'
import { getUrl } from '../../helpers/authHeader'
import { useDispatch } from 'react-redux'
import { showSuccessNotification } from '../../store/notifications/actions'
import CloseIcon from '@material-ui/icons/Close'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { copyTextToClipboard } from '../../helpers/clipBoard'

const useStyles = makeStyles(() =>
    createStyles({
        closeButton: {
            position: 'absolute',
            right: '6px',
            top: '4px'
        }
    })
)

interface Props {
    open: boolean
    code: string
    onClose: () => void
}

const InviteDialog: React.FC<Props> = props => {
    const { open, code, onClose } = props
    const dispatch = useDispatch()
    const classes = useStyles()

    const url = useMemo(() => `${getUrl()}/tabletop/${code}`, [code])

    const copy = useCallback(() => {
        copyTextToClipboard(url, () => {
            dispatch(showSuccessNotification('Copied'))
        })
    }, [url, dispatch])

    return (
        <Dialog open={open}>
            <IconButton onClick={onClose} className={classes.closeButton}>
                <CloseIcon />
            </IconButton>
            <DialogTitle>
                Link for invitation
            </DialogTitle>
            <DialogContent>
                <DialogContentText>When you click on the link, a new participant will join the game:</DialogContentText>
                <DialogContentText style={{ textAlign: 'center' }}><a href={url}>{url}</a></DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={copy}
                    color="primary"
                    autoFocus
                    endIcon={<FileCopyOutlinedIcon/>}
                >
                    Copy
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default InviteDialog