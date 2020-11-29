import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { Theme, GridList, GridListTile } from '@material-ui/core'
import clsx from 'clsx'
import Switcher from './Switcher'
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

const LeftDrawer: React.FC = () => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }
        setOpen(open)
    }

    return (
        <>
            <Switcher onClick={toggleDrawer(true)}/>
            <Drawer
                onEscapeKeyDown={() => setOpen(false)}
                onBackdropClick={() => setOpen(false)}
                anchor="left"
                variant="permanent"
                className={classes.drawer}
                // modal={true}
                // BackdropProps={{ invisible: true }}
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose
                    )
                }}
                open={open}
                onClose={toggleDrawer(false)}
            >
                <div className={classes.drawerInner} onClick={toggleDrawer(false)}>
                    {/*<GridList cellHeight={70} cols={3}>*/}
                    {/*    {markersList.map((marker: string) => (*/}
                    {/*        <GridListTile key={marker} cols={1} className={classes.tile}>*/}
                    {/*            <img src={marker} alt={marker} />*/}
                    {/*        </GridListTile>*/}
                    {/*    ))}*/}
                    {/*</GridList>*/}
                    <GridList cellHeight={100} cols={1}>
                        {mapsList.map((map: string) => (
                            <GridListTile key={map} cols={1} className={classes.tile}>
                                <img src={`locations/${map}.png`} alt={map} />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </Drawer>
        </>
    )
}

export default LeftDrawer
