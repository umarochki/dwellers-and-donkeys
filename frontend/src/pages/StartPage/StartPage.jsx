import React, { useCallback } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import InvitationCodeDialog from './InvitationCodeDialog'
import clsx from 'clsx'
import { primary200 } from '../../styles/colors'
import AddBoxIcon from '@material-ui/icons/AddBox'
import CardActionArea from '@material-ui/core/CardActionArea'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            UMR
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const useStyles = makeStyles(theme => ({
    addIcon: {
        fontSize: '4rem',
        color: primary200
    },
    content: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    subtitle: {
        color: '#E9EEFB',
        marginBottom: '20px'
    },
    date: {
        fontSize: '0.9rem'
    },
    addGame: {
        padding: '10px',
        height: '100%'
    },
    addGameInner: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        border: `4px ${primary200} dashed`
    }
}))

const cards = [1, 2]

const StartPage = () => {
    const classes = useStyles()
    const history = useHistory()
    const [open, setOpen] = React.useState(false)

    const openInvitationCodeDialog = useCallback(() => setOpen(true), [])
    const closeInvitationCodeDialog = useCallback(() => setOpen(false), [])

    return (
        <>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar/>
            </AppBar>
            <main>
                <div className={classes.content}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Dungeons & Dragons
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            В данный момент это MVP-версия.<br/>Надеемся, Вам понравится!
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={() => {
                                        history.push('new-game')
                                    }}>
                                        Создать партию
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary" onClick={openInvitationCodeDialog}>
                                        Присоединиться
                                    </Button>
                                    <InvitationCodeDialog open={open} close={closeInvitationCodeDialog}/>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    <Typography component="h3" variant="h5" className={classes.subtitle}>
                        Созданные игровые миры:
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={clsx(classes.card)}>
                                <CardActionArea className={classes.addGame}>
                                    <div className={classes.addGameInner}>
                                        <AddBoxIcon  className={classes.addIcon}/>
                                    </div>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        {cards.map(card => (
                            <Grid item key={card} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image="https://source.unsplash.com/random"
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom>
                                                Шахты
                                            </Typography>
                                            <Typography color="textSecondary" className={classes.date}>
                                                Дата создания: 20.01.20
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Grid container justify="space-between">
                                                <Button color="primary" variant="text">
                                                    Редактировать
                                                </Button>
                                                <Button color="primary" variant="contained">
                                                    Играть
                                                </Button>
                                            </Grid>
                                        </CardActions>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    U M R Team
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Здесь нет ничего важного.
                </Typography>
                <Copyright/>
            </footer>
        </>
    )
}

export default StartPage