import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Grid, IconButton, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary200, primary50, primary800, primary900 } from '../../styles/colors'
import { ReactComponent as D4 } from '../../assets/dices/d4.svg'
import { ReactComponent as D6 } from '../../assets/dices/d6.svg'
import { ReactComponent as D8 } from '../../assets/dices/d8.svg'
import { ReactComponent as D10 } from '../../assets/dices/d10.svg'
import { ReactComponent as D12 } from '../../assets/dices/d12.svg'
import { ReactComponent as D20 } from '../../assets/dices/d20.svg'
import ClearIcon from '@material-ui/icons/Clear'
import { WebSocketContext } from '../Contexts/WebSocketContext'
import { useSelector } from 'react-redux'
import { selectConnectGameState } from '../../store/game/selectors'
import { AsyncState } from '../../store/user/reducer'
import { GameDataMessage } from '../../models/game'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            height: '100%'
        },
        content: {
            backgroundColor: primary900,
            display: 'flex',
            height: '100%'
        },
        chat: {
            padding: theme.spacing(1),
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            color: primary200,
            maxHeight: '100%'
        },
        chatInput: {
            padding: theme.spacing(1),
            backgroundColor: primary800,
            height: 50,
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center'
        },
        chatInputText: {
            flex: 1,
            border: 'none',
            fontSize: '1rem',
            color: primary50,
            backgroundColor: 'transparent',
            letterSpacing: '0.07em',
            '&:focus': {
                outline: 'none'
            }
        },
        rolls: {
            padding: theme.spacing(1),
            width: 250,
            minWidth: 250,
            height: '100%'
        },
        roll: {
            width: 60,
            height: 60,
            color: primary200,
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: primary800
            }
        },
        dice: {
            display: 'flex',
            alignItems: 'center',
            marginRight: theme.spacing(1)
        },
        chatContent: {
            flexGrow: 1,
            overflow: 'auto',
            marginBottom: '8px',
            overflowY: 'scroll'
        },
        messageHeader: {
            width: '100%'
        },
        chatMessage: {
            minHeight: 30,
            marginBottom: theme.spacing(2),
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
        },
        chatInputBtn: {
            marginLeft: 'auto',
            color: primary200,
        },
        miniDices: {
            width: 0,
            display: 'flex',
            '-ms-overflow-style': 'none',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
                display: 'none'
            }
        },
        diceSquare: {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            minWidth: 30,
            height: 30,
            border: `2px solid ${primary200}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1rem'
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

interface Dice {
    type: string
    count: number
}

const MiniDice: React.FC<Dice> = props => {
    const classes = useStyles()
    const { type, count } = props

    if (!count) {
        return null
    }

    return (
        <span className={classes.dice}>
            <span className={classes.diceSquare}>{type}</span>x{count}
        </span>
    )
}

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
                <span className={classes.diceSquare}>{message.total}</span>
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

enum InputType {
    text,
    dices
}

interface Props {
    data: GameDataMessage[]
}

const ChatPanel: React.FC<Props> = props => {
    const { data } = props
    const classes = useStyles()
    const ws = useContext(WebSocketContext)
    const connectGameState = useSelector(selectConnectGameState)

    const [chatInput, setChatInput] = useState('')
    const [inputType, setInputType] = useState(InputType.text)
    const messagesEnd = useRef(null)

    const emptyDices = useMemo(() => ['4', '6', '8', '10', '12', '20'].map(type => ({ type: type, count: 0 })), [])
    const [dices, setDices] = useState<Dice[]>(emptyDices)
    const isEmpty = useMemo(() => !dices.some(dice => dice.count > 0), [dices])

    const addDice = useCallback((type: string) => () => {
        if (inputType !== InputType.dices) {
            setInputType(InputType.dices)
            setChatInput('')
        }
        setDices(prev => prev.map(dice => dice.type === type
            ? { count: dice.count + 1, type }
            : dice
        ))
    }, [inputType])

    const roll = useCallback(() => {
        if (ws && connectGameState === AsyncState.success) {
            ws.sendMessage('roll', dices.reduce((obj: any, dice) => {
                obj[`d${dice.type}`] = dice.count
                return obj
            }, {}))
            setDices(emptyDices)
            setInputType(InputType.text)
        }
    }, [ws, connectGameState, dices, emptyDices])

    const handleChatInputChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        if (inputType === InputType.text && e.currentTarget.value.length <= 250) setChatInput(e.currentTarget.value)
    }, [inputType])

    const sendMessage = useCallback(() => {
        if (ws.init && connectGameState === AsyncState.success && chatInput) {
            ws.sendMessage('chat', chatInput)
            setChatInput('')
        }
    }, [ws, connectGameState, chatInput])

    const handleClear = useCallback(() => {
        if (inputType === InputType.text) {
            setChatInput('')
        } else {
            setInputType(InputType.text)
            setDices(emptyDices)
        }
    }, [inputType, emptyDices])

    const handleKeyPress = useCallback(event => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }, [sendMessage])

    // scroll chat
    const scrollToBottom = useCallback(() => {
        if (messagesEnd && messagesEnd.current) {
            messagesEnd.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
        }
    }, [messagesEnd])

    useEffect(() => {
        scrollToBottom()
    }, [scrollToBottom, messagesEnd, data])

    return (
        <div className={classes.root}>
            <Card className={classes.content}>
                <div className={classes.chat}>
                    <div className={classes.chatContent}>
                        {data.map(item => <ChatMessage key={item.time} message={item}/>)}
                        <div ref={messagesEnd} style={{ height: 1 }}/>
                    </div>
                    <div className={classes.chatInput}>
                        {inputType === InputType.dices
                            ? <div className={classes.miniDices}>{dices.map(dice => <MiniDice key={dice.type} {...dice} />)}</div>
                            : <input className={classes.chatInputText} value={chatInput} onChange={handleChatInputChange} onKeyPress={handleKeyPress}/>}
                        <IconButton className={classes.chatInputBtn} disabled={isEmpty} onClick={handleClear}>
                            <ClearIcon fontSize="inherit" />
                        </IconButton>
                    </div>
                </div>
                <Grid container className={classes.rolls}>
                    <Grid container item xs={12} justify="space-between">
                        <D4 className={classes.roll} onClick={addDice('4')}/>
                        <D6 className={classes.roll} onClick={addDice('6')}/>
                        <D8 className={classes.roll} onClick={addDice('8')}/>
                    </Grid>
                    <Grid container item xs={12} justify="space-between">
                        <D10 className={classes.roll} onClick={addDice('10')}/>
                        <D12 className={classes.roll} onClick={addDice('12')}/>
                        <D20 className={classes.roll} onClick={addDice('20')}/>
                    </Grid>
                    <Grid container item xs={12} style={{ marginTop: 'auto', height: 50 }}>
                        {inputType === InputType.dices
                            ? <Button color="secondary" disabled={isEmpty} onClick={roll}>Кинуть</Button>
                            : <Button color="secondary" disabled={!chatInput} onClick={sendMessage}>Отправить</Button>}
                    </Grid>
                </Grid>
            </Card>
        </div>
    )
}

export default ChatPanel