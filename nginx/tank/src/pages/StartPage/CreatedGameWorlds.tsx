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
    title: string
    cards: CardItem[]
}

const CreatedGameWorlds: React.FC<Props> = props => {
    const { openWorldDialog, title, cards } = props
    const classes = useStyles()

    return (
        <Container className={classes.cardGrid} maxWidth="md">
            <CardList headerText={title} cards={cards} onAddClick={openWorldDialog}/>
        </Container>
    )
}

export default CreatedGameWorlds