import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import LeftDrawer from '../../components/Switcher/LeftDrawer'
import { Grid } from '@material-ui/core'
import UserCard from '../../components/Controls/UserCard'
import PersonCard from '../../components/Controls/PersonCard'
import ChatPanel from '../../components/Controls/ChatPanel'
import clsx from 'clsx'
import Gameboard from 'gameboard/src/Board'

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
            paddingLeft: '10px'
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
            display: 'flex',
            '& > *': {
                cursor: 'pointer',
                backgroundColor: '#43536B',
                margin: theme.spacing(1),
                minWidth: theme.spacing(20),
                height: theme.spacing(27),
                display: 'flex',
                alightItems: 'center',
                justifyContent: 'center',
                direction: 'column',
                paddingTop: theme.spacing(2)
            },
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        }
    }),
)

const Tabletop = () => {
    const classes = useStyles()

    const divRef = React.useRef()    // Ссылка на родителя холста
    const boardRef = React.useRef()  // Ссылка на игровое поле

    React.useEffect(() => {

        const gameboard = new Gameboard({
            parent: divRef.current,
            // width: { number },
            // height: { number },
            transparent: true,
            // backgroundColor: {string}
            // resizeTo: {HTMLElement}
            // TODO: isGameMaster: {boolean}, 

        })

        // Грузим холст и статики (пока так)
        gameboard.preload(() => {
            // Устанавливаем мапу
            gameboard.setMap('MAP_IMAGE_PATH', () => {
                // Сохраняем ссылку
                boardRef.current = gameboard
            })
        })

    }, [])

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <LeftDrawer/>
                <main className={classes.content}>
                    <div className={clsx(classes.map, 'draggable')}>
                        <div ref={divRef}/>
                    </div>
                    <div className={classes.controls}>
                        <Grid container spacing={3}>
                            <Grid item xs={5}>
                                <div className={classes.people}>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                    <PersonCard/>
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <UserCard/>
                            </Grid>
                            <Grid item xs>
                                <ChatPanel />
                            </Grid>
                        </Grid>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Tabletop