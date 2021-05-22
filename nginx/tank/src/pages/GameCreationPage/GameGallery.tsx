import React from 'react'
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Map } from '../../models/map'
import ImageLoader from '../../components/Containers/ImageLoader'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    tile: {
        cursor: 'pointer',
        '&:hover': {
            '-webkit-filter': 'brightness(60%)',
            filter: 'brightness(60%)',
            transition: '.3s ease-in-out'
        },
        width: '50%',
        height: '255px',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
        '&:hover': {
            color:'#FFF'
        }
    },
    img: {
        height: '100%'
    }
}))

interface Props {
    onChoose: (id: string) => void
    maps: Map[]
}

const GameGallery: React.FC<Props> = props => {
    const { onChoose, maps } = props
    const classes = useStyles()

    return (
        <GridList cellHeight={250} spacing={5}>
            {maps.map(tile => (
                <GridListTile key={tile.hash} onClick={() => onChoose(tile.hash)} className={classes.tile}>
                    <ImageLoader src={tile.file} className={classes.img} />
                    <GridListTileBar
                        title={tile.name}
                        titlePosition="top"
                        className={classes.titleBar}
                    />
                </GridListTile>
            ))}
        </GridList>
    )
}

export default GameGallery