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
import MapControlWithPopover from '../MapControlWithPopover';
import MapControlSettings, { Color } from '../MapControlSettings';

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
    isGM: boolean
}

enum Mode {
    Pencil,
    Eraser,
    Polygon,
    Fog
}

const MapControls: React.FC<Props> = props => {
    const classes = useStyles()
    const { boardRef, isGM } = props

    const [mode, setMode] = useState<Mode | null>(null)
    const [gridEnable, setGridEnable] = useState(false)

    const [currentColor, setCurrentColor] = useState('#ff0000')
    const [currentSize, setCurrentSize] = useState(3)

    const handleColorChange = (color: Color) => {
        boardRef.drawing.style({ color, width: currentSize })
        setCurrentColor(color)
    }

    const handleSizeChange = (size: number) => {
        boardRef.drawing.style({ color: currentColor, width: size })
        setCurrentSize(size)
    }

    if (!boardRef) return null
    
    return (
        <div className={classes.mapControls}>
            <MapControl
                onClick={() => { boardRef.map.switchGrid(); setGridEnable(g => !g) }}
                tooltip="Switch grid"
                active={gridEnable}
            >
                <AppsIcon />
            </MapControl>
            <MapControlWithPopover
                id="Pencil"
                controls={(
                    <MapControlSettings
                        currentColor={currentColor}
                        currentSize={currentSize}
                        onColorChange={handleColorChange}
                        onSizeChange={handleSizeChange}
                    />
                )}
                onClick={() => { boardRef.drawing.set('pencil'); setMode(mode === Mode.Pencil ? null : Mode.Pencil) }}
            >
                <MapControl
                    tooltip="Pencil"
                    active={mode === Mode.Pencil}
                >
                    <CreateIcon />
                </MapControl>
            </MapControlWithPopover>
            <MapControl
                onClick={() => { boardRef.drawing.set('eraser'); setMode(mode === Mode.Eraser ? null : Mode.Eraser) }}
                tooltip="Eraser"
                active={mode === Mode.Eraser}
            >
                <EraserIcon />
            </MapControl>
            <MapControlWithPopover
                id="polygon"
                controls={(
                    <MapControlSettings
                        currentColor={currentColor}
                        currentSize={currentSize}
                        onColorChange={handleColorChange}
                        onSizeChange={handleSizeChange}
                    />
                )}
                onClick={() => { boardRef.drawing.set('polygon'); setMode(mode === Mode.Polygon ? null : Mode.Polygon) }}
            >
                <MapControl
                    tooltip="Polygon"
                    active={mode === Mode.Polygon}
                >
                    <SignalCellular4BarIcon />
                </MapControl>
            </MapControlWithPopover>
            <MapControl
                onClick={() => { boardRef.visibilityRegion.set('draw'); setMode(mode === Mode.Fog ? null : Mode.Fog) }}
                tooltip="Fog of War"
                active={mode === Mode.Fog}
                disabled={!isGM}
            >
                <TonalityIcon />
            </MapControl>
            <MapControl onClick={() => { boardRef.visibilityRegion.clear(); setMode(null) }} tooltip="Clear Fog of War" disabled={!isGM}>
                <LayersClearIcon />
            </MapControl>
            <MapControl onClick={() => { boardRef.drawing.clear(); setMode(null) }} tooltip="Clear all">
                <DeleteIcon />
            </MapControl>
        </div>
    )
}

export default MapControls