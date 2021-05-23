import React from 'react'
import clsx from 'clsx'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { Grid } from '@material-ui/core'
import PersonCard from '../User/PersonCard'
import UserCard from '../User/UserCard'
import ChatPanel from '../ChatPanel/ChatPanel'
import { Game } from '../../../models/game'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { ConnectedUser } from '../../../models/user'
import { ChatMessagePayload } from '../../../models/chat'
import { Hero } from '../../../models/hero'
import { primary50, primary600, primary800 } from '../../../styles/colors'

const useStyles = makeStyles(theme =>
    createStyles({
        controls: {
            position: 'absolute',
            width: 'calc(100% - 86px)',
            bottom: 16,
            height: '30%',
            backgroundColor: '#334055',
            display: 'flex',
            transition: 'bottom .5s cubic-bezier(0.820, 0.085, 0.395, 0.895)'
        },
        hideControls: {
            bottom: 'calc(-30% - 16px)'
        },
        drawerBtnClosed: {
            top: -52
        },
        controlPanel: {
            maxHeight: '100%'
        },
        people: {
            display: 'flex',
            height: '100%',
            padding: theme.spacing(1),
            marginRight: theme.spacing(1),
            '& > *': {
                cursor: 'pointer',
                backgroundColor: '#43536B',
                width: theme.spacing(20),
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                paddingTop: theme.spacing(2),
                marginRight: theme.spacing(2)
            },
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        },
        closeIcon: {
            transform: 'rotate(270deg)',
            marginTop: 0,
            marginBottom: 10,
            transition: 'transform .5s ease',
            color: primary50
        },
        closeIconClosed: {
            transform: 'rotate(90deg)',
            marginTop: 20
        },
        closeButton: {
            backgroundColor: primary800
        },
        drawerBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            borderRadius: '10px 10px 0 0',
            top: -35,
            width: 60,
            height: 35,
            border: `solid 2px ${primary600}`,
            borderBottom: 'none'
        }
    })
)

interface Props {
    showControls: boolean
    onToggle: () => void
    game?: Game
    users: ConnectedUser[]
    messages: ChatMessagePayload[]
    hero?: Hero
}

const BottomControlPanel: React.FC<Props> = props => {
    const classes = useStyles()
    const { game, showControls, onToggle, users, messages, hero } = props

    return (
        <div className={clsx(classes.controls, !showControls && classes.hideControls)}>
            <div className={clsx(classes.closeButton, classes.drawerBtn, !showControls && classes.drawerBtnClosed)} onClick={onToggle}>
                <ArrowBackIosIcon className={clsx(classes.closeIcon, !showControls && classes.closeIconClosed)} />
            </div>
            <Grid container>
                <Grid item xs={5} className={classes.controlPanel}>
                    <div className={classes.people}>
                        {users.map(user => <PersonCard user={user.username} key={user.username}/>)}
                    </div>
                </Grid>
                <Grid item xs={2} className={classes.controlPanel}>
                    <UserCard code={game ? game.invitation_code || '' : ''} hero={hero}/>
                </Grid>
                <Grid item xs={5} className={classes.controlPanel}>
                    <ChatPanel data={messages}/>
                </Grid>
            </Grid>
        </div>
    )
}

export default BottomControlPanel