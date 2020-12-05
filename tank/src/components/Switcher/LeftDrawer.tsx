import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { GridList, GridListTile, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import Switcher, { MenuType } from './Switcher'

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
            // duration: 2000
        }),
        backgroundColor: '#43536B',
        color: '#FFF',
        overflow: 'hidden'
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
    }
}))

const markersList = [
    'markers/Bonfire.png',
    'markers/Castle.png',
    'markers/Tavern.png',
    'markers/Tree.png',
]

const mapsList = [
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
    'Tavern',
    'Whiteshadow',
    'Witchwyn',
]

const heroes = [
    'Ant',
    'Cat Smart',
    'Girl Strong',
    'Plant',
    'Snake03',
    'Troll',
    'Boy Cunning', 'Cat Strong', 'Goblin', 'Plant02', 'Snake04', 'Troll02',
    'Boy Smart',  'Dragon', 'Knight', 'Skeleton', 'Snake05', 'Wizard',
    'Boy Strong', 'Girl Cunning', 'Mummy', 'Snake', 'Spider', 'Wolf',
    'Cat Cunning', 'Girl Smart', 'Musician', 'Snake02', 'Thief'
]

const LeftDrawer: React.FC = () => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const [type, setType] = useState<MenuType>(MenuType.unselect)

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
            setOpen(true)
        } else {
            setType(MenuType.unselect)
            setOpen(false)
        }
    }, [type])

    const renderSidebar = useCallback((type: string) => {
        switch (type) {
            case MenuType.markers:
                return (
                    <GridList cellHeight={70} cols={3}>
                        {markersList.map((marker: string) => (
                            <Tooltip title={marker} key={marker}>
                                <GridListTile cols={1} className={classes.tile}>
                                    <img src={marker} alt={marker} draggable className="draggable" />
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )
            case MenuType.heroes:
                return (
                    <GridList cellHeight={70} cols={3}>
                        {heroes.map((hero: string) => (
                            <Tooltip title={hero} key={hero}>
                                <GridListTile cols={1} className={classes.tile}>
                                    <img src={`heroes/${hero}.png`} alt={hero} draggable className="draggable" />
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
                                <GridListTile cols={1} className={classes.tile}>
                                    <img src={`locations/${map}.png`} alt={map} draggable className="draggable" />
                                </GridListTile>
                            </Tooltip>
                        ))}
                    </GridList>
                )
        }
    }, [classes.tile])

    return (
        <>
            <Switcher
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
