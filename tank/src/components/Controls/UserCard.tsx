import React from 'react'
import { Avatar, Card, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person'
import { primary200, primary50 } from '../../styles/colors'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        me: {
            backgroundColor: '#43536B',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%',
            paddingTop: theme.spacing(4),
            borderRadius: 0
        },
        avatarLarge: {
            width: theme.spacing(11),
            height: theme.spacing(11),
            marginBottom: theme.spacing(3)
        },
        name: {
            color: primary50,
            fontWeight: 'bold',
            fontSize: '1.2rem',
            marginBottom: theme.spacing(1)
        },
        race: {
            color: primary200,
            marginBottom: theme.spacing(1)
        },
        code: {
            fontSize: '1.5rem',
            color: primary200
        }
    })
)

interface Props {
    code: string
}

const UserCard: React.FC<Props> = props => {
    const classes = useStyles()
    const { code } = props

    return (
        <Card className={classes.me} raised>
            <Avatar className={classes.avatarLarge}><PersonIcon fontSize="large"/></Avatar>
            {/*<span className={classes.name}>Я кто-то там</span>*/}
            <span className={classes.race}>Код приглашения:</span>
            <span className={classes.code}>{code}</span>
        </Card>
    )
}

export default UserCard