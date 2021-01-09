import React, { useCallback, useMemo } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { getUrl } from '../../helpers/authHeader'
import { useDispatch } from 'react-redux'
import { showSuccessNotification } from '../../store/notifications/actions'

interface Props {
    open: boolean
    code: string
    onClose: () => void
}

const InviteDialog: React.FC<Props> = props => {
    const { open, code, onClose } = props
    const dispatch = useDispatch()

    const url = useMemo(() => `${getUrl()}/tabletop/${code}`, [code])

    const copy = useCallback(() => {
        navigator.clipboard.writeText(url)
        dispatch(showSuccessNotification('Скопировано'))
    }, [url, dispatch])

    return (
        <Dialog open={open}>
            <DialogTitle>Ссылка для приглашения</DialogTitle>
            <DialogContent>
                <DialogContentText>При переходе по ссылке, новый участник присоединится к игре:</DialogContentText>
                <DialogContentText style={{ textAlign: 'center' }}><a href={url}>{url}</a></DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Вернуться
                </Button>
                <Button onClick={copy} color="primary" autoFocus>
                    Скопировать
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default InviteDialog