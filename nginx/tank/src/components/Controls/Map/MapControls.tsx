import React, { useState } from 'react'
import AppsIcon from '@material-ui/icons/Apps'
import CreateIcon from '@material-ui/icons/Create'
import SignalCellular4BarIcon from '@material-ui/icons/SignalCellular4Bar'
import DeleteIcon from '@material-ui/icons/Delete'
import TonalityIcon from '@material-ui/icons/Tonality'
import LayersClearIcon from '@material-ui/icons/LayersClear'
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

enum Mode {
    Grid,
    Pencil,
    Eraser,
    Polygon,
    Fog
}

const MapControls: React.FC<Props> = props => {
    const classes = useStyles()
    const { boardRef } = props

    const [mode, setMode] = useState<Mode | null>(null)

    if (!boardRef.current) return null
    
    return (
        <div className={classes.mapControls}>
            <MapControl
                onClick={() => { boardRef.current.map.switchGrid(); setMode(mode === Mode.Grid ? null : Mode.Grid) }}
                tooltip="Switch grid"
                active={mode === Mode.Grid}
            >
                <AppsIcon />
            </MapControl>
            <MapControl
                onClick={() => { boardRef.current.drawing.set('pencil'); setMode(mode === Mode.Pencil ? null : Mode.Pencil) }}
                tooltip="Pencil"
                active={mode === Mode.Pencil}
            >
                <CreateIcon />
            </MapControl>
            <MapControl
                onClick={() => { boardRef.current.drawing.set('eraser'); setMode(mode === Mode.Eraser ? null : Mode.Eraser) }}
                tooltip="Eraser"
                active={mode === Mode.Eraser}
            >
                <EraserIcon />
            </MapControl>
            <MapControl
                onClick={() => { boardRef.current.drawing.set('polygon'); setMode(mode === Mode.Polygon ? null : Mode.Polygon) }}
                tooltip="Polygon"
                active={mode === Mode.Polygon}
            >
                <SignalCellular4BarIcon />
            </MapControl>
            <MapControl
                onClick={() => { boardRef.current.visibilityRegion.set('draw'); setMode(mode === Mode.Fog ? null : Mode.Fog) }}
                tooltip="Fog of War"
                active={mode === Mode.Fog}
            >
                <TonalityIcon />
            </MapControl>
            <MapControl onClick={() => { boardRef.current.visibilityRegion.clear() }} tooltip="Clear Fog of War">
                <LayersClearIcon />
            </MapControl>
            <MapControl onClick={() => boardRef.current.drawing.clear()} tooltip="Clear all">
                <DeleteIcon />
            </MapControl>
        </div>
    )
}

export default MapControls