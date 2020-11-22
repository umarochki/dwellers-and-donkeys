import React, { useCallback } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import InvitationCodeDialog from './InvitationCodeDialog'
import { useHistory } from 'react-router-dom'
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
}

const StartPageHeader: React.FC<Props> = props => {
    const { className } = props
    const classes = useStyles()
    const history = useHistory()
    const handleNewGame = useCallback(() => history.push('new-game'), [history])

    const [open, setOpen] = React.useState(false)
    const openInvitationCodeDialog = useCallback(() => setOpen(true), [])
    const closeInvitationCodeDialog = useCallback(() => setOpen(false), [])

    return (
        <div className={className}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Dungeons & Dragons
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    В данный момент это MVP-версия.<br/>Надеемся, Вам понравится!
                </Typography>
                <div className={classes.buttons}>
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleNewGame}>
                                Создать партию
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={openInvitationCodeDialog}>
                                Присоединиться
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