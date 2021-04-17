import React from 'react'
import { ConnectedUser } from '../../../models/user'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        user: {

        }
    })
)

interface Props {
    users: ConnectedUser[]
}

const UserList: React.FC<Props> = ({ users }) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            { users.map(u => <div key={u.id} className={classes.user}>{u.username}</div>) }
        </div>
    )
}

export default UserList