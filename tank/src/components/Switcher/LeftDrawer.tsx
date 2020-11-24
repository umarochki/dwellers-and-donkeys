import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { Theme } from '@material-ui/core'
import clsx from 'clsx'
import Switcher from './Switcher'

const drawerWidth = 296

const useStyles = makeStyles((theme: Theme) => ({
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
        flexDirection: 'column'
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
    }
}))

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
                variant="persistent"
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose
                    )
                }}
                open={open}
                onClose={toggleDrawer(false)}
            >
                <div className={classes.drawerInner} onClick={toggleDrawer(false)}/>
            </Drawer>
        </>
    )
}

export default LeftDrawer
