import React, { useCallback, useContext, useEffect, useState } from 'react'
import LeftDrawer from '../../components/Switcher/LeftDrawer'
import { Grid, Hidden } from '@material-ui/core'
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
import { MenuType } from '../../components/Switcher/Switcher'
import AppsIcon from '@material-ui/icons/Apps'
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from 'clsx'
import RightDrawer from '../../components/Controls/RightDrawer/RightDrawer'
import FullscreenPage from '../../components/Containers/FullscreenPage'
import { primary50 } from '../../styles/colors'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

// https://codesandbox.io/s/ykk2x8k7xj?file=/src/App/index.js
interface ParamTypes {
    id: string
}

const Tabletop = () => {
    const { id } = useParams<ParamTypes>()

    const classes = useStyles()
    const dispatch = useDispatch()
    const divRef = React.useRef<HTMLDivElement>(null)
    const boardRef = React.useRef<any>(null)

    const ws = useContext(WebSocketContext)
    const game = useSelector(selectCurrentGame)
    const currentGameData = useSelector(selectCurrentGameData)
    const connectGameState = useSelector(selectConnectGameState)

    const [myGameBoard, setMyGameBoard] = useState<any>(null)
    const [messages, setMessages] = useState<GameDataMessage[]>([])
    const [users, setUsers] = useState<ConnectedUser[]>([])
    const [isGlobal, setIsGlobal] = useState<boolean | null>(null)
    const [isSwiping, setSwiping] = useState(false)
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<MenuType>(MenuType.unselect)
    const [showControls, setShowControls] = useState(true)

    const [maps, setMaps] = useState((currentGameData && currentGameData.meta.maps) || [])
    const [idToDelete, setIdToDelete] = useState<null | number>(null)
    const isDltBtnHovered = React.useRef<boolean>(false)

    const [orientation, setOrientation] = useState({
        device: !!navigator.maxTouchPoints ? 'mobile' : 'computer',
        orientation: !navigator.maxTouchPoints ? 'desktop' : !window.screen.orientation.angle ? 'portrait' : 'landscape'
    })

    const detect = useCallback(() => {
        setOrientation({
            device: !!navigator.maxTouchPoints ? 'mobile' : 'computer',
            orientation: !navigator.maxTouchPoints ? 'desktop' : !window.screen.orientation.angle ? 'portrait' : 'landscape'
        })
    }, [])

    const handleOpenDrawer = useCallback(() => {
        myGameBoard && myGameBoard.resetDraggedDOMListeners()
    }, [myGameBoard])

    const handleOpenGlobalCard = useCallback(() => {
        ws.sendMessage('global_map')
    }, [ws])

    const handleMapChange = (map: string) => {
        ws.sendMessage('map', map)
        if (!maps.includes(map)) {
            setMaps((prev: string[]) => [...prev, map])
        }
    }

    const closeSidebar = useCallback(() => {
        setOpen(false)
        setType(MenuType.unselect)
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
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight,
                transparent: true,
                //backgroundColor: 0xfff000
                // TODO: isGameMaster: {boolean}
            })

            // gameBoard.eventManager.subscribe('map', (data: any) => ws.sendMessage('map', data))
            gameBoard.eventManager.subscribe('add', (data: any) => ws.sendMessage('add', data))
            gameBoard.eventManager.subscribe('update', (data: any) => ws.sendMessage('update', data))
            gameBoard.eventManager.subscribe('update_and_save', (data: any) => {
                ws.sendMessage('update_and_save', data)

                if (isDltBtnHovered.current) {
                    gameBoard.deleteObject({ id: data.id })
                    ws.sendMessage('delete', { id: data.id })
                    isDltBtnHovered.current = false
                }

                setIdToDelete(null)

            })
            gameBoard.eventManager.subscribe('update_and_start', (data: any) => {
                ws.sendMessage('update_and_start', data)
                setIdToDelete(data.id)
            })

            const assets = [{ name: 'grid', path: '../grid64.png' }]

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
                case 'update_and_start':
                    myGameBoard.updateObjectPosition(currentGameData.meta)
                    myGameBoard.updateObjectOverlap(currentGameData.meta)
                    break
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
                    closeSidebar()

                    myGameBoard.setMap({
                        sprite: currentGameData.meta.map === 'Global'
                            ? '../globalSymbols/WorldMap.png'
                            : `../locations/${currentGameData.meta.map}.png`
                    }, () => {
                        myGameBoard.refresh({
                            ...currentGameData.meta
                        })
                    })
                    setIsGlobal(currentGameData.meta.map === 'Global')
                    setMaps(currentGameData.meta.maps || [])
                    break
                case 'connect':
                    setUsers(prev => [...prev, currentGameData.meta])
                    break
                case 'disconnect':
                    setUsers(prev => prev.filter(user => user.id !== currentGameData.meta))
                    break
                case 'map':
                    const map = currentGameData.meta.map

                    myGameBoard.setMap({ sprite: `../locations/${map}.png` }, () => {
                        myGameBoard.refresh({
                            ...currentGameData.meta
                        })
                    })
                    setIsGlobal(false)
                    closeSidebar()

                    setMaps((prev: string[]) => {
                        return prev.includes(map) ? prev : [...prev, map]
                    })
                    break
                case 'global_map':
                    myGameBoard.setMap({ sprite: '../globalSymbols/WorldMap.png' }, () => {
                        myGameBoard.refresh({
                            ...currentGameData.meta
                        })
                    })
                    setIsGlobal(true)
                    closeSidebar()
                    break
                case 'clear':
                default:
                    break
            }
        }
    }, [myGameBoard, currentGameData, connectGameState, closeSidebar])

    useEffect(() => {
        window.addEventListener('resize', detect)
        return () => {
            window.removeEventListener('resize', detect)
        }
    }, [detect])

    if (orientation.device === 'mobile' && orientation.orientation === 'portrait') {
        return <FullscreenPage styles={{ color: primary50 }}>Please, rotate your device to landscape mode</FullscreenPage>
    }

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
                    open={open}
                    setOpen={setOpen}
                    type={type}
                    setType={setType}
                    maps={maps}
                />
                <main className={classes.content}>
                    <div
                        className={classes.map}
                        ref={divRef}
                        onMouseDown={() => {
                            setSwiping(false)
                        }}
                        onMouseMove={() => {
                            setSwiping(true)
                        }}
                        onMouseUp={e => {
                            if (!isSwiping && e.button === 0 && open) {
                                closeSidebar()
                            }
                            setSwiping(false)
                        }}
                    />
                    <Hidden mdDown={true}>
                        <div className={clsx(classes.controls, !showControls && classes.hideControls)}>
                            <div className={clsx(classes.closeButton, classes.drawerBtn)} onClick={() => setShowControls(isOpen => !isOpen)}>
                                <ArrowBackIosIcon className={clsx(classes.closeIcon, !showControls && classes.closeIconClosed)} />
                            </div>
                            <Grid container>
                                <Grid item xs={5} className={classes.controlPanel}>
                                    <div className={classes.people}>
                                        {users.map(user => <PersonCard user={user.username} key={user.username}/>)}
                                    </div>
                                </Grid>
                                <Grid item xs={2} className={classes.controlPanel}>
                                    <UserCard code={game ? game.invitation_code || '' : ''}/>
                                </Grid>
                                <Grid item xs={5} className={classes.controlPanel}>
                                    <ChatPanel data={messages}/>
                                </Grid>
                            </Grid>
                        </div>
                    </Hidden>
                </main>
                <Hidden mdDown={true}>
                    <div className={clsx(classes.mapBtn, classes.switchGridBtn)} onClick={() => boardRef.current && boardRef.current.switchGrid()}>
                        <AppsIcon className={classes.mapIcon}/>
                    </div>
                </Hidden>
                {
                    idToDelete &&
                    <div
                        className={clsx(classes.mapBtn, classes.deleteBtn) }
                        onMouseEnter={() => { isDltBtnHovered.current = true  }}
                        onMouseLeave={() => { isDltBtnHovered.current = false }}
                    >
                        <DeleteIcon className={classes.mapIcon}/>
                    </div>
                }
                <Hidden lgUp={true}>
                    <RightDrawer
                        messages={messages}
                        invitation_code={game ? game.invitation_code || '' : ''}
                        users={users}
                        onSwitchGrid={() => boardRef.current && boardRef.current.switchGrid()}
                    />
                </Hidden>
            </div>
        </div>
    )
}

export default Tabletop