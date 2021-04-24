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
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addHero } from '../../store/hero/actions'
import { Hero } from '../../models/hero'
import { heroes } from '../Switcher/LeftDrawer'
import { getUrl } from '../../helpers/authHeader'

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
    onClose: () => void
}

const CharacterInfoDialog: React.FC<Props> = props => {
    const classes = useStyles()
    const { open, onClose } = props

    const methods = useForm()
    const { control, handleSubmit, watch } = methods
    const watchSprite = watch('sprite')

    const dispatch = useDispatch()

    const onSubmit = (data: Hero) => {
        dispatch(addHero({ ...data, sprite: `${getUrl()}/heroes/${data.sprite}.png` }))
        onClose()
    }

    return (
        <Dialog open={open} className={classes.root}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IconButton onClick={onClose} className={classes.closeButton}>
                        <CloseIcon />
                    </IconButton>
                    <DialogTitle>
                        Game character
                    </DialogTitle>
                    <DialogContent className={classes.content}>
                        <div className={classes.contentLeft}>
                            <Avatar className={classes.avatarLarge} src={`/heroes/${watchSprite || heroes[0]}.png`}/>
                        </div>
                        <div className={classes.contentRight}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                margin="dense"
                                label="Name"
                                fullWidth
                                as={TextField}
                                required
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel id="gender-select-label">Appearance</InputLabel>
                                <Controller
                                    defaultValue={heroes[0]}
                                    control={control}
                                    name="sprite"
                                    as={
                                        <Select id="gender-select">
                                            {heroes.map(h => (
                                                <MenuItem key={h} value={h}>{h}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                />
                            </FormControl>
                            <Controller
                                name="race"
                                control={control}
                                defaultValue=""
                                margin="dense"
                                label="Race"
                                fullWidth
                                as={TextField}
                            />
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                margin="dense"
                                label="Description"
                                fullWidth
                                multiline
                                rows={5}
                                as={TextField}
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel id="gender-select-label">Gender</InputLabel>
                                <Controller
                                    defaultValue="male"
                                    control={control}
                                    name="sex"
                                    as={
                                        <Select id="gender-select">
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                            <MenuItem value="TREBUSHET">Trebuchet</MenuItem>
                                        </Select>
                                    }
                                />
                            </FormControl>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            autoFocus
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    )
}

export default CharacterInfoDialog