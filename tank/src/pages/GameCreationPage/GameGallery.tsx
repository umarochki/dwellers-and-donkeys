import React, { useCallback } from 'react'
import { GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import tileData from './maps'
import AddCard from '../../components/Cards/AddCard'
import { useHistory } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'

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
        // '&:hover': {
        //     '-webkit-filter': 'brightness(60%)',
        //     filter: 'brightness(60%)',
        //     transition: '.3s ease-in-out'
        // },
        width: '50%',
        height: '255px',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
        '&:hover': {
            color:'#FFF'
        }
    },
}))

interface Props {
    onChoose: (id: string) => void
}

const GameGallery: React.FC<Props> = props => {
    const { onChoose } = props
    const classes = useStyles()
    const history = useHistory()
    const handleNewGameWorld = useCallback(() => history.push('tabletop'), [history])

    return (
        <GridList cellHeight={250} spacing={5}>
            <AddCard className={classes.tile} onClick={handleNewGameWorld} />
            {tileData.map(tile => (
                <GridListTile key={tile.img} onClick={() => onChoose(tile.title)} className={classes.tile}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                        title={tile.title}
                        titlePosition="top"
                        className={classes.titleBar}
                        actionIcon={
                            <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                <EditIcon />
                            </IconButton>
                        }
                    />
                </GridListTile>
            ))}
        </GridList>
    )
}

export default GameGallery