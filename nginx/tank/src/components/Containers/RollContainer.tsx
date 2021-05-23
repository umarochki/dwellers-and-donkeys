import React from 'react'
import { RollType } from '../../models/chat'
import Dice from '../common/Dice'
import clsx from 'clsx'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary200, primary400, primary500, primary800 } from '../../styles/colors'

const useStyles = makeStyles(() =>
    createStyles({
        roll: {
            width: 60,
            height: 60,
            color: primary200,
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: primary800
            }
        },
        rollDisabled: {
            cursor: 'inherit',
            color: primary500,
            '&:hover': {
                backgroundColor: 'transparent'
            }
        },
        rollType: {
            color: 'white',
            textShadow: '0 0 7px #000',
            backgroundColor: primary400,
            width: '1.4em',
            height: '1.4em',
            display: 'inline-block',
            textAlign: 'center',
            position: 'absolute',
            bottom: '1.4em',
            left: '-.7em',
            border: '1px solid #212C3D'
        },
        rollContainer: {
            userSelect: 'none',
            position: 'relative'
        },
    })
)

interface Props {
    type: RollType
    isDisabled: boolean
    onClick: () => void
}

const RollContainer: React.FC<Props> = props => {
    const classes = useStyles()
    const { type, isDisabled, onClick } = props

    return (
        <div className={classes.rollContainer}>
            <Dice type={type} className={clsx(classes.roll, isDisabled && classes.rollDisabled)} onClick={onClick}/>
            <span className={classes.rollType}>{type.substring(1)}</span>
        </div>
    )
}

export default RollContainer