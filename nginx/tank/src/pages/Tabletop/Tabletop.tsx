import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import LeftDrawer from '../../components/Switcher/LeftDrawer'
import { Grid, Hidden } from '@material-ui/core'
import UserCard from '../../components/Controls/UserCard'
import PersonCard from '../../components/Controls/PersonCard'
import ChatPanel from '../../components/Controls/ChatPanel'
import Gameboard from 'game-module/src/Gameboard'
import { WebSocketContext } from '../../components/Contexts/WebSocketContext'
import { useDispatch, useSelector } from 'react-redux'
import { selectConnectGameState, selectCurrentGame, selectCurrentGameData } from '../../store/game/selectors'
import { AsyncState } from '../../store/user/reducer'
import FullscreenLoader from '../../components/Containers/FullscreenLoader/FullscreenLoader'
import { push } from 'connected-react-router'
import { connectGame, disconnectGame } from '../../store/game/actions'
import { GameDataMessage, SocketMessage } from '../../models/game'
import { ConnectedUser } from '../../models/user'
import useStyles from './styles'
import { useParams } from 'react-router-dom'
import { MenuType } from '../../components/Switcher/Switcher'
import AppsIcon from '@material-ui/icons/Apps'
import clsx from 'clsx'
import RightDrawer from '../../components/Controls/RightDrawer/RightDrawer'
import FullscreenPage from '../../components/Containers/FullscreenPage'
import { primary50 } from '../../styles/colors'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import { ReactComponent as EraserIcon } from '../../assets/eraser.svg'
import { getMaps } from '../../store/map/actions'
import { Map } from '../../models/map'
import { selectMaps } from '../../store/map/selectors'
import TutorialDialog from '../../components/Dialogs/TutorialDialog/TutorialDialog'
import ChooseCharacterDialog from '../../components/Dialogs/ChooseCharacterDialog'
import { Hero } from '../../models/hero'

