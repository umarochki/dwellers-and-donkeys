import React from 'react'
import { Button, FormControl, Grid, Input, InputLabel, Paper, } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center'
    },
    form: {
        width: '60%'
    },
    paper: {
        backgroundColor: '#FFF',
        padding: '15px'
    },
    inputLabel: {
        color: theme.palette.text.secondary
    }
}))

interface Props {
    onSubmit: () => void
    register: any
}

const GameInfoForm: React.FC<Props> = props => {
    const { onSubmit, register } = props
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <form className={classes.form} autoComplete="off">
                <Paper className={classes.paper}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="title" className={classes.inputLabel}>Название</InputLabel>
                        <Input id="title" type="text" inputRef={register}/>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel htmlFor="shortDesc" className={classes.inputLabel}>Краткое описание</InputLabel>
                        <Input id="shortDesc" type="text" inputRef={register}/>
                    </FormControl>

                    <Grid container justify="flex-end">
                        <Button variant="contained" color="primary" onClick={onSubmit}>
                            Дальше
                        </Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    )

}

export default GameInfoForm