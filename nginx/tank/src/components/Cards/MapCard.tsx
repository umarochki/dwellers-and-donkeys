import React, { ReactNode } from 'react'
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary200 } from '../../styles/colors'
import defaultImage from '../../assets/default.png'
import { Game } from '../../models/game'
import clsx from 'clsx'

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            minHeight: 277,
            display: 'flex',
            flexDirection: 'column',
        },
        cardActionArea: {
            height: '100%'
        },
        cardContent: {
            flexGrow: 1,
            paddingBottom: 0,
            paddingTop: 12,
            height: 62
        },
        cardMedia: {
            paddingTop: '56.25%', // 16:9
            border: `2px solid ${primary200}`
        },
        cardActions: {
            paddingTop: 16
        },
        date: {
            fontSize: '0.9rem',
            width: 250,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        }
    })
)

interface Props {
    className?: string
    cardActions?: ReactNode
    card: Game
}

const MapCard: React.FC<Props> = props => {
    const classes = useStyles()
    const { cardActions, card, className } = props

    return (
        <Card className={clsx(classes.card, className)}>
            <CardActionArea className={classes.cardActionArea}>
                <CardMedia
                    className={classes.cardMedia}
                    image={card.preview || defaultImage}
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom>
                        {card.name}
                    </Typography>
                    <Typography color="textSecondary" className={classes.date}>
                        {card.description}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    {cardActions}
                </CardActions>
            </CardActionArea>
        </Card>
    )
}

export default MapCard