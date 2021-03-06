import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import LeftDrawer from '../../components/Switcher/LeftDrawer'
import { Hidden } from '@material-ui/core'
import Gameboard from 'gameboard'
import { WebSocketContext } from '../../components/Contexts/WebSocketContext'
import { useDispatch, useSelector } from 'react-redux'
import { selectConnectGameState, selectCurrentGame, selectCurrentGameData } from '../../store/game/selectors'
import { AsyncState } from '../../store/user/reducer'
import FullscreenLoader from '../../components/Containers/FullscreenLoader'
import { push } from 'connected-react-router'
import { connectGame, disconnectGame } from '../../store/game/actions'
import { SocketMessage } from '../../models/socket'
import { ChatMessagePayload } from '../../models/chat'
import { ConnectedUser } from '../../models/user'
import useStyles from './styles'
import { useParams } from 'react-router-dom'
import { MenuType } from '../../components/Switcher/Switcher'
import clsx from 'clsx'
import RightDrawer from '../../components/Controls/RightDrawer/RightDrawer'
import FullscreenPage from '../../components/Containers/FullscreenPage'
import { primary50 } from '../../styles/colors'
import DeleteIcon from '@material-ui/icons/Delete'
import { getMaps } from '../../store/map/actions'
import { Map } from '../../models/map'
import { selectMaps } from '../../store/map/selectors'
import TutorialDialog from '../../components/Dialogs/TutorialDialog/TutorialDialog'
import ChooseCharacterDialog from '../../components/Dialogs/ChooseCharacterDialog'
import { Hero } from '../../models/hero'
import MapControls from '../../components/Controls/Map/MapControls'
import BottomControlPanel from '../../components/Controls/Bottom/BottomControlPanel'
import { RefreshMessage } from '../../models/tabletop'

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

    const ws = useContext(WebSocketContext)

    const currentGameData = useSelector(selectCurrentGameData)
    const connectGameState = useSelector(selectConnectGameState)
    const currentGame = useSelector(selectCurrentGame)

    const [myGameBoard, setMyGameBoard] = useState<any>(null)
    const [messages, setMessages] = useState<ChatMessagePayload[]>([])
    const [users, setUsers] = useState<ConnectedUser[]>([])
    const [isGlobal, setIsGlobal] = useState<boolean | null>(null)
    const [isGM, setIsGM] = useState(false)
    const [isSwiping, setSwiping] = useState(false)

    const [open, setOpen] = useState(false)
    const [type, setType] = useState<MenuType>(MenuType.unselect)
    const [objectId, setObjectId] = useState<string | null>(null)

    const [showControls, setShowControls] = useState(true)
    const [tutorialOpen, setTutorialOpen] = useState(false)
    const [chooseHeroDialogOpen, setChooseHeroDialogOpen] = useState(false)
    const [myHero, setMyHero] = useState(MyHeroType.unknown)
    const [hero, setHero] = useState<Hero | undefined>(undefined)

    const [selectedMaps, setSelectedMaps] = useState<string[]>((currentGameData && currentGameData.meta.maps) || [])
    const maps = useSelector(selectMaps)

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
        myGameBoard && myGameBoard.dragAndDrop.reset()
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
            myGameBoard.map.set({ sprite: newMap.file }, () => {
                myGameBoard.gameObjectManager.refresh({
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
                    myGameBoard.map.set({ sprite: newMap.file }, () => {
                        myGameBoard.gameObjectManager.refresh({
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

    const  handleLocationChange = useCallback((id: string) => {
        setType(MenuType.markerLocation)
        setObjectId(id)
        setSwiping(true)
        setOpen(true)
    }, [])

    useEffect(() => {
        if (!myGameBoard && connectGameState === AsyncState.success && ws.socket && !currentGameData) {
            ws.sendMessage('refresh')
        }
    }, [divRef, ws, connectGameState, myGameBoard, currentGameData])


    useEffect(() => {

        if (!myGameBoard && connectGameState === AsyncState.success && divRef && divRef.current && ws.socket && currentGameData && handleLocationChange && closeSidebar) {

            const gameBoard = new Gameboard({
                parent: divRef.current,
                width: divRef.current.clientWidth,
                height: divRef.current.clientHeight,
                transparent: true,
                resizeTo: divRef.current,
                isGameMaster: (currentGameData as RefreshMessage).meta.is_gm || false
            })

            const assets = [
                { name: 'grid', url: '../grid64.png' },
                { name: 'star', url: '../star.png' }
            ]

            gameBoard.init(assets, () => {
                gameBoard.eventManager.add('map/set', (data: any) => {
                    setIsGlobal(false)
                    ws.sendMessage('map', data.hash)
                })
                gameBoard.eventManager.add('object/add', (data: any) => ws.sendMessage('add', data))
                gameBoard.eventManager.add('object/delete', (data: any) => ws.sendMessage('delete', data))
                gameBoard.eventManager.add('object/updated', (data: any) => ws.sendMessage('update', data), true)
                gameBoard.eventManager.add('object/updated/after', (data: any) => {
                    ws.sendMessage('update_and_save', data)

                    if (isDltBtnHovered.current) {
                        gameBoard.gameObjectManager.delete({ id: data.id })
                        ws.sendMessage('delete', { id: data.id })
                        isDltBtnHovered.current = false
                    }

                    setIdToDelete(null)
                })

                gameBoard.eventManager.add('object/updated/before', (data: any) => {
                    ws.sendMessage('update_and_start', data)
                    setIdToDelete(data.id)
                })

                gameBoard.eventManager.add('object/selected', (data: any) => {
                    if (data.type === "marker") {
                        handleLocationChange(data.id)
                    }
                })
                gameBoard.eventManager.add('object/unselected', () => closeSidebar())

                gameBoard.eventManager.add('draw/pencil/started', (data: any) => ws.sendMessage('draw_pencil_started', data))
                gameBoard.eventManager.add('draw/pencil/moved', (data: any) => ws.sendMessage('draw_pencil_moved', data), true, ['xy'])
                gameBoard.eventManager.add('draw/pencil/stopped', (data: any) => ws.sendMessage('draw_pencil_stopped', data))

                gameBoard.eventManager.add('draw/eraser/started', (data: any) => ws.sendMessage('draw_eraser_started', data))
                gameBoard.eventManager.add('draw/eraser/moved', (data: any) => ws.sendMessage('draw_eraser_moved', data), true)
                gameBoard.eventManager.add('draw/eraser/stopped', (data: any) => ws.sendMessage('draw_eraser_stopped', data))

                gameBoard.eventManager.add('draw/polygon/click/started', (data: any) => ws.sendMessage('draw_polygon_started', data))
                gameBoard.eventManager.add('draw/polygon/click/middle', (data: any) => ws.sendMessage('draw_polygon_middle', data))
                gameBoard.eventManager.add('draw/polygon/click/stopped', (data: any) => ws.sendMessage('draw_polygon_stopped', data))
                gameBoard.eventManager.add('draw/polygon/moved', (data: any) => ws.sendMessage('draw_polygon_moved', data), true)
                gameBoard.eventManager.add('draw/polygon/add', (data: any) => ws.sendMessage('draw_polygon_add', data), true)

                gameBoard.eventManager.add('region/obstacle/add', (data: any) => ws.sendMessage('region_obstacle_add', data))

                setMyGameBoard(gameBoard)
            })
        }
    }, [divRef, ws, connectGameState, myGameBoard, currentGameData, closeSidebar, handleLocationChange])

    useEffect(() => {
        if (currentGameData && myGameBoard !== null && connectGameState === AsyncState.success) {
            if (currentGameData === currentGameDataRef.current) return
            currentGameDataRef.current = currentGameData

            switch (currentGameData.type) {
                case 'update_and_start':
                    myGameBoard.gameObjectManager.update(currentGameData.meta)
                    myGameBoard.gameObjectManager.update(currentGameData.meta)
                    break
                case 'update':
                    myGameBoard.gameObjectManager.update(currentGameData.meta)
                    break
                case 'add':
                    myGameBoard.gameObjectManager.add(currentGameData.meta)
                    break
                case 'delete':
                    myGameBoard.gameObjectManager.delete(currentGameData.meta)
                    break
                case 'chat':
                    setMessages(prev => [...prev, currentGameData.meta])
                    break
                case 'refresh':
                    setUsers(currentGameData.meta.active_users)
                    setMessages(currentGameData.meta.chat)
                    setIsGM(currentGameData.meta.is_gm)

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
                        : myGameBoard.map.set({ sprite: '../decorations/WorldMap.png' }, () =>
                            myGameBoard.gameObjectManager.refresh({
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
                    myGameBoard.map.set({ sprite: '../decorations/WorldMap.png' }, () => {
                        myGameBoard.gameObjectManager.refresh({
                            ...currentGameData.meta
                        })
                    })
                    setIsGlobal(true)
                    closeSidebar()
                    break
                case 'draw_pencil_started':
                    myGameBoard.drawing.pencilDown(currentGameData.meta)
                    break
                case 'draw_pencil_moved':
                    myGameBoard.drawing.pencilMove(currentGameData.meta)
                    break
                case 'draw_pencil_stopped':
                    myGameBoard.drawing.pencilUp(currentGameData.meta)
                    break
                case 'draw_eraser_started':
                    myGameBoard.drawing.eraserDown(currentGameData.meta)
                    break
                case 'draw_eraser_moved':
                    myGameBoard.drawing.eraserMove(currentGameData.meta)
                    break
                case 'draw_eraser_stopped':
                    myGameBoard.drawing.eraserUp(currentGameData.meta)
                    break
                case 'draw_polygon_started':
                    myGameBoard.drawing.polygonClickStart(currentGameData.meta)
                    break
                case 'draw_polygon_middle':
                    myGameBoard.drawing.polygonClickMiddle(currentGameData.meta)
                    break
                case 'draw_polygon_stopped':
                    myGameBoard.drawing.polygonClickEnd(currentGameData.meta)
                    break
                case 'draw_polygon_moved':
                    myGameBoard.drawing.polygonMove(currentGameData.meta)
                    break
                case 'draw_polygon_add':
                    myGameBoard.drawing.polygonAdd(currentGameData.meta)
                    break
                case 'region_obstacle_add':
                    myGameBoard.visibilityRegion.addObstacle(currentGameData.meta)
                    break
                case 'toggle_night':
                    myGameBoard.filter.night()
                    break
                case 'toggle_rain':
                    myGameBoard.filter.rain()
                    break
                case 'clear':
                    break
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

    useEffect(() => {
        if (connectGameState === AsyncState.error || connectGameState === AsyncState.unknown) {
            dispatch(connectGame(id))
        }
    }, [dispatch, connectGameState, id])

    if (orientation.device === 'mobile' && orientation.orientation === 'portrait') {
        return <FullscreenPage styles={{ color: primary50 }}>Please, rotate your device to landscape mode</FullscreenPage>
    }

    if (connectGameState === AsyncState.inProcess) {
        return <FullscreenLoader/>
    }

    if (connectGameState === AsyncState.error || connectGameState === AsyncState.unknown) {
        if (!currentGame || currentGame.invitation_code !== id) {
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
                    game={currentGame}
                    gameBoard={myGameBoard}
                    objectId={objectId}
                    isGM={isGM}
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
                        <BottomControlPanel
                            showControls={showControls}
                            onToggle={() => setShowControls(isOpen => !isOpen)}
                            game={currentGame}
                            users={users}
                            messages={messages}
                            hero={hero}
                            gameBoard={myGameBoard}
                            isGM={isGM}
                        />
                    </Hidden>
                </main>
                <Hidden mdDown={true}>
                    <MapControls boardRef={myGameBoard} isGM={isGM} />
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
                        invitation_code={currentGame ? currentGame.invitation_code || '' : ''}
                        users={users}
                        onSwitchGrid={() => myGameBoard && myGameBoard.map.switchGrid()}
                        gameBoard={myGameBoard}
                        isGM={isGM}
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
                            xy: myGameBoard ? [myGameBoard.map.width / 2, myGameBoard.map.height / 2] : [0, 0],
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