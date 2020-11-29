import { Button, createStyles, Grid, makeStyles, Paper } from '@material-ui/core'
import React from 'react'
import { Game } from '../../models/game'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: '#f9f9f9',
            padding: '15px'
        }
    }),
)

interface Props {
    onSubmit: Function
    onCancel: Function
    game: Game
}

const GameInfoSubmit: React.FC<Props> = props => {
    const { game } =  props
    const classes = useStyles()

    return (
        <Paper className={classes.root}>
            {game.title}
            <Grid container justify="flex-end">
                <Button variant="contained" color="primary">
                    Создать
                </Button>
            </Grid>
        </Paper>
    )
}

export default GameInfoSubmit