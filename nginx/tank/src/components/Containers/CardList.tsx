import React from 'react'
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@material-ui/core'
import AddCard from '../Cards/AddCard'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        cardMedia: {
            paddingTop: '56.25%', // 16:9
        },
        cardContent: {
            flexGrow: 1,
        },
        subtitle: {
            color: '#E9EEFB',
            marginBottom: '20px'
        },
        date: {
            fontSize: '0.9rem'
        }
    })
)

export interface CardItem {
    title: string
    image: string,
    date: string
}

interface Props {
    headerText: string
    cards: CardItem[]
    onAddClick: () => void
}

const CardList: React.FC<Props> = props => {
    const { headerText, cards, onAddClick } = props
    const classes = useStyles()

    return (
        <>
            <Typography component="h3" variant="h5" className={classes.subtitle}>
                {headerText}
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <AddCard className={classes.card} onClick={onAddClick}/>
                </Grid>
                {cards.map(card => (
                    <Grid item key={card.title} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={card.image}
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.date}>
                                        {card.date}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Grid container justify="space-between">
                                        <Button color="primary" variant="text">
                                            Edit
                                        </Button>
                                        <Button color="primary" variant="contained">
                                            Play
                                        </Button>
                                    </Grid>
                                </CardActions>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default CardList