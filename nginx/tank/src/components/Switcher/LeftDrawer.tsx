import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { GridList, GridListTile, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import Switcher, { MenuType } from './Switcher'
// @ts-ignore
import LazyLoad from 'react-lazy-load'
import ImageLoader from '../Containers/ImageLoader'
import { primary200, primary900 } from '../../styles/colors'

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
    }
}))

export const markersList = [
    'Bonfire',
    'Castle',
    'Tavern',
    'Tree',
]

export const mapsList = [
    'Bayport',
    'Blackacre',
    'Campfire',
    'Deerbarrow',
    'Loredge_Falls',
    'Loredge_Springs',
    'Lorness',
    'Normoor',
    'Ostton',
    'OsttonCursed',
    'OsttonMud',
    'Summerwitch',
    'TavernHouse',
    'Whiteshadow',
    'Witchwyn',
]

export const heroes = [
    'Ant',
    'Cat Smart',
    'Girl Strong',
    'Plant',
    'Snake03',
    'Troll',
    'Boy Cunning', 'Cat Strong', 'Goblin', 'Plant02', 'Snake04', 'Troll02',
    'Boy Smart', 'Dragon', 'Knight', 'Skeleton', 'Snake05', 'Wizard',
    'Boy Strong', 'Girl Cunning', 'Mummy', 'Snake', 'Spider', 'Wolf',
    'Cat Cunning', 'Girl Smart', 'Musician', 'Snake02', 'Thief'
]

export const globalSymbols = [
    'Bones1',
    'Bones2',
    'Bones3',
    'Chest',
    'City',
    'Dot',
    'Dungeon1',
    'Dungeon2',
    'Dungeon3',
    'Finsh',
    'Fire',
    'Flag',
    'Grass1',
    'Grass2',
    'Grass3',
    'Grass4',
    'Grass5',
    'Grass6',
    'Hill1',
    'Hill2',
    'Hill3',
    'Lake1',
    'Lake2',
    'Lake3',
    'Mountain1',
    'Mountain2',
    'Mountain3',
    'Mountain4',
    'Mountain5',
    'Start',
    'Swamp1',
    'Swamp2',
    'Tower1',
    'Tower2',
    'Tree1',
    'Tree2',
    'Tree3',
    'Tree4'
]

interface Props {
    onOpen: Function
    onMapChange: (map: string) => void
    onOpenGlobalCard: () => void
    global: boolean
    open: boolean
    setOpen: (v: boolean) => void
    type: MenuType
    setType: (v: MenuType) => void
}

const LeftDrawer: React.FC<Props> = props => {
    const { onOpen, onMapChange, onOpenGlobalCard, global, open, setOpen, type, setType } = props
    const classes = useStyles()

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

    const handleMapClick = useCallback((map: string) => () => {
        onMapChange(map)
    }, [onMapChange])

    React.useEffect(() => {
        if (open === true) {
            onOpen()
        }
    }, [type, open, onOpen])

    const renderSidebar = useCallback((type: string) => {
        switch (type) {
            case MenuType.markers:
                return (
                    <GridList cellHeight={70} cols={3} className={classes.gridList}>
                        {markersList.map((marker: string) => (
                            <Tooltip title={marker} key={marker}>
                                <GridListTile cols={1} className={classes.tile}>
                                    <ImageLoader src={`/markers/${marker}.png`} draggable marker/>
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )
            case MenuType.heroes:
                return (
                    <GridList cellHeight={70} cols={3} className={classes.gridList}>
                        {heroes.map((hero: string) => (
                            <Tooltip title={hero} key={hero}>
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
                        {mapsList.map((map: string) => (
                            <Tooltip title={map} key={map}>
                                <GridListTile cols={1} className={classes.tile} onClick={handleMapClick(map)}>
                                    <LazyLoad
                                        width={233}
                                        height={100}
                                        debounce={false}
                                    >
                                        <ImageLoader src={`/locations/${map}.png`}/>
                                    </LazyLoad>
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )
            case MenuType.globalSymbols:
                return (
                    <GridList cellHeight={70} cols={3}>
                        {globalSymbols.map((globalSymbol: string) => (
                            <Tooltip title={globalSymbol} key={globalSymbol}>
                                <GridListTile cols={1} className={classes.tile}>
                                    <ImageLoader src={`/globalSymbols/${globalSymbol}.png`} draggable marker/>
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )
        }
    }, [classes.tile, handleMapClick, classes.gridList])

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
        </>
    )
}

export default LeftDrawer
