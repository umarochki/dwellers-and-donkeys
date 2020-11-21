import { createMuiTheme } from '@material-ui/core/styles'

const palette = {
    primary: { main: '#334055', contrastText: '#FFF' },
    secondary: { main: '#FFCC00', contrastText: '#333' },
    white: { main: '#fff', contrastText: '#fff' },
    fontFamily: 'Roboto',
    background: {
        paper: '#E9EEFB',
        default: '#212C3D',
    },
}

const typography = {
    'body1': {
        'color': '#000',
        'fontFamily': "'Proxima Nova', helvetica, sans-serif",
        'lineHeight': 1.3,
        'fontSize': 18,
        'fontWeight': 400,
        'marginTop': 0,
        'marginBottom': 16,
    }
}
const overrides = {
    MuiButton: {
        root: {
        },
        outlined: {
            borderWidth: 2,
        },
        outlinedSecondary: {
            borderWidth: 2,
        },
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
                backgroundColor: '#F5F5F5'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                backgroundColor: '#F5F5F5'
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: '#43536B',
                outline: '2px solid #555'
            }
        }
    }
}

export default createMuiTheme({ overrides, palette, typography })