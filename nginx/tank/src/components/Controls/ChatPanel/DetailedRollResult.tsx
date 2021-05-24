import React from 'react'
import { Dices } from '../../../models/chat'
import Dice from '../../common/Dice'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary200 } from '../../../styles/colors'

const useStyles = makeStyles(() =>
    createStyles({
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
        die: {
            display: 'inline-block',
            textAlign: 'center',
            padding: '.5em',
            color: primary200
        },
        diceIcon: {
            minWidth: 20,
            height: 20,
            marginRight: 3
        }
    })
)

interface Props {
    dices: Dices
}

const DetailedRollResult: React.FC<Props> = props => {
    const classes = useStyles()
    const { dices } = props

    return (<>
        {
            Object.typedKeys(dices).map(dice => (
                dices[dice].map(count => (
                    <div className={classes.die} key={dice + count}>
                        <div className={classes.rollResult}>
                            <div className={classes.rollDie}>
                                <Dice type={dice} className={classes.diceIcon}/>
                                {count}
                            </div>
                        </div>
                    </div>
                ))
            ))
        }
    </>)
}

export default DetailedRollResult