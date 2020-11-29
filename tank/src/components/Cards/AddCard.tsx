import React from 'react'
import { Card, CardActionArea } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { makeStyles } from '@material-ui/core/styles'
import { primary200 } from '../../styles/colors'

const useStyles = makeStyles(() => ({
    addCard: {
        padding: '10px',
        height: '100%'
    },
    addCardInner: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        border: `4px ${primary200} dashed`
    },
    addIcon: {
        fontSize: '4rem',
        color: primary200
    }
}))

interface Props {
    className: string
    onClick: () => void
}

const AddCard: React.FC<Props> = props => {
    const { className, onClick } = props
    const classes = useStyles()

    return (
        <Card className={className} onClick={onClick}>
            <CardActionArea className={classes.addCard}>
                <div className={classes.addCardInner}>
                    <AddBoxIcon  className={classes.addIcon}/>
                </div>
            </CardActionArea>
        </Card>
    )
}

export default AddCard