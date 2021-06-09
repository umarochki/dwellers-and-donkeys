import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { primary400, primary700 } from '../../styles/colors'

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
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            flexGrow: 1,
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '10px'
        },
        map: {
            width: '100%',
            height: '100%',
            flexGrow: 1,
            marginBottom: '12px',
            overflow: 'hidden'
        },
        mapBtn: {
            width: 70,
            height: 70,
            backgroundColor: primary700,
            borderRadius: '50%',
            boxShadow: '0 6px 10px 0 #1c1c1c',
            fontSize: '50px',
            lineHeight: '60px',
            color: primary400,
            textAlign: 'center',
            position: 'fixed',
        },
        deleteBtn: {
            right: 25,
            top: 25,
            opacity: 0.6,
            [theme.breakpoints.down('md')]: {
                top: 'auto',
                bottom: 25,
                marginLeft: 'auto',
                marginRight: 'auto',
                left: 0,
                right: 0,
                textAlign: 'center'
            }
        },
        mapIcon: {
            width: '1em',
            height: '1.35em',
            fontSize: '3.3rem'
        }
    })
)
