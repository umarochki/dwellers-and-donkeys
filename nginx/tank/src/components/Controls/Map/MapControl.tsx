import React, { ReactNode } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary500, primary700, primary900 } from '../../../styles/colors'
import { Tooltip } from '@material-ui/core'
import clsx from 'clsx';

const useStyles = makeStyles(() =>
    createStyles({
        mapControl: {
            border: `1px solid ${primary900}`,
            padding: '5px 10px 2px',
            transition: '.3s ease-in-out',
            cursor: 'pointer',
            backgroundColor: primary500,
            '&:hover': {
                backgroundColor: primary700
            }
        },
        mapControlPressed: {
            backgroundColor: primary700
        },
        mapControlDisabled: {
            backgroundColor: primary900
        }
    })
)

interface Props {
    onClick?: () => void
    children: ReactNode
    tooltip: string
    active?: boolean
    disabled?: boolean
}

const MapControl: React.FC<Props> = props => {
    const classes = useStyles()
    const { onClick, tooltip, children, disabled, active = false } = props

    return (
        <Tooltip title={tooltip}>
            <div className={clsx(classes.mapControl, active && classes.mapControlPressed, disabled && classes.mapControlDisabled)} onClick={disabled ? undefined : onClick}>
                {children}
            </div>
        </Tooltip>
    )
}

export default MapControl