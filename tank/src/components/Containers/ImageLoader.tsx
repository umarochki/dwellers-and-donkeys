import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
    imgLoading: {
        opacity: 0,
        width: '100%',
        height: 'auto'
    },
    imgLoaded: {
        animation: '$fadeInImg cubic-bezier(0.23, 1, 0.32, 1) 1',
        position: 'relative',
        opacity: 0,
        'animation-fill-mode': 'forwards',
        'animation-duration': '0.7s',
        'animation-delay': '0.1s'
    },
    '@keyframes fadeInImg': {
        '0%': {
            opacity: 0
        },
        '100%': {
            opacity: 1
        }
    },
    'image': {
        width: '100%'
    }
}))

interface LoadedType {
    [key: string]: boolean
}
const _loaded: LoadedType = {}

interface Props {
    src: string
    onClick?: () => void
    draggable?: boolean
    className?: string
}

const ImageLoader: React.FC<Props> = props => {
    const { src, onClick, draggable, className } = props
    const classes = useStyles()

    const [loaded, setLoaded] = useState(_loaded[src])

    const onLoad = useCallback(() => {
        _loaded[src] = true
        setLoaded(true)
    }, [src])


    const classNameState = loaded
        ? classes.imgLoaded
        : classes.imgLoading

    return (
        <img
            src={src}
            onClick={onClick}
            className={clsx(classes.image, className, classNameState)}
            onLoad={onLoad} alt=""
            draggable={draggable}
        />
    )
}

export default ImageLoader