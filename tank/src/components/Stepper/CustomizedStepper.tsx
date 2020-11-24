import React from 'react'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Check from '@material-ui/icons/Check'
import StepConnector from '@material-ui/core/StepConnector'
import Typography from '@material-ui/core/Typography'
import { StepIconProps } from '@material-ui/core/StepIcon'
import { primary200 } from '../../styles/colors'

const Connector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    active: {
        '& $line': {
            borderColor: '#334055',
        },
    },
    completed: {
        '& $line': {
            borderColor: '#43536B',
        },
    },
    line: {
        borderColor: primary200,
        borderTopWidth: 3,
        borderRadius: 1,
    },
})(StepConnector)

const useStepIconStyles = makeStyles({
    root: {
        color: primary200,
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: '#43536B',
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: '#43536B',
        zIndex: 1,
        fontSize: 18,
    }
})

function StepIcon(props: StepIconProps) {
    const classes = useStepIconStyles()
    const { active, completed } = props

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        button: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        stepLabel: {
            cursor: 'pointer',
            '&:hover': {
                color: '#FFF'
            }
        }
    }),
)

export interface StepItem {
    onClick?: Function
    name: string
}

interface Props {
    activeStep: number
    stepContent: (step: number) => JSX.Element | null
    steps: StepItem[]
}

const CustomizedStepper: React.FC<Props> = props => {
    const { activeStep, stepContent, steps } = props
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<Connector />}>
                {steps.map((step: StepItem) => (
                    <Step key={step.name} className={classes.stepLabel}>
                        <StepLabel StepIconComponent={StepIcon} onClick={() => step.onClick && step.onClick()}>
                            {step.name}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>
                            All steps completed - you&apos;re finished
                        </Typography>
                    </div>
                ) : (
                    <div >
                        <Typography className={classes.instructions}>{stepContent(activeStep)}</Typography>
                        <div>
                            {/*<Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>*/}
                            {/*    Back*/}
                            {/*</Button>*/}
                            {/*<Button*/}
                            {/*    variant="contained"*/}
                            {/*    color="primary"*/}
                            {/*    onClick={handleNext}*/}
                            {/*    className={classes.button}*/}
                            {/*>*/}
                            {/*    {activeStep === stepNames.length - 1 ? 'Finish' : 'Next'}*/}
                            {/*</Button>*/}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomizedStepper