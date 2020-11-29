import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import LeftDrawer from '../../components/Switcher/LeftDrawer'
import Card from '@material-ui/core/Card'

const drawerWidth = 240
// https://codesandbox.io/s/ykk2x8k7xj?file=/src/App/index.js
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100vh',
            zIndex: 1,
            overflow: 'hidden'
        },
        appFrame: {
            position: 'relative',
            display: 'flex',
            width: '100%',
            height: '100%'
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '-66px'
        },
        map: {
            flexGrow: 1,
            backgroundColor: 'green',
            marginBottom: '12px'
        },
        controls: {
            height: '238px',
            backgroundColor: '#334055',
            display: 'flex'
        },
        people: {
            width: '50%',
            display: 'flex',
            '& > *': {
                cursor: 'pointer',
                backgroundColor: '#43536B',
                margin: theme.spacing(1),
                width: theme.spacing(20),
                height: theme.spacing(27),
            },
        }
    }),
)

const Tabletop = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <LeftDrawer/>
                <main className={classes.content}>
                    <div className={classes.map}/>
                    <div className={classes.controls}>
                        <div className={classes.people}>
                            <Card raised/>
                            <Card />
                            <Card />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Tabletop