import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FullscreenPage from './FullscreenPage'

const useStyles = makeStyles((theme: Theme) => createStyles({
    loader: {
        marginLeft: theme.spacing(4),
    }
}))

const FullscreenLoader: React.FC = () => {
    const classes = useStyles()

    return (
        <FullscreenPage>
            <CircularProgress size={45} className={classes.loader}/>
        </FullscreenPage>
    )
}

export default FullscreenLoader