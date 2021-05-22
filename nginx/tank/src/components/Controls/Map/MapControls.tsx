import React from 'react'
import AppsIcon from '@material-ui/icons/Apps'
import CreateIcon from '@material-ui/icons/Create'
import SignalCellular4BarIcon from '@material-ui/icons/SignalCellular4Bar'
import DeleteIcon from '@material-ui/icons/Delete'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { primary500 } from '../../../styles/colors'
import MapControl from './MapControl'
import { ReactComponent as EraserIcon } from '../../../assets/eraser.svg'

const useStyles = makeStyles(() =>
    createStyles({
        mapControls: {
            display: 'flex',
            position: 'fixed',
            left: 'calc(50% - 70px)',
            top: 10,
            backgroundColor: primary500
        }
    })
)

interface Props {
    boardRef: any
}

const MapControls: React.FC<Props> = props => {
    const classes = useStyles()
    const { boardRef } = props
    
    if (!boardRef.current) return null
    
    return (
        <div className={classes.mapControls}>
            <MapControl onClick={() => boardRef.current.switchGrid()} tooltip="Switch grip">
                <AppsIcon />
            </MapControl>
            <MapControl onClick={() => boardRef.current.drawer.setMode('pencil')} tooltip="Pencil">
                <CreateIcon />
            </MapControl>
            <MapControl onClick={() => boardRef.current.drawer.setMode('eraser')} tooltip="Eraser">
                <EraserIcon />
            </MapControl>
            <MapControl onClick={() => boardRef.current.drawer.setMode('polygon')} tooltip="Polygon">
                <SignalCellular4BarIcon />
            </MapControl>
            <MapControl onClick={() => boardRef.current.drawer.clear()} tooltip="Clear all">
                <DeleteIcon />
            </MapControl>
        </div>
    )
}

export default MapControls