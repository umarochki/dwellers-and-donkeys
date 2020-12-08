import React, { useState } from 'react'
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
// import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { createGame } from '../../store/game/actions'
import { useDispatch } from 'react-redux'

// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         formControl: {
//             marginTop: theme.spacing(1),
//             minWidth: 120,
//         },
//         selectEmpty: {
//             marginTop: theme.spacing(2),
//         },
//     }),
// )

interface Props {
    open: boolean
    onClose: () => void
}

const CreateWorldDialog: React.FC<Props> = props => {
    const { open, onClose } = props
    const dispatch = useDispatch()
    const { register } = useForm()

    const [isLoading, setIsLoading] = useState(false)

    const [nameValue, setNameValue] = useState('')
    const [descValue, setDescValue] = useState('')

    return (
        <Dialog disableBackdropClick open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <form>
                <DialogTitle id="form-dialog-title">Создать игровой мир</DialogTitle>
                <DialogContent>
                    <TextField
                        ref={register}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Название"
                        type="text"
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        ref={register}
                        margin="dense"
                        id="desc"
                        label="Описание"
                        type="text"
                        value={descValue}
                        onChange={e => setDescValue(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    {isLoading
                        ? (<CircularProgress size={26}/>)
                        : <>
                            <Button onClick={onClose} color="primary">
                                Отменить
                            </Button>
                            <Button color="primary"
                                onClick={() => {
                                    setIsLoading(true)
                                    dispatch(createGame(nameValue, descValue))
                                }}>
                                Создать
                            </Button>
                        </>}
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateWorldDialog