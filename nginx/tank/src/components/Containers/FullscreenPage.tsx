import React, { CSSProperties } from 'react'
import Grid from '@material-ui/core/Grid'

interface Props {
    styles?: CSSProperties
}

const FullscreenPage: React.FC<Props> = ({ children, styles }) => (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh', textAlign: 'center', ...styles }}
    >
        <Grid item xs={5}>
            {children}
        </Grid>
    </Grid>
)

export default FullscreenPage