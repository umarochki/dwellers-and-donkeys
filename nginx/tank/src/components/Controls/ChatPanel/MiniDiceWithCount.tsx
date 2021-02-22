import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { primary200 } from '../../../styles/colors'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dice: {
            display: 'flex',
            alignItems: 'center',
            marginRight: theme.spacing(1)
        },
        diceSquare: {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            minWidth: 30,
            height: 30,
            border: `2px solid ${primary200}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1rem'
        }
    })
)

interface Dice {
    type: string | number
}

export const MiniDice: React.FC<Dice> = props => {
    const classes = useStyles()
    const { type } = props

    return <span className={classes.diceSquare}>{type}</span>
}

export interface DiceWithCount extends Dice {
    count: number
}

const MiniDiceWithCount: React.FC<DiceWithCount> = props => {
    const classes = useStyles()
    const { type, count } = props

    if (!count) {
        return null
    }

    return (
        <span className={classes.dice}>
            <MiniDice type={type}/>x{count}
        </span>
    )
}

export default MiniDiceWithCount