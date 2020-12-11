import React, { useContext, useEffect, useState } from 'react'
import LeftDrawer, { heroes, mapsList, markersList } from '../../components/Switcher/LeftDrawer'
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
import { ConnectedUser } from '../../models/user'
import useStyles from './styles'

// https://codesandbox.io/s/ykk2x8k7xj?file=/src/App/index.js

const Tabletop = () => {
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

    // Preload images
    useEffect(() => {
        heroes.forEach((hero: string) => {
            const img = new Image()
            img.src = `heroes/${hero}.png`
        })
        markersList.forEach((marker: string) => {
            const img = new Image()
            img.src = `markers/${marker}.png`
        })
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
            const assets = [{ name: 'grid', path: 'locations/Bayport.png' }]

            // Предзагрузка всех используемых спрайтов
            heroes.forEach((hero: string) =>
                assets.push({ name: hero, path: `heroes/${hero}.png` }))

            markersList.forEach((marker: string) =>
                assets.push({ name: marker, path: `markers/${marker}.png` }))

            mapsList.forEach((location: string) =>
                assets.push({ name: location, path: `locations/${location}.png` }))

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

            // if (currentGameData.type === 'map') {
            //     setIsLoaded(false)
            //     myGameBoard.setMap({ sprite: `locations/${currentGameData.meta}.png` }, () => {
            //         setIsLoaded(true)
            //         ws.sendMessage('refresh')
            //     })
            // }
            //
            // if (!isLoaded) return

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
                    myGameBoard.refresh({
                        ...currentGameData.meta
                    })
                    myGameBoard.setMap({ sprite: `locations/${currentGameData.meta.map}.png` })
                    break
                case 'connect':
                    setUsers(prev => [...prev, currentGameData.meta])
                    break
                case 'disconnect':
                    setUsers(prev => prev.filter(user => user.id !== currentGameData.meta))
                    break
                case 'map':
                    myGameBoard.setMap({ sprite: `locations/${currentGameData.meta}.png` })
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
        dispatch(push('/'))
    }

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <LeftDrawer
                    onOpen={() => myGameBoard && myGameBoard.resetDraggedDOMListeners()}
                    onMapChange={(map: string) => ws.sendMessage('map', map)}
                />
                <main className={classes.content}>
                    <div className={classes.map} ref={divRef}/>
                    <div className={classes.controls}>
                        <Grid container>
                            <Grid item xs={5} className={classes.controlPanel}>
                                <div className={classes.people}>
                                    {users.map(user => <PersonCard user={user.username}/>)}
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