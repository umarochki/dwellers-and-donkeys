import React, { useCallback } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InvitationCodeDialog from './InvitationCodeDialog'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttons: {
            marginTop: theme.spacing(4)
        }
    })
)

interface Props {
    className: string
    openWorldDialog: () => void
}

const StartPageHeader: React.FC<Props> = props => {
    const { className, openWorldDialog } = props
    const classes = useStyles()

    const [open, setOpen] = React.useState(false)
    const openInvitationCodeDialog = useCallback(() => setOpen(true), [])
    const closeInvitationCodeDialog = useCallback(() => setOpen(false), [])

    return (
        <div className={className}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Dwellers & Donkeys
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    This is currently the MVP version.<br/>Hope you enjoy!
                </Typography>
                <div className={classes.buttons}>
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={openWorldDialog}>
                                Create game
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={openInvitationCodeDialog}>
                                Join
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Container>
            <InvitationCodeDialog open={open} close={closeInvitationCodeDialog}/>
        </div>
    )
}

export default StartPageHeader