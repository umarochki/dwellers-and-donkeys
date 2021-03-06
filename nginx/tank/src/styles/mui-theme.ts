import { createMuiTheme } from '@material-ui/core/styles'
import { primary500, primary600 } from './colors'

const palette = {
    primary: {
        light: '#808fa7',
        main: '#617492',
        dark: '#435166',
        contrastText: '#fff',
    },
    secondary: {
        light: '#5a94af',
        main: '#81d4fa',
        dark: '#9adcfb',
        contrastText: '#000',

    },
    white: { main: '#fff', contrastText: '#fff' },
    fontFamily: 'Roboto',
    background: {
        paper: '#E9EEFB',
        default: '#212C3D',
    },
    text: {
        primary: '#000000',
        secondary: '#617492'
    }
}

const typography = {
    h1: {
        fontSize: '3rem',
    },
    h2: {
        fontSize: '2rem',
    },
    h3: {
        fontSize: '1.64rem',
    },
    h4: {
        fontSize: '1.5rem',
    },
    h5: {
        fontSize: '1.285rem',
    },
    h6: {
        fontSize: '1.142rem',
    },
}

const overrides = {
    MuiButton: {
        root: {
            '&:hover': {
                // backgroundColor: '#7888A4',
                // color: lightBlue[500]
            }
        },
        outlined: {
            borderWidth: 2,
        },
        outlinedSecondary: {
            borderWidth: 2,
        }
    },
    MuiAppBar: {
        root: {
            zIndex: 1,
        },
    },
    MuiCssBaseline: {
        '@global': {
            '*::-webkit-scrollbar': {
                width: '0.5em',
                backgroundColor: primary600
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                backgroundColor: primary600
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: primary500,
                outline: '2px solid #555'
            }
        }
    }
}

const breakpoints = {
    values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1400,
        xl: 1920
    }
}

export default createMuiTheme({ overrides, palette, typography, breakpoints })