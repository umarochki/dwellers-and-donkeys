import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import CharacterGallery from '../Containers/CharacterGallery'
import { Hero } from '../../models/hero'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex'
        }
    })
)

interface Props {
    open: boolean
    onChoose: (hero: Hero) => void
}

const ChooseCharacterDialog: React.FC<Props> = props => {
    const { open, onChoose } = props
    const classes = useStyles()

    return (
        <Dialog open={open}>
            <DialogTitle>
                Choose character for the game
            </DialogTitle>
            <DialogContent className={classes.root}>
                <CharacterGallery
                    onChoose={(hero: Hero) => {
                        onChoose(hero)
                    }}
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