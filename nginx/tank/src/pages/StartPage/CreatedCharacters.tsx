import { Container } from '@material-ui/core'
import React, { useCallback } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CreateCharacterDialog from '../../components/Dialogs/CreateCharacterDialog'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#1A1A21',
            marginTop: '-6px'
        },
        cardGrid: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(8),
        }
    })
)

interface Props {}

const CreatedCharacters: React.FC<Props> = () => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    return (
        <div className={classes.root}>
            <Container className={classes.cardGrid} maxWidth="md">
                {/*<CardList headerText={'Created characters:'} cards={cards} onAddClick={handleAddCharacter}/>*/}
            </Container>
            <CreateCharacterDialog open={open} onClose={handleClose}/>
        </div>
    )
}

export default CreatedCharacters