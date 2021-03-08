import React from 'react'
import Grid from '@material-ui/core/Grid'

const FullscreenLoader: React.FC = ({ children }) => (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
    >
        <Grid item xs={3}>
            {children}
        </Grid>
    </Grid>
)

export default FullscreenLoader