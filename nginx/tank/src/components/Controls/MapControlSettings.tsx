import React from 'react'
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Avatar, FormControl, InputBase, MenuItem, Select, Theme } from '@material-ui/core'
import { primary200, primary500, primary900 } from '../../styles/colors'

const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: primary200,
            border: '1px solid ' + primary500,
            fontSize: 16,
            padding: '10px 26px 10px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(',')
        },
    }),
)(InputBase)

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        minWidth: 275,
        backgroundColor: primary200
    },
    title: {
        fontSize: 14,
        color: primary900
    },
    margin: {
        margin: theme.spacing(1),
    }
}))

interface Props {
    currentColor: string
    currentSize: number
    onColorChange: (color: Color) => void
    onSizeChange: (size: number) => void
    size?: boolean
}

export enum Color {
    DeepOrange = '#ff5722',
    DeepPurple = '#673ab7',
    Red = '#ff0000',
    Green = '#4caf50',
    Blue = '#2196f3'
}

const colors = [
    Color.DeepOrange,
    Color.DeepPurple,
    Color.Red,
    Color.Green,
    Color.Blue
]

const MapControlSettings: React.FC<Props> = props => {
    const classes = useStyles()
    const { currentColor, currentSize, onColorChange, onSizeChange, size = true } = props

    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        onSizeChange(e.target.value as number)
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} gutterBottom>
                    Color:
                </Typography>
                <Grid container justify="space-between" alignItems="center" style={{ marginBottom: 20 }}>
                    {colors.map(color => (
                        <Avatar
                            onClick={() => onColorChange(color)}
                            style={{
                                backgroundColor: color,
                                color: color === currentColor ? 'black' : color,
                                cursor: 'pointer',
                                border: '2px solid #617492'
                            }}
                        />
                    ))}
                </Grid>
                {size && (<>
                    <Typography className={classes.title} gutterBottom>
                        Size:
                    </Typography>
                    <FormControl className={classes.margin}>
                        <Select
                            labelId="select-label"
                            id="customized-select"
                            value={currentSize}
                            onChange={handleChange}
                            input={<BootstrapInput/>}
                        >
                            <MenuItem value={1}>1px</MenuItem>
                            <MenuItem value={2}>2px</MenuItem>
                            <MenuItem value={3}>3px</MenuItem>
                            <MenuItem value={4}>4px</MenuItem>
                            <MenuItem value={5}>5px</MenuItem>
                        </Select>
                    </FormControl>
                </>)}
            </CardContent>
        </Card>
    )
}

export default MapControlSettings