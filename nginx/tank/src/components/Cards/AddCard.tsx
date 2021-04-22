import React from 'react'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { makeStyles } from '@material-ui/core/styles'
import { primary200 } from '../../styles/colors'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
    addCard: {
        cursor: 'pointer',
        height: '100px',
        width: '233px'
    },
    addCardInner: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px ${primary200} dashed`
    },
    addIcon: {
        fontSize: '4rem',
        color: primary200
    }
}))

interface Props {
    className?: string
    onClick: () => void
}

const AddCard: React.FC<Props> = ({ className, onClick }) => {
    const classes = useStyles()

    return (
        <div className={clsx(classes.addCard, className)} onClick={onClick}>
            <div className={classes.addCardInner}>
                <AddBoxIcon className={classes.addIcon}/>
            </div>
        </div>
    )
}

export default AddCard