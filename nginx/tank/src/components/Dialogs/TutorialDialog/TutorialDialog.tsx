import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import addMap from './add_map.jpg'
import dices from './dices.jpg'
import character from './character.jpg'
import invite from './invite.png'
import switcher from './switcher.jpg'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30
    },
    image: {
        maxWidth: '90%',
        marginBottom: 15
    },
    text: {
        fontSize: '1.1rem'
    }
}))

interface Props {
    open: boolean
    onClose: () => void
}

const TutorialDialog: React.FC<Props> = props => {
    const classes = useStyles()
    const { open, onClose } = props

    return (
        <Dialog open={open}>
            <DialogTitle id="dialog-title">Quick Tutorial</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{}</DialogContentText>

                <div className={classes.item}>
                    <img className={classes.image} src={switcher} alt="switcher" />
                    <div className={classes.text}>Sidebar menu</div>
                </div>

                <div className={classes.item}>
                    <img className={classes.image} src={addMap} alt="add map" />
                    <div className={classes.text}>You can upload new map (1) or choose existed one (2)</div>
                </div>

                <div className={classes.item}>
                    <img className={classes.image} src={character} alt="character" />
                    <div className={classes.text}>You can choose character and move to map</div>
                </div>

                <div className={classes.item}>
                    <img className={classes.image} src={dices} alt="dices" />
                    <div className={classes.text}>To roll a dice, select the dice types in the right panel and click "ROLL"</div>
                </div>

                <div className={classes.item}>
                    <img className={classes.image} src={invite} alt="invite" />
                    <div className={classes.text}>Click on "INVITE" to get invitation link</div>
                </div>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    Accept
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TutorialDialog