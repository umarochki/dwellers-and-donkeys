import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Button, Card, Grid, IconButton, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary200, primary800, primary900 } from '../../styles/colors'
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
            height: '100%',
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
        rolls: {
            padding: theme.spacing(1),
            width: 250,
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
            overflow: 'auto'
        },
        chatMessage: {
            height: 30,
            marginBottom: theme.spacing(1),
            display: 'flex',
            alignItems: 'flex-end'
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

    if (message.type === 'roll') {
        return (
            <div className={classes.chatMessage}>
                <span className={classes.diceSquare}>{message.total}</span>({h > 9 ? h : '0' + h}:{min > 9 ? min : '0' + min})
            </div>
        )
    }

    return (
        <div className={classes.chatMessage}>
            {message.message}
        </div>
    )
}

interface Props {
    data: GameDataMessage[]
}

const ChatPanel: React.FC<Props> = props => {
    const { data } = props
    const classes = useStyles()
    const ws = useContext(WebSocketContext)
    const connectGameState = useSelector(selectConnectGameState)

    const emptyDices = useMemo(() => ['4', '6', '8', '10', '12', '20'].map(type => ({ type: type, count: 0 })), [])
    const [dices, setDices] = useState<Dice[]>(emptyDices)
    const isEmpty = useMemo(() => !dices.some(dice => dice.count > 0), [dices])

    const addDice = useCallback((type: string) => () => {
        setDices(prev => prev.map(dice => dice.type === type
            ? { count: dice.count + 1, type }
            : dice
        ))
    }, [])

    const roll = useCallback(() => {
        if (ws && connectGameState === AsyncState.success) {
            ws.sendMessage('roll', dices.reduce((obj: any, dice) => {
                obj[`d${dice.type}`] = dice.count
                return obj
            }, {}))
            setDices(emptyDices)
        }
    }, [ws, connectGameState, dices, emptyDices])

    return (
        <div className={classes.root}>
            <Card className={classes.content}>
                <div className={classes.chat}>
                    <div className={classes.chatContent}>
                        {data.map(item => <ChatMessage key={item.time} message={item}/>)}
                    </div>
                    <div className={classes.chatInput}>
                        <div className={classes.miniDices}>
                            {dices.map(dice => <MiniDice key={dice.type} {...dice} />)}
                        </div>
                        <IconButton className={classes.chatInputBtn} disabled={isEmpty} onClick={() => setDices(emptyDices)}>
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
                    <Grid container item xs={12}>
                        <Button color="secondary" disabled={isEmpty} onClick={roll}>Кинуть</Button>
                    </Grid>
                </Grid>
            </Card>
        </div>
    )
}

export default ChatPanel