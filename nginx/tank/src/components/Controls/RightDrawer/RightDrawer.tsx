import React from 'react'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import UserCard from '../UserCard'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { GameDataMessage } from '../../../models/game'
import { ConnectedUser } from '../../../models/user'
import UserList from './UserList'
import { primary200, primary900 } from '../../../styles/colors'

const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        drawerInner: {

        },
        drawerPaper: {
            position: 'relative',
            height: '100%',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            backgroundColor: '#43536B',
            color: '#FFF',
            overflow: 'hidden'
        },
        drawerPaperLight: {
            borderRight: `4px solid ${primary900}`,
            backgroundColor: primary200,
        },
        drawerPaperClose: {
            width: 60,
            overflowX: 'hidden',
            // Drawer - closing
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
                // duration: 2000
            })
        }
    })
)

interface Props {
    messages: GameDataMessage[]
    invitation_code: string
    users: ConnectedUser[]
}

const RightDrawer: React.FC<Props> = props => {
    const classes = useStyles()
    const { users, invitation_code } = props

    const [open, setOpen] = React.useState(false)

    return (
        <Drawer
            anchor="right"
            variant="permanent"
            className={classes.root}
            classes={{
                paper: clsx(
                    classes.drawerPaper,
                    // type !== MenuType.locations && classes.drawerPaperLight,
                    // !open && classes.drawerPaperClose
                )
            }}
            open={open}
            onClose={() => setOpen(false)}
        >
            <div className={classes.drawerInner}>
                <UserCard code={invitation_code} />
                <UserList users={users} />

            </div>
        </Drawer>
    )
}

export default RightDrawer