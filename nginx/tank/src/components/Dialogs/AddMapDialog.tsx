import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import GameGallery from '../../pages/GameCreationPage/GameGallery'

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
    onClose: () => void
    onChoose: (id: string) => void
    maps: string[]
}

const AddMapDialog: React.FC<Props> = props => {
    const { open, maps, onChoose, onClose } = props
    const classes = useStyles()

    return (
        <Dialog open={open}>
            <IconButton onClick={onClose} className={classes.closeButton}>
                <CloseIcon />
            </IconButton>
            <DialogTitle>
                Choose map
            </DialogTitle>
            <DialogContent>
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