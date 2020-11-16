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
}

export default createMuiTheme({ overrides, palette, typography })