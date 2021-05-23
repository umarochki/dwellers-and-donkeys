import React, { useCallback, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { GridList, GridListTile, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import Switcher, { MenuType } from './Switcher'
// @ts-ignore
import LazyLoad from 'react-lazy-load'
import ImageLoader from '../common/ImageLoader'
import { primary200, primary900 } from '../../styles/colors'
import Zoom from '@material-ui/core/Zoom'
import AddCard from '../Cards/AddCard'
import AddMapDialog from '../Dialogs/AddMapDialog'
import { useSelector } from 'react-redux'
import { selectMaps } from '../../store/map/selectors'
import { Game } from '../../models/game'
import MapCard from '../Cards/MapCard'
import { globalSymbols, heroes, markersList } from './icons'

const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) => ({
    drawer: {
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
    },
    drawerPaper: {
        position: 'relative',
        height: '100%',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        backgroundColor: '#43536B',
        color: '#FFF',
        overflow: 'hidden'
    },
    drawerPaperLight: {
        borderRight: `4px solid ${primary900}`,
        backgroundColor: primary200,
    },
    drawerPaperClose: {
        width: 60,
        overflowX: 'hidden',
        // Drawer - closing
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
            // duration: 2000
        })
    },
    drawerInner: {
        // Make the items inside not wrap when transitioning:
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 60,
        paddingTop: theme.spacing(1)
    },
    flexGrow: {
        flexGrow: 1
    },
    list: {
        flexGrow: 0
    },
    nested: {
        paddingLeft: theme.spacing() * 4
    },
    listSubheader: {
        textAlign: 'left',
        fontWeight: 'bold'
    },
    tile: {
        objectFit: 'contain'
    },
    gridList: {
        padding: '0 5px'
    },
    mapCard: {
        maxWidth: 280,
        margin: '5px 10px'
    }
}))

const useTooltipStyles = makeStyles(() =>
    ({
        tooltip: {
            maxWidth: '200px',
        },
        tooltipPlacementTop: {
            margin: '2px 0',
        },
        tooltipPlacementBottom: {
            margin: '4px 0',
        },
    })
)

interface Props {
    onOpen: Function
    onMapChange: (map: string) => void
    onOpenGlobalCard: () => void
    global: boolean | null
    open: boolean
    setOpen: (v: boolean) => void
    type: MenuType
    setType: (v: MenuType) => void
    selectedMaps: string[]
    game?: Game
}

interface MapMapType {
    [key: string]: {
        file: string
        name: string
    }
}

const LeftDrawer: React.FC<Props> = props => {
    const { onOpen, onMapChange, onOpenGlobalCard, global, open, setOpen, type, setType, selectedMaps, game } = props
    const classes = useStyles()
    const classesTooltip = useTooltipStyles()
    const mapsList = useSelector(selectMaps)

    const mapsToAdd = useMemo(() => {
        return mapsList.filter(m => !selectedMaps.find(map => m.hash === map))
    }, [selectedMaps, mapsList])

    const mapMap = useMemo<MapMapType>(() =>
        mapsList.reduce((obj, map) => {
            obj[map.hash] = {
                file: map.file,
                name: map.name
            }
            return obj
        }, {} as MapMapType), [mapsList])

    const [openAddMap, setOpenAddMap] = useState(false)

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }
        setOpen(open)
    }

    const handleSelect = useCallback((selectedType: MenuType) => {
        if (type !== selectedType) {
            setType(selectedType)

            if (selectedType === MenuType.global) {
                onOpenGlobalCard()
                setType(MenuType.unselect)
                setOpen(false)
            } else {
                setOpen(true)
            }
        } else {
            if (selectedType !== MenuType.global) {
                setType(MenuType.unselect)
                setOpen(false)
            }
        }
    }, [type, onOpenGlobalCard, setOpen, setType])

    const handleMapClick = (map: string) => () => {
        onMapChange(map)
    }

    React.useEffect(() => {
        if (open === true) {
            onOpen()
        }
    }, [type, open, onOpen])

    const renderSidebar = (type: string) => {
        switch (type) {
            case MenuType.markers:
                return (
                    <GridList cellHeight={70} cols={3} className={classes.gridList}>
                        {markersList.map((marker: string) => (
                            <Tooltip classes={classesTooltip} TransitionComponent={Zoom} title={marker} key={marker}>
                                <GridListTile cols={1} className={classes.tile}>
                                    <ImageLoader src={`/markers/${marker}.png`} marker draggable/>
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )
            case MenuType.heroes:
                return (
                    <GridList cellHeight={70} cols={3} className={classes.gridList}>
                        {heroes.map((hero: string) => (
                            <Tooltip classes={classesTooltip} TransitionComponent={Zoom} title={hero} key={hero}>
                                <GridListTile cols={1} className={classes.tile}>
                                    <ImageLoader src={`/heroes/${hero}.png`} draggable/>
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )
            case MenuType.locations:
                return (
                    <GridList cellHeight={100} cols={1}>
                        {selectedMaps.map((map: string) => (
                            mapMap[map] && <Tooltip classes={classesTooltip} TransitionComponent={Zoom} title={mapMap[map].name} key={map}>
                                <GridListTile cols={1} className={classes.tile} onClick={handleMapClick(map)}>
                                    <LazyLoad
                                        width={233}
                                        height={100}
                                        debounce={false}
                                    >
                                        <ImageLoader src={mapMap[map].file}/>
                                    </LazyLoad>
                                </GridListTile>
                            </Tooltip>
                        ))}
                        <GridListTile cols={1} className={classes.tile} onClick={() => {
                            setOpenAddMap(true)
                        }}>
                            <AddCard />
                        </GridListTile>
                    </GridList>
                )
            case MenuType.globalSymbols:
                return (
                    <GridList cellHeight={70} cols={3}>
                        {globalSymbols.map((globalSymbol: string) => (
                            <Tooltip classes={classesTooltip} TransitionComponent={Zoom} title={globalSymbol} key={globalSymbol}>
                                <GridListTile cols={1} className={classes.tile}>
                                    <ImageLoader src={`/globalSymbols/${globalSymbol}.png`} marker draggable/>
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )

            case MenuType.info:
                if (!game) return null
                return (
                    <MapCard card={game} className={classes.mapCard} />
                )
        }
    }

    return (
        <>
            <Switcher
                global={global}
                currentType={type}
                close={toggleDrawer(false)}
                onSelect={handleSelect}
            />
            <Drawer
                anchor="left"
                variant="permanent"
                className={classes.drawer}
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        type !== MenuType.locations && classes.drawerPaperLight,
                        !open && classes.drawerPaperClose
                    )
                }}
                open={open}
                onClose={toggleDrawer(false)}
            >
                <div className={classes.drawerInner}>
                    {renderSidebar(type)}
                </div>
            </Drawer>
            <AddMapDialog
                open={openAddMap}
                onClose={() => setOpenAddMap(false)}
                onChoose={(id: string) => handleMapClick(id)()}
                maps={mapsToAdd}
            />
        </>
    )
}

export default LeftDrawer
