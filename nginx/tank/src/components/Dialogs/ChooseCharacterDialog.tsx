import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import CharacterGallery from '../Containers/CharacterGallery'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex'
        }
    })
)

interface Props {
    open: boolean
    onClose: () => void
    onChoose: (id: string) => void
    characters: string[]
}

const ChooseCharacterDialog: React.FC<Props> = props => {
    const { open, characters, onChoose, onClose } = props
    const classes = useStyles()

    return (
        <Dialog open={open}>
            <DialogTitle>
                Choose character for the game
            </DialogTitle>
            <DialogContent className={classes.root}>
                <CharacterGallery
                    onChoose={(id: string) => {
                        if (id) {
                            onClose()
                            onChoose(id)
                        }
                    }}
                    characters={characters}
                />
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
        </Dialog>
    )
}

export default ChooseCharacterDialog