import React, { useContext, useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import LeftDrawer from '../../components/Switcher/LeftDrawer'
import { Grid } from '@material-ui/core'
import UserCard from '../../components/Controls/UserCard'
import PersonCard from '../../components/Controls/PersonCard'
import ChatPanel from '../../components/Controls/ChatPanel'
// @ts-ignore
import Gameboard from 'game-module/src/Gameboard'
import { WebSocketContext } from '../../components/Contexts/WebSocketContext'
import { useDispatch, useSelector } from 'react-redux'
import { selectConnectGameState, selectCurrentGame, selectCurrentGameData } from '../../store/game/selectors'
import { AsyncState } from '../../store/user/reducer'
import FullscreenLoader from '../../components/Containers/FullscreenLoader/FullscreenLoader'
import { push } from 'connected-react-router'
import { disconnectGame } from '../../store/game/actions'
import { GameDataMessage } from '../../models/game'


const drawerWidth = 240
// https://codesandbox.io/s/ykk2x8k7xj?file=/src/App/index.js
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100vh',
            zIndex: 1,
            overflow: 'hidden'
        },
        appFrame: {
            position: 'relative',
            display: 'flex',
            width: '100%',
            height: '100%'
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '10px'
        },
        map: {
            flexGrow: 1,
            marginBottom: '12px'
        },
        controls: {
            height: 250,
            backgroundColor: '#334055',
            display: 'flex'
        },
        people: {
            display: 'flex',
            height: '100%',
            padding: theme.spacing(1),
            marginRight: theme.spacing(1),
            '& > *': {
                cursor: 'pointer',
                backgroundColor: '#43536B',
                minWidth: theme.spacing(20),
                height: '100%',
                display: 'flex',
                alightItems: 'center',
                justifyContent: 'center',
                direction: 'column',
                paddingTop: theme.spacing(2),
                marginRight: theme.spacing(2)
            },
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        },
        controlPanel: {
            maxHeight: '100%'
        }
    }),
)

const Tabletop = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const divRef = React.useRef<HTMLDivElement>(null)
    const boardRef = React.useRef()  // Ссылка на игровое поле

    const ws = useContext(WebSocketContext)
    const game = useSelector(selectCurrentGame)
    const currentGameData = useSelector(selectCurrentGameData)
    const connectGameState = useSelector(selectConnectGameState)

    const [myGameBoard, setMyGameBoard] = useState(null)
    const [messages, setMessages] = useState<GameDataMessage[]>([])

    useEffect(() => {
        return () => {
            dispatch(disconnectGame())
        }
    }, [dispatch])

    useEffect(() => {
        if (!myGameBoard && connectGameState === AsyncState.success && game && game.invitation_code && divRef && divRef.current && ws) {
            const gameBoard = new Gameboard({
                parent: divRef.current,
                // Нужно указать ширину/длину, иначе отчего-то хендлеры не робят
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight,
                transparent: true,
                //backgroundColor: 0xfff000
                // TODO: isGameMaster: {boolean}
            })

            gameBoard.eventManager.subscribe('map', (data: any) => ws.sendMessage('map', data))
            gameBoard.eventManager.subscribe('add', (data: any) => ws.sendMessage('add', data))
            gameBoard.eventManager.subscribe('update', (data: any) => ws.sendMessage('update', data))
            gameBoard.eventManager.subscribe('delete', (data: any) => ws.sendMessage('delete', data))

            // Картинки беру у клиента из точки входа
            const assets = [{ name: 'grid', path: 'locations/Bayport.png' }]

            // Грузим холст и статики (пока так)
            gameBoard.preload(assets, () => {
                // Устанавливаем мапу
                gameBoard.setMap({ sprite: 'locations/Bayport.png' }, () => {
                    // Сохраняем ссылку
                    boardRef.current = gameBoard
                })
            })

            setMyGameBoard(gameBoard)
        }
    }, [game, divRef, ws, connectGameState])

    useEffect(() => {
        if (currentGameData && myGameBoard !== null && connectGameState === AsyncState.success) {
            switch (currentGameData.type) {
                case 'update':
                    myGameBoard.updateObjectPosition(currentGameData.meta)
                    break
                case 'add':
                    myGameBoard.addObject(currentGameData.meta)
                    break
                case 'delete':
                    myGameBoard.deleteObject(currentGameData.meta)
                    break
                case 'chat':
                    setMessages(prev => [...prev, currentGameData.meta])
                    break
                case 'refresh':
                case 'clear':
                default:
                    break
            }
        }
    }, [myGameBoard, currentGameData, connectGameState])

    if (connectGameState === AsyncState.inProcess) {
        return <FullscreenLoader/>
    }

    if (connectGameState === AsyncState.error || connectGameState === AsyncState.unknown) {
        dispatch(push('/'))
    }

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <LeftDrawer onOpen={() => {
                    myGameBoard && myGameBoard.resetDraggedDOMListeners()
                }}/>
                <main className={classes.content}>
                    <div className={classes.map} ref={divRef}/>
                    <div className={classes.controls}>
                        <Grid container>
                            <Grid item xs={5} className={classes.controlPanel}>
                                <div className={classes.people}>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                </div>
                            </Grid>
                            <Grid item xs={2} className={classes.controlPanel}>
                                <UserCard/>
                            </Grid>
                            <Grid item xs className={classes.controlPanel}>
                                <ChatPanel data={messages}/>
                            </Grid>
                        </Grid>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Tabletop