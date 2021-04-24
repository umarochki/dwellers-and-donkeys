import React, { FormEvent, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import GameGallery from '../../pages/GameCreationPage/GameGallery'
import { DropzoneArea } from 'material-ui-dropzone'
import { primary200 } from '../../styles/colors'
import mapService from '../../services/map'
import { Map, MapFile } from '../../models/map'
import { useDispatch } from 'react-redux'
import { addMap } from '../../store/map/actions'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            minWidth: 600,
            minHeight: 450
        },
        closeButton: {
            position: 'absolute',
            right: '6px',
            top: '4px'
        },
        uploadMap: {
            height: 270,
            '& > *': {
                backgroundColor: primary200
            }
        },
        mapForm: {
            marginBottom: 20,
            display: 'flex',
            alignItems: 'flex-end',
            paddingLeft: 20
        },
        mapName: {
            width: '70%',
            marginRight: 30
        }
    })
)

interface Props {
    open: boolean
    onClose: () => void
    onChoose: (id: string) => void
    maps: Map[]
}

const AddMapDialog: React.FC<Props> = props => {
    const { open, maps, onChoose, onClose } = props
    const classes = useStyles()
    const dispatch = useDispatch()
    const [files, setFiles] = useState<File[]>([])
    const [name, setName] = useState('')

    const handleUploadMap = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (files.length) {
            const formData = new FormData()
            formData.append('file', files[0])
            formData.append('type', 'map')
            formData.append('name', name)

            mapService
                .uploadMedia(formData)
                .then((result: MapFile) => {
                    dispatch(addMap(result, () => {
                        onChoose(result.hash)
                        onClose()
                    }))
                })
                .catch(error => console.log('Failed to add map. Error:', error))
        }
    }

    return (
        <Dialog open={open} className={classes.closeButton}>
            <IconButton onClick={onClose} className={classes.closeButton}>
                <CloseIcon />
            </IconButton>
            <DialogTitle>
                Choose map
            </DialogTitle>
            <DialogContent>
                <div className={classes.uploadMap}>
                    <DropzoneArea
                        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                        onChange={(files: File[]) => setFiles(files)}
                        showAlerts={false}
                        filesLimit={1}
                        showPreviewsInDropzone={true}
                    />
                </div>
                {!!files.length &&
                    <form className={classes.mapForm} autoComplete="off" onSubmit={handleUploadMap}>
                        <TextField
                            className={classes.mapName}
                            id="map-name"
                            label="Map name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <Button type="submit" color="primary">Create Map</Button>
                    </form>
                }
                <GameGallery
                    onChoose={(id: string) => {
                        if (id) {
                            onClose()
                            onChoose(id)
                        }
                    }}
                    maps={maps}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddMapDialog