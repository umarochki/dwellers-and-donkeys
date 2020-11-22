import { Container } from '@material-ui/core'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CardList, { CardItem } from '../../components/Containers/CardList'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardGrid: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        }
    })
)

interface Props {}

const cards: CardItem[] = [
    { title: 'Шахты', date: '20.01.20', image: 'https://source.unsplash.com/random' },
    { title: 'Шахты', date: '20.01.20', image: 'https://source.unsplash.com/random' },
]

const CreatedGameWorlds: React.FC<Props> = props => {
    const classes = useStyles()
    const history = useHistory()
    const handleNewGameWorld = useCallback(() => history.push('tabletop'), [history])

    return (
        <Container className={classes.cardGrid} maxWidth="md">
            <CardList headerText={'Созданные игровые миры:'} cards={cards} onAddClick={handleNewGameWorld}/>
        </Container>
    )
}

export default CreatedGameWorlds