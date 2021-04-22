import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CardList from '../../components/Containers/CardList'
import { Container } from '@material-ui/core'
import { Game } from '../../models/game'

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
    games: Game[]
}

const CreatedGameWorlds: React.FC<Props> = props => {
    const { openWorldDialog, title, games } = props
    const classes = useStyles()

    const cards = games.map(g => ({
        id: g.id || 0,
        title: g.name || '',
        description: g.description || '',
        invitation_code: g.invitation_code || ''
    }))

    return (
        <Container className={classes.cardGrid} maxWidth="md">
            <CardList headerText={title} cards={cards} onAddClick={openWorldDialog}/>
        </Container>
    )
}

export default CreatedGameWorlds