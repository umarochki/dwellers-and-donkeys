import React, { ReactNode } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary700, primary900 } from '../../../styles/colors'
import { Tooltip } from '@material-ui/core'

const useStyles = makeStyles(() =>
    createStyles({
        mapControl: {
            border: `1px solid ${primary900}`,
            padding: '5px 10px 2px',
            transition: '.3s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: primary700
            }
        }
    })
)

interface Props {
    onClick: () => void
    children: ReactNode
    tooltip: string
}

const MapControl: React.FC<Props> = props => {
    const classes = useStyles()
    const { onClick, tooltip, children } = props

    return (
        <Tooltip title={tooltip}>
            <div className={classes.mapControl} onClick={onClick}>
                {children}
            </div>
        </Tooltip>
    )
}

export default MapControl