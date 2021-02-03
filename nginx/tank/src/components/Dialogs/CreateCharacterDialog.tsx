import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            marginTop: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
)

interface Props {
    open: boolean
    onClose: () => void
}

const CreateCharacterDialog: React.FC<Props> = props => {
    const { open, onClose } = props
    const classes = useStyles()
    const { register } = useForm()

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <form>
                <DialogTitle id="form-dialog-title">Создать персонажа</DialogTitle>
                <DialogContent>
                    <TextField
                        ref={register}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Имя"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        ref={register}
                        margin="dense"
                        id="race"
                        label="Раса"
                        type="text"
                        fullWidth
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="gender-select-label">Пол</InputLabel>
                        <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            name="gender"
                            ref={register}
                        >
                            <MenuItem value="male">Мужской</MenuItem>
                            <MenuItem value="female">Женский</MenuItem>
                            <MenuItem value="other">Другое</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Отменить
                    </Button>
                    <Button onClick={onClose} color="primary">
                        Создать
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateCharacterDialog