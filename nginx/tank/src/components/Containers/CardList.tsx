import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import defaultImage from './default.png'
import { primary200 } from '../../styles/colors'
import AddCard from '../Cards/AddCard'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { selectConnectGameState } from '../../store/game/selectors'
import { connectGameWithRedirect, deleteGame } from '../../store/game/actions'
import { AsyncState } from '../../store/user/reducer'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import { getUrl } from '../../helpers/authHeader'
import { copyTextToClipboard } from '../../helpers/clipBoard'
import { showSuccessNotification } from '../../store/notifications/actions'

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
        cardMedia: {
            paddingTop: '56.25%', // 16:9
            border: `2px solid ${primary200}`
        },
        cardContent: {
            flexGrow: 1,
            paddingBottom: 0,
            paddingTop: 12,
            height: 62
        },
        cardActions: {
            paddingTop: 16
        },
        subtitle: {
            color: '#E9EEFB',
            marginBottom: '20px'
        },
        date: {
            fontSize: '0.9rem',
            width: 250,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        },
        addCard: {
            width: '100%',
            height: '100%'
        }
    })
)

export interface CardItem {
    id: number
    title: string
    image?: string
    description: string
    invitation_code: string
}

interface Props {
    headerText: string
    cards: CardItem[]
    onAddClick: () => void
}

const CardList: React.FC<Props> = props => {
    const { headerText, cards, onAddClick } = props
    const classes = useStyles()
    const dispatch = useDispatch()

    const connected = useSelector(selectConnectGameState)
    const [isLoading, setIsLoading] = useState(false)

    const [idToDelete, setIdToDelete] = useState(0)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleConnect = useCallback((invitation_code: string) => {
        setIsLoading(true)
        dispatch(connectGameWithRedirect(invitation_code))
    }, [dispatch])

    const handleDelete = useCallback((id: number) => {
        dispatch(deleteGame(id))
    }, [dispatch])

    useEffect(() => {
        if (connected === AsyncState.error) {
            setIsLoading(false)
        }
    }, [connected, dispatch])

    return (
        <>
            <Typography component="h3" variant="h5" className={classes.subtitle}>
                {headerText}
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <AddCard className={clsx(classes.card, classes.addCard)} onClick={onAddClick} />
                </Grid>
                {cards.map(card => (
                    <Grid item key={card.id} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                            <CardActionArea className={classes.cardActionArea}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={card.image || defaultImage}
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography color="textSecondary" className={classes.date}>
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.cardActions}>
                                    <Button color="primary" variant="contained" disabled={isLoading} onClick={() => handleConnect(card.invitation_code)}>
                                        Play
                                    </Button>
                                    <Button color="primary" disabled={isLoading} onClick={() => {
                                        setIdToDelete(card.id)
                                        setConfirmOpen(true)
                                    }}>
                                        Delete
                                    </Button>
                                    <Button color="primary" disabled={isLoading} style={{ marginLeft: 'auto' }} onClick={() => {
                                        const url = `${getUrl()}/tabletop/${card.invitation_code}`
                                        copyTextToClipboard(url, () => {
                                            dispatch(showSuccessNotification('Copied'))
                                        })
                                    }}>
                                        Invite
                                    </Button>
                                </CardActions>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <ConfirmDialog
                title="Are you sure you want to delete the game?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={() => handleDelete(idToDelete)}
            />
        </>
    )
}

export default CardList