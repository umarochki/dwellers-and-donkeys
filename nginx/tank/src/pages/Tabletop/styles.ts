import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { primary400, primary50, primary600, primary700, primary800, primary900 } from '../../styles/colors'

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
            marginBottom: '12px',
            overflow: 'hidden'
        },
        controls: {
            position: 'relative',
            height: '30%',
            backgroundColor: '#334055',
            display: 'flex',
            transition: 'bottom .5s cubic-bezier(0.820, 0.085, 0.395, 0.895)',
            bottom: 0
        },
        mapControls: {
            display: 'flex',
            position: 'fixed',
            left: 'calc(50% - 70px)',
            top: 10,
            backgroundColor: primary600
        },
        mapControl: {
            border: `1px solid ${primary900}`,
            padding: '5px 10px 2px',
            transition: '.3s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: primary700
            }
        },
        mapControlIcon: {

        },
        hideControls: {
            bottom: 'calc(-30% - 16px)'
        },
        people: {
            display: 'flex',
            height: '100%',
            padding: theme.spacing(1),
            marginRight: theme.spacing(1),
            '& > *': {
                cursor: 'pointer',
                backgroundColor: '#43536B',
                width: theme.spacing(20),
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
            top: 115,
            opacity: 0.4,
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
        },
        drawerBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            borderRadius: '10px 10px 0 0',
            top: -35,
            width: 60,
            height: 35,
            border: `solid 2px ${primary600}`,
            borderBottom: 'none'
        },
        closeButton: {
            backgroundColor: primary800
        },
        closeIcon: {
            transform: 'rotate(270deg)',
            marginTop: 0,
            marginBottom: 10,
            transition: 'transform .5s ease',
            color: primary50
        },
        closeIconClosed: {
            transform: 'rotate(90deg)',
            marginTop: 20
        }
    })
)
