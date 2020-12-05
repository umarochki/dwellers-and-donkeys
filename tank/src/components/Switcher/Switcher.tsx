import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ListItem, Tooltip } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
import HomeIcon from '@material-ui/icons/Home'
import LayersIcon from '@material-ui/icons/Layers'
import FaceIcon from '@material-ui/icons/Face'
import List from '@material-ui/core/List'
import FlagIcon from '@material-ui/icons/Flag'
import { useHistory } from 'react-router-dom'

const switcherWidth = 60

const useStyles = makeStyles(() => ({
    switcher: {
        zIndex: 2000,
        width: `${switcherWidth}px`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        backgroundColor: '#334055'
    },
    icon: {
        color: 'white'
    },
    icon_inactive: {
        color: '#7888A4'
    },
    group: {
        height: `${switcherWidth}px`,
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
        },
        paddingRight: '12px',
        paddingLeft: '11px',
    },
    tooltip: {
        zIndex: 4000
    }
}))

export enum MenuType {
    heroes = 'heroes',
    locations = 'locations',
    markers = 'markers',
    unselect = 'unselect'
}

const mapTypeToIcon = (type: MenuType) => {
    switch (type) {
        case MenuType.heroes:
            return <FaceIcon fontSize="large"/>
        case MenuType.locations:
            return <LayersIcon fontSize="large"/>
        case MenuType.markers:
            return <FlagIcon fontSize="large"/>
        case MenuType.unselect:
            return null
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapTypeToTooltip = (type: MenuType): string => {
    switch (type) {
        case MenuType.heroes:
            return 'Персонажи'
        case MenuType.locations:
            return 'Карты'
        case MenuType.markers:
            return 'Маркеры'
        case MenuType.unselect:
            return 'unknown'
    }
}

interface Props {
    currentType: MenuType
    close: (event: React.KeyboardEvent | React.MouseEvent) => void
    onSelect: (type: MenuType) => void
}

const Switcher: React.FC<Props> = props => {
    const { currentType, onSelect } = props
    const classes = useStyles()
    const history = useHistory()

    const goHome = useCallback(() => history.push(''), [history])

    return (
        <List className={classes.switcher}>
            <ListItem button className={classes.group} onClick={goHome}>
                <ListItemIcon className={classes.icon_inactive}><HomeIcon fontSize="large"/></ListItemIcon>
            </ListItem>
            {
                [MenuType.locations, MenuType.heroes, MenuType.markers].map(type => (
                    <Tooltip title={mapTypeToTooltip(type)} className={classes.tooltip} style={{ zIndex: 5000 }}>
                        <ListItem button className={classes.group} onClick={() => onSelect(type)} key={type}>
                            <ListItemIcon className={type === currentType ? classes.icon : classes.icon_inactive}>
                                {mapTypeToIcon(type)}
                            </ListItemIcon>
                        </ListItem>
                    </Tooltip>
                ))
            }
        </List>
    )
}

export default Switcher