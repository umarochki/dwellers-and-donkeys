import React from 'react'
import Grid from '@material-ui/core/Grid'
import { CircularProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    loader: {
        marginLeft: theme.spacing(4),
    }
}))

const FullscreenLoader: React.FC = () => {
    const classes = useStyles()

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={3}>
                <CircularProgress size={45} className={classes.loader}/>
            </Grid>
        </Grid>
    )
}

export default FullscreenLoader