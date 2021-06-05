import React, { useCallback, useEffect, useState } from 'react'
import { Button, Grid, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import AddCard from './AddCard'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { selectConnectGameState } from '../../store/game/selectors'
import { connectGameWithRedirect, deleteGame } from '../../store/game/actions'
import { AsyncState } from '../../store/user/reducer'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import { getUrl } from '../../helpers/url'
import { copyTextToClipboard } from '../../helpers/clipBoard'
import { showSuccessNotification } from '../../store/notifications/actions'
import MapCard from './MapCard'
import { Game } from '../../models/game'

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            minHeight: 277,
            display: 'flex',
            flexDirection: 'column',
        },
        subtitle: {
            color: '#E9EEFB',
            marginBottom: '20px'
        },
        addCard: {
            width: '100%',
            height: '100%'
        }
    })
)

interface Props {
    headerText: string
    cards: Game[]
    onAddClick: () => void
    showAddCard?: boolean
}

const CardList: React.FC<Props> = props => {
    const { headerText, cards, onAddClick, showAddCard = false } = props
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

    const handleInvite = useCallback((card: Game) => () => {
        const url = `${getUrl()}/tabletop/${card.invitation_code}`
        copyTextToClipboard(url, () => {
            dispatch(showSuccessNotification('Copied'))
        })
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
                {showAddCard && <Grid item xs={12} sm={6} md={4}>
                    <AddCard className={clsx(classes.card, classes.addCard)} onClick={onAddClick}/>
                </Grid>}
                {cards.map(card => (
                    <Grid item key={card.id} xs={12} sm={6} md={4}>
                        <MapCard
                            card={card}
                            cardActions={<>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    disabled={isLoading}
                                    onClick={() => handleConnect(card.invitation_code)}>
                                    Play
                                </Button>
                                <Button
                                    color="primary"
                                    disabled={isLoading}
                                    onClick={() => {
                                        setIdToDelete(card.id)
                                        setConfirmOpen(true)
                                    }}>
                                    Delete
                                </Button>
                                <Button
                                    color="primary"
                                    disabled={isLoading}
                                    style={{ marginLeft: 'auto' }}
                                    onClick={handleInvite(card)}>
                                    Invite
                                </Button>
                            </>}/>
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