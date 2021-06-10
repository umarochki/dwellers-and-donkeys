import React from 'react'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import UserCard from '../User/UserCard'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { ConnectedUser } from '../../../models/user'
import UserList from './UserList'
import { primary200, primary50, primary600, primary700, primary800, primary900 } from '../../../styles/colors'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ChatPanel from '../ChatPanel/ChatPanel'
import AppsIcon from '@material-ui/icons/Apps'
import { Hero } from '../../../models/hero'
import { ChatMessagePayload } from '../../../models/chat'

const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            overflowX: 'visible'
        },
        drawerInner: {
            transition: 'opacity .5s',
            overflowY: 'auto'
        },
        drawerInnerHidden: {
            opacity: 0
        },
        drawerPaper: {
            position: 'absolute',
            height: '100%',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            backgroundColor: '#43536B',
            color: '#FFF',
            overflow: 'visible'
        },
        drawerPaperLight: {
            borderRight: `4px solid ${primary900}`,
            backgroundColor: primary200,
        },
        drawerPaperClose: {
            width: 0,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: 500
            })
        },
        drawerBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            borderRadius: '10px 0 0 10px',
            left: -35,
            width: 35,
            height: 60,
            border: `solid 2px ${primary600}`,
            borderRight: 'none'
        },
        closeButton: {
            backgroundColor: primary700,
            top: 10
        },
        closeIcon: {
            marginLeft: 10,
            transition: 'transform .5s ease',
            color: primary50
        },
        closeIconClosed: {
            transform: 'rotateY(180deg)',
            marginLeft: -10
        },
        switchGridBtn: {
            top: 80,
            backgroundColor: primary800
        },
        switchGridIcon: {
            color: primary200
        }
    })
)

interface Props {
    messages: ChatMessagePayload[]
    invitation_code: string
    users: ConnectedUser[]
    onSwitchGrid: () => void
    hero?: Hero
    gameBoard: any
    isGM: boolean
}

const RightDrawer: React.FC<Props> = props => {
    const classes = useStyles()
    const { messages, users, invitation_code, onSwitchGrid, hero, gameBoard, isGM } = props

    const [open, setOpen] = React.useState(true)

    return (
        <Drawer
            anchor="right"
            variant="permanent"
            className={classes.root}
            classes={{
                paper: clsx(
                    classes.drawerPaper,
                    !open && classes.drawerPaperClose
                )
            }}
            open={open}
            onClose={() => setOpen(false)}
        >
            <div className={clsx(classes.closeButton, classes.drawerBtn)} onClick={() => setOpen(isOpen => !isOpen)}>
                <ArrowBackIosIcon className={clsx(classes.closeIcon, !open && classes.closeIconClosed)} />
            </div>
            <div className={clsx(classes.switchGridBtn, classes.drawerBtn)} onClick={onSwitchGrid}>
                <AppsIcon className={classes.switchGridIcon}/>
            </div>
            <div className={clsx(classes.drawerInner, !open && classes.drawerInnerHidden)}>
                <UserCard code={invitation_code} hero={hero} gameBoard={gameBoard} isGM={isGM} />
                <ChatPanel data={messages}/>
                <UserList users={users} />
            </div>
        </Drawer>
    )
}

export default RightDrawer