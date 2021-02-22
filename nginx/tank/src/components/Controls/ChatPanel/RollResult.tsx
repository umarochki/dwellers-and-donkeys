import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { Dices } from '../../../models/game'
import { primary200, primary700, primary800 } from '../../../styles/colors'
import Dice from '../../common/Dice'

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
        },
        die: {
            display: 'inline-block',
            textAlign: 'center',
            padding: '.5em',
            color: primary200
        },
        rollResult: {
            position: 'relative',
            height: '2em',
            boxSizing: 'content-box',
            width: '2em'
        },
        rollDie: {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            textShadow: '0 0 5px #000',
            fontSize: '1em',
            fontWeight: 700
        },
        diceIcon: {

        }
    })
)

interface Props {
    dices: Dices
    total: number
}

const getText = (dices: Dices): string => {
    return Object.keys(dices).reduce((prev, dice) => (
        dices[dice] ? prev + (prev ? ' + ' : '') + (dices[dice] + dice) : prev
    ), '')
}

const getNumber = (str: string): number => {
    const num = Number(str.substring(1))
    return num || 0
}

const RollResult: React.FC<Props> = props => {
    const { dices, total } = props
    const classes = useStyles()

    return (
        <Paper className={classes.diceRoll}>
            <div className={classes.result}>{total}</div>
            <div className={classes.rolls}>
                <div className={classes.formula}>{getText(dices)}</div>
                {
                    Object.keys(dices).map((dice, i) => (
                        <div className={classes.die} key={i}>
                            <div className={classes.rollResult}>
                                <div className={classes.rollDie}>
                                    <Dice type={getNumber(dice)} className={classes.diceIcon}/>
                                    {dices[dice]}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </Paper>
    )
}

export default RollResult