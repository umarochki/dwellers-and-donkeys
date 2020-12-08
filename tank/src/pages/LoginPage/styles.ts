import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import bg from '../../assets/Sword Coast.png'
import { primary200, primary400, primary50 } from '../../styles/colors'

export default makeStyles((theme: Theme) => ({
    image: {
        backgroundImage: `url("${bg}")`,
        backgroundSize: 'cover',
        filter: 'brightness(70%)',
    },
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    logotypeContainer: {
        backgroundColor: theme.palette.primary.main,
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            width: '50%',
        },
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    logotypeImage: {
        width: 165,
        marginBottom: theme.spacing(4),
    },
    logotypeText: {
        color: 'white',
        fontWeight: 500,
        fontSize: 84,
        [theme.breakpoints.down('md')]: {
            fontSize: 48,
        },
        backgroundColor: 'rgba(67, 81, 102, 0.6)',
        width: '100%',
        textAlign: 'center',
        lineHeight: 2
    },
    formContainer: {
        width: '40%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            width: '50%',
        },
    },
    form: {
        width: 320,
        minHeight: 490
    },
    tab: {
        fontWeight: 400,
        fontSize: 18,
    },
    googleButton: {
        marginTop: theme.spacing(6),
        backgroundColor: primary50,
        width: '100%',
        textTransform: 'none',
    },
    googleButtonCreating: {
        marginTop: 0,
    },
    googleIcon: {
        width: 30,
        marginRight: theme.spacing(2),
    },
    creatingButtonContainer: {
        marginTop: theme.spacing(2.5),
        height: 46,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAccountButton: {
        height: 46,
        textTransform: 'none',
        '&:disabled': {
            color: primary400
        }
    },
    formDividerContainer: {
        marginTop: theme.spacing(4),
        display: 'flex',
        alignItems: 'center',
    },
    formDividerWord: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        color: primary200
    },
    formDivider: {
        flexGrow: 1,
        height: 1,
        backgroundColor: theme.palette.text.hint + '40',
    },
    textFieldUnderline: {
        '&:before': {
            borderBottomColor: theme.palette.primary.light,
        },
        '&:after': {
            borderBottomColor: theme.palette.primary.main,
        },
        '&:hover:before': {
            borderBottomColor: `${theme.palette.primary.light} !important`,
        },
    },
    textField: {
        color: primary200
    },
    formButtons: {
        width: '100%',
        marginTop: theme.spacing(4),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    forgetButton: {
        textTransform: 'none',
        fontWeight: 400,
    },
    marginBottom: {
        marginBottom: theme.spacing(4),
    },
    marginTop: {
        marginTop: theme.spacing(4),
    }
}))
