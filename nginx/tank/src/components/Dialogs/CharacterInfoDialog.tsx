import React from 'react'
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Theme
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useForm } from 'react-hook-form'
import PersonIcon from '@material-ui/icons/Person'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        closeButton: {
            position: 'absolute',
            right: '6px',
            top: '4px'
        },
        formControl: {
            marginTop: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        content: {
            display: 'flex',
        },
        contentLeft: {
            flex: '1 50px',
            display: 'flex',
            justifyContent: 'center'
        },
        contentRight: {
            flex: 2
        },
        avatarLarge: {
            width: theme.spacing(12),
            height: theme.spacing(12),
            marginTop: theme.spacing(4),
            cursor: 'pointer'
        }
    })
)

interface Props {
    open: boolean
    // user: string
    onClose: () => void
}

const CharacterInfoDialog: React.FC<Props> = props => {
    const classes = useStyles()
    const { open, onClose } = props
    const { register } = useForm()

    const handleChooseAvatar = () => {

    }

    return (
        <Dialog open={open} className={classes.root}>
            <IconButton onClick={onClose} className={classes.closeButton}>
                <CloseIcon />
            </IconButton>
            <DialogTitle>
                Game character
            </DialogTitle>
            <DialogContent className={classes.content}>
                <div className={classes.contentLeft}>
                    <Avatar className={classes.avatarLarge} onClick={handleChooseAvatar}>
                        <PersonIcon fontSize="large"/>
                    </Avatar>
                </div>
                <div className={classes.contentRight}>
                    <TextField
                        ref={register}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        ref={register}
                        margin="dense"
                        id="race"
                        label="Race"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        ref={register}
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        multiline
                        fullWidth
                        rows={5}
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="gender-select-label">Gender</InputLabel>
                        <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            name="gender"
                            ref={register}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onClose}
                    color="primary"
                    autoFocus
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CharacterInfoDialog