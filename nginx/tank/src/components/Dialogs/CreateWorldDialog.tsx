import React, { ChangeEvent, useState } from 'react'
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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { createGame } from '../../store/game/actions'
import { useDispatch } from 'react-redux'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { DropzoneArea } from 'material-ui-dropzone'
import { MapFile } from '../../models/map'
import { handleUploadMap } from '../../helpers/uploadMedia'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        uploadMap: {
            marginTop: 10,
            '& > *': {
                minHeight: 170
            }
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

const CreateWorldDialog: React.FC<Props> = props => {
    const classes = useStyles()
    const { open, onClose } = props
    const dispatch = useDispatch()
    const { register } = useForm()

    const [isLoading, setIsLoading] = useState(false)

    const [nameValue, setNameValue] = useState('')
    const [descValue, setDescValue] = useState('')
    const [isPrivate, setIsPrivate] = useState(true)
    const [files, setFiles] = useState<File[]>([])

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <form>
                <DialogTitle id="form-dialog-title">Create game</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        ref={register}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        ref={register}
                        margin="dense"
                        id="desc"
                        label="Description"
                        type="text"
                        value={descValue}
                        onChange={e => setDescValue(e.target.value)}
                        fullWidth
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    name="is_private"
                                    checked={isPrivate}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setIsPrivate(e.target.checked)}
                                />
                            }
                            label="Private"
                        />
                    </FormGroup>
                    <div className={classes.uploadMap}>
                        <DropzoneArea
                            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp', 'image/gif']}
                            onChange={(files: File[]) => setFiles(files)}
                            showAlerts={false}
                            filesLimit={1}
                            showPreviewsInDropzone={true}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    {isLoading
                        ? (<CircularProgress size={26}/>)
                        : <>
                            <Button onClick={onClose} color="primary">
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                disabled={nameValue.length === 0}
                                onClick={() => {
                                    setIsLoading(true)

                                    handleUploadMap(nameValue, files, (result?: MapFile) => {
                                        dispatch(createGame(nameValue, descValue, isPrivate, result && result.file))
                                    })
                                }}>
                                Create
                            </Button>
                        </>}
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateWorldDialog