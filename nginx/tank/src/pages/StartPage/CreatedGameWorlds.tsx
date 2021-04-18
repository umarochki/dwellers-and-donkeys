import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CardList, { CardItem } from '../../components/Containers/CardList'
import { Container } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardGrid: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        }
    })
)

interface Props {
    openWorldDialog: () => void
}

const cards: CardItem[] = [
    { title: 'Шахты', date: '20.01.20', image: '' },
    { title: 'Шахты', date: '20.01.22', image: '' },
]

const CreatedGameWorlds: React.FC<Props> = props => {
    const { openWorldDialog } = props
    const classes = useStyles()

    return (
        <Container className={classes.cardGrid} maxWidth="md">
            <CardList headerText={'Created game worlds:'} cards={cards} onAddClick={openWorldDialog}/>
        </Container>
    )
}

export default CreatedGameWorlds