export enum MyHeroType {
    unknown,
    set,
    unset
}

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
    const [tutorialOpen, setTutorialOpen] = useState(false)
    const [chooseHeroDialogOpen, setChooseHeroDialogOpen] = useState(false)
    const [myHero, setMyHero] = useState(MyHeroType.unknown)
    const [hero, setHero] = useState<Hero | null>(null)

    const [selectedMaps, setSelectedMaps] = useState<string[]>((currentGameData && currentGameData.meta.maps) || [])
    const maps = useSelector(selectMaps) || []

    const [idToDelete, setIdToDelete] = useState<null | number>(null)
    const isDltBtnHovered = useRef<boolean>(false)
    const currentGameDataRef = useRef(currentGameData)

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

    const handleMapChange = (mapId: string) => {
        ws.sendMessage('map', mapId)
        if (!selectedMaps.includes(mapId)) {
            setSelectedMaps((prev: string[]) => [...prev, mapId])
        }
    }

    const closeSidebar = useCallback(() => {
        setOpen(false)
        setType(MenuType.unselect)
    }, [])

    const handleUpdateMap = useCallback((mapId: string, currentGameData: SocketMessage) => {
        const newMap = maps.find(m => m.hash === mapId)

        if (newMap) {
            myGameBoard.setMap({ sprite: newMap.file }, () => {
                myGameBoard.refresh({
                    ...currentGameData.meta
                })
            })
            setSelectedMaps(prev => prev.includes(newMap.hash) ? prev : [...prev, newMap.hash])
            setIsGlobal(false)
            closeSidebar()
        }
        else {
            dispatch(getMaps(id, (maps: Map[]) => {
                const newMap = maps.find(m => m.hash === mapId)
                if (newMap) {
                    myGameBoard.setMap({ sprite: newMap.file }, () => {
                        myGameBoard.refresh({
                            ...currentGameData.meta
                        })
                    })
                    setSelectedMaps(prev => prev.includes(newMap.hash) ? prev : [...prev, newMap.hash])
                    setIsGlobal(false)
                    closeSidebar()
                }
            }))
        }
    }, [maps, closeSidebar, dispatch, myGameBoard, id])

    useEffect(() => {
        dispatch(getMaps(id))
        return () => {
            dispatch(disconnectGame())
        }
    }, [dispatch, id])

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
        if (currentGameData === currentGameDataRef.current) return
        currentGameDataRef.current = currentGameData

        if (currentGameData && myGameBoard !== null && boardRef.current && connectGameState === AsyncState.success) {

            switch (currentGameData.type) {
                case 'update_and_start':
                    myGameBoard.updateObject(currentGameData.meta, 'overlap')
                    myGameBoard.updateObject(currentGameData.meta)
                    break
                case 'update':
                    myGameBoard.updateObject(currentGameData.meta)
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

                    if (!currentGameData.meta.is_gm) {
                        if (currentGameData.meta.my_hero === null) {
                            setMyHero(MyHeroType.unset)
                        } else {
                            setMyHero(MyHeroType.set)
                            setHero(currentGameData.meta.my_hero)
                        }
                    }

                    closeSidebar()

                    currentGameData.meta.map !== 'Global'
                        ? handleUpdateMap(currentGameData.meta.map, currentGameData)
                        : myGameBoard.setMap({ sprite: '../globalSymbols/WorldMap.png' }, () =>
                            myGameBoard.refresh({
                                ...currentGameData.meta
                            }))

                    setIsGlobal(currentGameData.meta.map === 'Global')
                    setSelectedMaps(currentGameData.meta.maps || [])
                    break
                case 'connect':
                    setUsers(prev => [...prev, currentGameData.meta])
                    break
                case 'disconnect':
                    setUsers(prev => prev.filter(user => user.id !== currentGameData.meta))
                    break
                case 'map':
                    const mapId = currentGameData.meta.map
                    handleUpdateMap(mapId, currentGameData)
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
    }, [myGameBoard, currentGameData, connectGameState, closeSidebar, handleUpdateMap])

    useEffect(() => {
        window.addEventListener('resize', detect)
        return () => {
            window.removeEventListener('resize', detect)
        }
    }, [detect])

    useEffect(() => {
        if (myHero === MyHeroType.unset) {
            setChooseHeroDialogOpen(true)
        }
    }, [myHero])

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
                    selectedMaps={selectedMaps}
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
                                    <UserCard code={game ? game.invitation_code || '' : ''} hero={hero}/>
                                </Grid>
                                <Grid item xs={5} className={classes.controlPanel}>
                                    <ChatPanel data={messages}/>
                                </Grid>
                            </Grid>
                        </div>
                    </Hidden>
                </main>
                <Hidden mdDown={true}>
                    <div className={classes.mapControls}>
                        <div className={classes.mapControl}><AppsIcon className={classes.mapControlIcon} onClick={() => boardRef.current && boardRef.current.switchGrid()}/></div>
                        <div className={classes.mapControl}><CreateIcon className={classes.mapControlIcon} onClick={() => boardRef.current && boardRef.current.drawer.drawMode()}/></div>
                        <div className={classes.mapControl}><EraserIcon className={classes.mapControlIcon} onClick={() => boardRef.current && boardRef.current.drawer.eraseMode()}/></div>
                        <div className={classes.mapControl}><DeleteIcon className={classes.mapControlIcon} onClick={() => boardRef.current && boardRef.current.drawer.clear()}/></div>
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
                        hero={hero}
                        messages={messages}
                        invitation_code={game ? game.invitation_code || '' : ''}
                        users={users}
                        onSwitchGrid={() => boardRef.current && boardRef.current.switchGrid()}
                    />
                </Hidden>
                <TutorialDialog open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
                <ChooseCharacterDialog
                    open={chooseHeroDialogOpen}
                    onChoose={(hero: Hero) => {
                        setMyHero(MyHeroType.set)
                        setHero(hero)
                        ws.sendMessage('add', {
                            type: 'hero',
                            hero_id: hero.id,
                            xy: [0, 0],
                            sprite: hero.sprite,
                            name: hero.name
                        })
                        setChooseHeroDialogOpen(false)
                        setTutorialOpen(true)
                    }}
                />
            </div>
        </div>
    )
}

export default Tabletop