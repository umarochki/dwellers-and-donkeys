import { Container } from '@material-ui/core'
import React, { useCallback } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CardList, { CardItem } from '../../components/Containers/CardList'
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

interface Props {
}

const cards: CardItem[] = [
    { name: 'Орк', date: '20.01.20', image: 'https://source.unsplash.com/random' },
    { name: 'Гномик', date: '20.01.20', image: 'https://source.unsplash.com/random' },
    { name: 'Гномик', date: '20.01.20', image: 'https://source.unsplash.com/random' },
]

const CreatedCharacters: React.FC<Props> = () => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleAddCharacter = useCallback(() => {
        setOpen(true)
    }, [])

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    return (
        <div className={classes.root}>
            <Container className={classes.cardGrid} maxWidth="md">
                <CardList headerText={'Created characters:'} cards={cards} onAddClick={handleAddCharacter}/>
            </Container>
            <CreateCharacterDialog open={open} onClose={handleClose}/>
        </div>
    )
}

export default CreatedCharacters