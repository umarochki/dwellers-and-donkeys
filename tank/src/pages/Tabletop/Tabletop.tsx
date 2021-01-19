import React, { useCallback, useContext, useEffect, useState } from 'react'
import LeftDrawer, { globalSymbols, heroes, mapsList, markersList } from '../../components/Switcher/LeftDrawer'
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
import { connectGame, disconnectGame } from '../../store/game/actions'
import { GameDataMessage } from '../../models/game'
import { ConnectedUser } from '../../models/user'
import useStyles from './styles'
import { useParams } from 'react-router-dom'

// https://codesandbox.io/s/ykk2x8k7xj?file=/src/App/index.js
interface ParamTypes {
    id: string
}

const Tabletop = () => {
    const { id } = useParams<ParamTypes>()

    const classes = useStyles()
    const dispatch = useDispatch()
    const divRef = React.useRef<HTMLDivElement>(null)
    const boardRef = React.useRef()  // Ссылка на игровое поле

    const ws = useContext(WebSocketContext)
    const game = useSelector(selectCurrentGame)
    const currentGameData = useSelector(selectCurrentGameData)
    const connectGameState = useSelector(selectConnectGameState)

    const [myGameBoard, setMyGameBoard] = useState<any>(null)
    const [messages, setMessages] = useState<GameDataMessage[]>([])
    const [users, setUsers] = useState<ConnectedUser[]>([])
    const [isGlobal, setIsGlobal] = useState(true)

    const handleOpenDrawer = useCallback(() => {
        myGameBoard && myGameBoard.resetDraggedDOMListeners()
    }, [myGameBoard])

    const handleOpenGlobalCard = useCallback(() => {
        ws.sendMessage('global_map')
    }, [ws])

    const handleMapChange = useCallback((map: string) => {
        ws.sendMessage('map', map)
    }, [ws])

    // Preload images
    useEffect(() => {
        // heroes.forEach((hero: string) => {
        //     const img = new Image()
        //     img.src = `heroes/${hero}.png`
        // })
        // markersList.forEach((marker: string) => {
        //     const img = new Image()
        //     img.src = `markers/${marker}.png`
        // })
        // mapsList.forEach((location: string) => {
        //     const img = new Image()
        //     img.src = `locations/${location}.png`
        // })
    }, [])

    useEffect(() => {
        return () => {
            dispatch(disconnectGame())
        }
    }, [dispatch])

    useEffect(() => {
        if (!myGameBoard && connectGameState === AsyncState.success && game && game.invitation_code && divRef && divRef.current && ws.socket) {
            const gameBoard = new Gameboard({
                parent: divRef.current,
                // Нужно указать ширину/длину, иначе отчего-то хендлеры не робят
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight,
                transparent: true,
                //backgroundColor: 0xfff000
                // TODO: isGameMaster: {boolean}
            })

            // gameBoard.eventManager.subscribe('map', (data: any) => ws.sendMessage('map', data))
            gameBoard.eventManager.subscribe('add', (data: any) => ws.sendMessage('add', data))
            gameBoard.eventManager.subscribe('update', (data: any) => ws.sendMessage('update', data))
            gameBoard.eventManager.subscribe('update_and_save', (data: any) => ws.sendMessage('update_and_save', data))
            gameBoard.eventManager.subscribe('delete', (data: any) => ws.sendMessage('delete', data))

            // Картинки беру у клиента из точки входа
            const assets = [{ name: 'grid', path: '../globalSymbols/WorldMap.png' }]

            // Предзагрузка всех используемых спрайтов
            heroes.forEach((hero: string) =>
                assets.push({ name: hero, path: `../heroes/${hero}.png` }))

            markersList.forEach((marker: string) =>
                assets.push({ name: marker, path: `../markers/${marker}.png` }))

            mapsList.forEach((location: string) =>
                assets.push({ name: location, path: `../locations/${location}.png` }))

            globalSymbols.forEach((globalSymbol: string) =>
                assets.push({ name: globalSymbol, path: `../globalSymbols/${globalSymbol}.png` }))

            assets.push({ name: 'WorldMap', path: `../globalSymbols/WorldMap.png` })

            // Грузим холст и статики (пока так)
            gameBoard.preload(assets, () => {
                boardRef.current = gameBoard
                ws.sendMessage('refresh')
            })

            setMyGameBoard(gameBoard)
        }
    }, [game, divRef, ws, connectGameState, myGameBoard])

    useEffect(() => {
        if (currentGameData && myGameBoard !== null && boardRef.current && connectGameState === AsyncState.success) {

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
                    setUsers(currentGameData.meta.active_users)
                    setMessages(currentGameData.meta.chat)

                    myGameBoard.setMap({
                        sprite: currentGameData.meta.map === 'Global'
                            ? '../globalSymbols/WorldMap.png'
                            : `../locations/${currentGameData.meta.map}.png`
                    }, () => {
                        myGameBoard.refresh({
                            ...currentGameData.meta
                        })
                    })
                    break
                case 'connect':
                    setUsers(prev => [...prev, currentGameData.meta])
                    break
                case 'disconnect':
                    setUsers(prev => prev.filter(user => user.id !== currentGameData.meta))
                    break
                case 'map':
                    setIsGlobal(false)
                    myGameBoard.setMap({ sprite: `../locations/${currentGameData.meta.map}.png` }, () => {
                        myGameBoard.refresh({
                            ...currentGameData.meta
                        })
                    })
                    break
                case 'global_map':
                    setIsGlobal(true)
                    myGameBoard.setMap({ sprite: '../globalSymbols/WorldMap.png' }, () => {
                        myGameBoard.refresh({
                            ...currentGameData.meta
                        })
                    })
                    break
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
        if (!game || game.invitation_code !== id) {
            dispatch(connectGame(id))
            return <FullscreenLoader/>
        }
        dispatch(push('/'))
    }

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <LeftDrawer
                    global={isGlobal}
                    onOpen={handleOpenDrawer}
                    onMapChange={handleMapChange}
                    onOpenGlobalCard={handleOpenGlobalCard}
                />
                <main className={classes.content}>
                    <div className={classes.map} ref={divRef}/>
                    <div className={classes.controls}>
                        <Grid container>
                            <Grid item xs={5} className={classes.controlPanel}>
                                <div className={classes.people}>
                                    {users.map(user => <PersonCard user={user.username} key={user.username}/>)}
                                </div>
                            </Grid>
                            <Grid item xs={2} className={classes.controlPanel}>
                                <UserCard code={game ? game.invitation_code || '' : ''}/>
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