import React from 'react'
import { GameDataMessage } from '../../../models/game'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import RollResult from './RollResult'
import { MessageContent } from './MessageContent'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chatMessage: {
            minHeight: 30,
            marginBottom: theme.spacing(2),
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
        },
        messageHeader: {
            width: '100%'
        },
        messageText: {
            'overflow-wrap': 'anywhere',
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
        },
        messageTime: {
            fontStyle: 'italic',
            marginLeft: theme.spacing(1)
        },
        messageSender: {
            fontWeight: 'bold',
            marginLeft: theme.spacing(1)
        }
    })
)


interface MessageProps {
    message: GameDataMessage
}

const ChatMessage: React.FC<MessageProps> = props => {
    const classes = useStyles()
    const { message } = props

    const date = new Date(message.time)
    const h = date.getHours()
    const min = date.getMinutes()

    const time = `${h > 9 ? h : '0' + h}:${min > 9 ? min : '0' + min}`

    if (message.type === 'roll') {
        return (
            <div className={classes.chatMessage}>
                <div className={classes.messageHeader}>
                    <span className={classes.messageSender}>{message.sender}</span>
                    <span className={classes.messageTime}>{time}</span>
                </div>
                <MessageContent>
                    <RollResult dices={message.rolls} total={message.total}/>
                </MessageContent>
            </div>
        )
    }

    return (
        <div className={classes.chatMessage}>
            <div className={classes.messageHeader}>
                <span className={classes.messageSender}>{message.sender}</span>
                <span className={classes.messageTime}>{time}</span>
            </div>
            <span className={classes.messageText}>{message.message}</span>
        </div>
    )
}

export default ChatMessage