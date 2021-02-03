import React, { useCallback, useMemo, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Container from '@material-ui/core/Container'
import GameGallery from './GameGallery'
import { makeStyles } from '@material-ui/core/styles'
import CustomizedStepper, { StepItem } from '../../components/Stepper/CustomizedStepper'
import { useForm } from 'react-hook-form'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import GameInfoForm from './GameInfoForm'
import GameInfoSubmit from './GameInfoSubmit'
import { Game } from '../../models/game'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const useStyles = makeStyles(theme => ({
    content: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 6),
        minHeight: 'calc(100vh - 64px)'
    },
    button: {
    },
}))

const GameCreationPage: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const handleReturn = useCallback(() => history.push(''), [history])

    const [activeStep, setActiveStep] = React.useState(0)

    const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1)
    // const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1)
    // const handleReset = () => setActiveStep(0)

    const { register, handleSubmit, setValue, getValues } = useForm<Game>({
        shouldUnregister: false
    })

    // const onSubmit = data => console.log('data', data)

    const handleChooseMap = useCallback((mapId: string) => {
        setValue('map', mapId)
        handleNext()
    }, [setValue])

    const steps = useMemo<StepItem[]>(() => [
        { name: 'Название сессии игры', onClick: () => setActiveStep(0) },
        { name: 'Выбор игрового мира', onClick: () => setActiveStep(1) },
        { name: 'Подтверждение', onClick: () => setActiveStep(2) }
    ], [])

    const getStepContent = useCallback((step: number) => {
        switch (step) {
            case 0:
                return <GameInfoForm onSubmit={handleNext} register={register} />
            case 1:
                return <GameGallery onChoose={handleChooseMap}/>
            case 2:
                return <GameInfoSubmit onCancel={handleReturn} onSubmit={handleSubmit} game={getValues()}/>
            default:
                return null
        }
    }, [getValues, handleChooseMap, handleReturn, handleSubmit, register])

    useEffect(() => {
        register('map')
    }, [register])
    
    return (
        <>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar>
                    <Button onClick={handleReturn} variant="contained">
                        <ArrowBackIosIcon fontSize="small" />Вернуться
                    </Button>
                </Toolbar>
            </AppBar>
            <main>
                <div className={classes.content}>
                    <Container maxWidth="md">
                        <CustomizedStepper activeStep={activeStep} stepContent={getStepContent} steps={steps} />
                    </Container>
                </div>
            </main>
        </>
    )
}

export default GameCreationPage