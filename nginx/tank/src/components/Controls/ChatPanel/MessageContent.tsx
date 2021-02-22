import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        messageContent: {
            padding: '.4em 1em 0 .3em',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'hidden'
        }
    })
)

export const MessageContent: React.FC = ({ children }) => {
    const classes = useStyles()

    return (
        <div className={classes.messageContent}>{children}</div>
    )
}
