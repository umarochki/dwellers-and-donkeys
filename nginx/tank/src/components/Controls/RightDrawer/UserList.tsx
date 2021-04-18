import React from 'react'
import { ConnectedUser } from '../../../models/user'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Card } from '@material-ui/core'
import { primary200, primary50 } from '../../../styles/colors'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: 5,
            textAlign: 'center'
        },
        title: {
            color: primary50,
            padding: 10
        },
        user: {
            backgroundColor: primary200,
            padding: '5px 10px',
            marginBottom: 10,
            '&:hover': {
                boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
            }
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
            <div className={classes.title}>Current players:</div>
            { users.map(u => <Card key={u.id} className={classes.user}>{u.username}</Card>) }
        </div>
    )
}

export default UserList