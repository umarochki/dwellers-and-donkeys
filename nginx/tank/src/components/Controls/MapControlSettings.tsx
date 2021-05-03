import React from 'react'
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Avatar, FormControl, InputBase, MenuItem, Select, Theme } from '@material-ui/core'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import blue from '@material-ui/core/colors/blue'
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

}

const colors = [
    deepOrange[500],
    deepPurple[500],
    red[500],
    green[500],
    blue[500]
]

const MapControlSettings: React.FC<Props> = () => {
    const classes = useStyles()

    const [size, setSize] = React.useState(1)
    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        setSize(e.target.value as number)
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} gutterBottom>
                    Color:
                </Typography>
                <Grid container justify="space-between" alignItems="center" style={{ marginBottom: 20 }}>
                    {colors.map(color => (
                        <Avatar style={{ backgroundColor: color, color: color, cursor: 'pointer', border: '2px solid #617492' }} />
                    ))}
                </Grid>
                <Typography className={classes.title} gutterBottom>
                    Size:
                </Typography>
                <FormControl className={classes.margin}>
                    <Select
                        labelId="select-label"
                        id="customized-select"
                        value={size}
                        onChange={handleChange}
                        input={<BootstrapInput />}
                    >
                        <MenuItem value={1}>1px</MenuItem>
                        <MenuItem value={2}>2px</MenuItem>
                        <MenuItem value={3}>3px</MenuItem>
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    )
}

export default MapControlSettings