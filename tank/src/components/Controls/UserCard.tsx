import React from 'react'
import { Avatar, Card, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        me: {
            backgroundColor: '#43536B',
            margin: theme.spacing(1),
            width: '100%',
            display: 'flex',
            alightItems: 'center',
            justifyContent: 'center',
            direction: 'column',
            height: theme.spacing(27),
            paddingTop: theme.spacing(2)
        },
        avatarLarge: {
            width: theme.spacing(11),
            height: theme.spacing(11),
        }
    })
)

interface Props {}

const UserCard: React.FC<Props> = () => {
    const classes = useStyles()

    return (
        <Card className={classes.me} raised>
            <Avatar className={classes.avatarLarge}><PersonIcon/></Avatar>
        </Card>
    )
}

export default UserCard