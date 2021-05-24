import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { primary700, primary800 } from '../../../styles/colors'
import { Dices, RollType } from '../../../models/chat'
import DetailedRollResult from './DetailedRollResult'

const useStyles = makeStyles(() =>
    createStyles({
        diceRoll: {
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '5em 100fr',
            gridTemplateRows: '100%',
            maxHeight: '7em',
            overflow: 'hidden',
            background: primary700,
            position: 'relative',
            color: '#fff',
            '&:hover': {
                boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
            }
        },
        result: {
            alignSelf: 'center',
            justifySelf: 'center',
            fontSize: '2em'
        },
        rolls: {
            padding: '.5em 0',
            height: '100%',
            overflowY: 'auto',
            background: primary800,
            gridColumn: 2
        },
        formula: {
            paddingLeft: '1ch',
            paddingBottom: '.25em',
            color: '#8b8b8b',
            width: '100%',
            borderBottom: '1px solid #2e2e2e',
            fontWeight: 400
        }
    })
)

interface Props {
    dices: Dices
    total: number
}

const getText = (dices: Dices): string => {
    return Object.keys(dices).reduce((prev, dice) => (
        dices[dice as RollType].length ? prev + (prev ? ' + ' : '') + (dices[dice as RollType].length + dice) : prev
    ), '')
}

const RollResult: React.FC<Props> = props => {
    const { dices, total } = props
    const classes = useStyles()

    return (
        <Paper className={classes.diceRoll}>
            <div className={classes.result}>{total}</div>
            <div className={classes.rolls}>
                <div className={classes.formula}>{getText(dices)}</div>
                <DetailedRollResult dices={dices}/>
            </div>
        </Paper>
    )
}

export default RollResult