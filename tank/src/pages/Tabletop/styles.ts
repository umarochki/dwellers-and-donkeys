import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const drawerWidth = 240

export default makeStyles((theme: Theme) =>
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
            marginBottom: '12px'
        },
        controls: {
            height: '30%',
            backgroundColor: '#334055',
            display: 'flex'
        },
        people: {
            display: 'flex',
            height: '100%',
            padding: theme.spacing(1),
            marginRight: theme.spacing(1),
            '& > *': {
                cursor: 'pointer',
                backgroundColor: '#43536B',
                minWidth: theme.spacing(20),
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                paddingTop: theme.spacing(2),
                marginRight: theme.spacing(2)
            },
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        },
        controlPanel: {
            maxHeight: '100%'
        }
    }),
)
