import React from 'react'
import { Card, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary900 } from '../../styles/colors'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: theme.spacing(27),
            margin: theme.spacing(1),

            backgroundColor: primary900,
            '&:hover': {
                // boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
            }
        },
        avatarLarge: {
            width: theme.spacing(11),
            height: theme.spacing(11),
        },
        avatarDark: {
        }
    })
)

interface Props {}

const ChatPanel: React.FC<Props> = () => {
    const classes = useStyles()

    return (
        <Card className={classes.root}>

        </Card>
    )
}

export default ChatPanel