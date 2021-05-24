import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Grid, Hidden, IconButton, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary200, primary50, primary800, primary900 } from '../../../styles/colors'
import ClearIcon from '@material-ui/icons/Clear'
import { WebSocketContext } from '../../Contexts/WebSocketContext'
import { useSelector } from 'react-redux'
import { selectConnectGameState } from '../../../store/game/selectors'
import { AsyncState } from '../../../store/user/reducer'
import ChatMessageContainer from './ChatMessageContainer'
import MiniDiceWithCount, { DiceWithCount } from './MiniDiceWithCount'
import { ChatMessagePayload, RollType } from '../../../models/chat'
import RollContainer from '../../Containers/RollContainer'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            height: '100%',
            [theme.breakpoints.down('md')]: {
                height: 'auto'
            }
        },
        content: {
            backgroundColor: primary900,
            display: 'flex',
            height: '100%',
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column'
            }
        },
        chat: {
            padding: theme.spacing(1),
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            color: primary200,
            maxHeight: '100%',
            [theme.breakpoints.down('md')]: {
                height: 250,
                padding: 0,
                paddingTop: theme.spacing(1)
            }
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
            height: '100%',
            [theme.breakpoints.down('md')]: {
                height: 200,
                width: '100%',
                marginLeft: theme.spacing(1),
                paddingBottom: 0
            }
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
    data: ChatMessagePayload[]
}

const ChatPanel: React.FC<Props> = props => {
    const { data } = props
    const classes = useStyles()
    const ws = useContext(WebSocketContext)
    const connectGameState = useSelector(selectConnectGameState)

    const [chatInput, setChatInput] = useState('')
    const [inputType, setInputType] = useState(InputType.text)
    const messagesEnd = useRef<HTMLDivElement | null>(null)

    const emptyDices = useMemo(() => ['4', '6', '8', '10', '12', '20'].map(type => ({ type: type, count: 0 })), [])
    const [dices, setDices] = useState<DiceWithCount[]>(emptyDices)
    const isEmpty = useMemo(() => !dices.some(dice => dice.count > 0), [dices])

    const typesCount = useMemo(() => dices.reduce((sum, d) => d.count ? sum + 1 : sum, 0), [dices])
    const isFull = useMemo(() => typesCount === 3, [typesCount])

    const addDice = useCallback((type: string, index: number) => () => {
        if (isFull && !dices[index].count) return

        if (inputType !== InputType.dices) {
            setInputType(InputType.dices)
            setChatInput('')
        }
        setDices(prev => prev.map(dice => dice.type === type
            ? { count: dice.count + 1, type }
            : dice
        ))
    }, [inputType, isFull, dices])

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

    const isDisabled = useCallback((index: number) => isFull && !dices[index].count, [dices, isFull])

    return (
        <div className={classes.root}>
            <Card className={classes.content}>
                <div className={classes.chat}>
                    <div className={classes.chatContent}>
                        {data.map(item => <ChatMessageContainer key={item.time} message={item}/>)}
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
                    <Hidden lgUp={true}>
                        <Grid container item xs={12} style={{ height: 40, display: 'flex', justifyContent: 'center' }}>
                            {inputType === InputType.dices
                                ? <Button color="secondary" disabled={isEmpty} onClick={roll}>Roll</Button>
                                : <Button color="secondary" disabled={!chatInput} onClick={sendMessage}>Send</Button>}
                        </Grid>
                    </Hidden>
                    <Grid container item xs={12} justify="space-between">
                        <RollContainer type={RollType.D4} isDisabled={isDisabled(0)} onClick={addDice('4', 0)} />
                        <RollContainer type={RollType.D6} isDisabled={isDisabled(1)} onClick={addDice('6', 1)} />
                        <RollContainer type={RollType.D8} isDisabled={isDisabled(2)} onClick={addDice('8', 2)} />
                    </Grid>
                    <Grid container item xs={12} justify="space-between">
                        <RollContainer type={RollType.D10} isDisabled={isDisabled(3)} onClick={addDice('10', 3)} />
                        <RollContainer type={RollType.D12} isDisabled={isDisabled(4)} onClick={addDice('12', 4)} />
                        <RollContainer type={RollType.D20} isDisabled={isDisabled(5)} onClick={addDice('20', 5)} />
                    </Grid>
                    <Hidden mdDown={true}>
                        <Grid container item xs={12} style={{ marginTop: 'auto', height: 50 }}>
                            {inputType === InputType.dices
                                ? <Button color="secondary" disabled={isEmpty} onClick={roll}>Roll</Button>
                                : <Button color="secondary" disabled={!chatInput} onClick={sendMessage}>Send</Button>}
                        </Grid>
                    </Hidden>
                </Grid>
            </Card>
        </div>
    )
}

export default ChatPanel