import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Grid, IconButton, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary200, primary400, primary50, primary800, primary900 } from '../../styles/colors'
import ClearIcon from '@material-ui/icons/Clear'
import { WebSocketContext } from '../Contexts/WebSocketContext'
import { useSelector } from 'react-redux'
import { selectConnectGameState } from '../../store/game/selectors'
import { AsyncState } from '../../store/user/reducer'
import { GameDataMessage } from '../../models/game'
import ChatMessage from './ChatPanel/ChatMessage'
import MiniDiceWithCount, { DiceWithCount } from './ChatPanel/MiniDiceWithCount'
import Dice from '../common/Dice'

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
        rollType: {
            color: 'white',
            textShadow: '0 0 7px #000',
            backgroundColor: primary400,
            width: '1.4em',
            height: '1.4em',
            display: 'inline-block',
            textAlign: 'center',
            position: 'absolute',
            bottom: '1.4em',
            left: '-.7em',
            border: '1px solid #212C3D'
        },
        rollContainer: {
            position: 'relative'
        },
        chatContent: {
            flexGrow: 1,
            overflow: 'auto',
            marginBottom: '8px',
            overflowY: 'scroll'
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
        }
    })
)

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
    const [dices, setDices] = useState<DiceWithCount[]>(emptyDices)
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
                            ? <div className={classes.miniDices}>{dices.map(dice => <MiniDiceWithCount key={dice.type} {...dice} />)}</div>
                            : <input className={classes.chatInputText} value={chatInput} onChange={handleChatInputChange} onKeyPress={handleKeyPress}/>}
                        <IconButton className={classes.chatInputBtn} disabled={isEmpty} onClick={handleClear}>
                            <ClearIcon fontSize="inherit" />
                        </IconButton>
                    </div>
                </div>
                <Grid container className={classes.rolls}>
                    <Grid container item xs={12} justify="space-between">
                        <div className={classes.rollContainer}><Dice type={4} className={classes.roll} onClick={addDice('4')}/><span className={classes.rollType}>4</span></div>
                        <div className={classes.rollContainer}> <Dice type={6} className={classes.roll} onClick={addDice('6')}/><span className={classes.rollType}>6</span></div>
                        <div className={classes.rollContainer}><Dice type={8} className={classes.roll} onClick={addDice('8')}/><span className={classes.rollType}>8</span></div>
                    </Grid>
                    <Grid container item xs={12} justify="space-between">
                        <div className={classes.rollContainer}><Dice type={10} className={classes.roll} onClick={addDice('10')}/><span className={classes.rollType}>10</span></div>
                        <div className={classes.rollContainer}><Dice type={12} className={classes.roll} onClick={addDice('12')}/><span className={classes.rollType}>12</span></div>
                        <div className={classes.rollContainer}><Dice type={20} className={classes.roll} onClick={addDice('20')}/><span className={classes.rollType}>20</span></div>
                    </Grid>
                    <Grid container item xs={12} style={{ marginTop: 'auto', height: 50 }}>
                        {inputType === InputType.dices
                            ? <Button color="secondary" disabled={isEmpty} onClick={roll}>Roll</Button>
                            : <Button color="secondary" disabled={!chatInput} onClick={sendMessage}>Send</Button>}
                    </Grid>
                </Grid>
            </Card>
        </div>
    )
}

export default ChatPanel