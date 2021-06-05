import React, { useCallback, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ListItem } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
import HomeIcon from '@material-ui/icons/Home'
import FaceIcon from '@material-ui/icons/Face'
import LayersIcon from '@material-ui/icons/Layers'
import List from '@material-ui/core/List'
import FlagIcon from '@material-ui/icons/Flag'
import { useHistory } from 'react-router-dom'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import ExploreIcon from '@material-ui/icons/Explore'
import FilterHdrIcon from '@material-ui/icons/FilterHdr'
import { primary400 } from '../../styles/colors'
import InfoIcon from '@material-ui/icons/Info'
import RoomIcon from '@material-ui/icons/Room'

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
        color: primary400
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
    global = 'global',
    decorations = 'decorations',
    heroes = 'heroes',
    locations = 'locations',
    decorationsExtra = 'decorationsExtra',
    markers = 'markers',
    info = 'info',
    unselect = 'unselect'
}

const mapTypeToIcon = (type: MenuType) => {
    switch (type) {
        case MenuType.global:
            return <ExploreIcon fontSize="large"/>
        case MenuType.decorations:
            return <FilterHdrIcon fontSize="large"/>
        case MenuType.heroes:
            return <FaceIcon fontSize="large"/>
        case MenuType.locations:
            return <LayersIcon fontSize="large"/>
        case MenuType.decorationsExtra:
            return <FlagIcon fontSize="large"/>
        case MenuType.markers:
            return <RoomIcon fontSize="large"/>
        case MenuType.info:
            return <InfoIcon fontSize="large"/>
        case MenuType.unselect:
            return null
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapTypeToTooltip = (type: MenuType): string => {
    switch (type) {
        case MenuType.global:
            return 'Global map'
        case MenuType.decorations:
            return 'Global map decorations'
        case MenuType.heroes:
            return 'Characters'
        case MenuType.locations:
            return 'Maps'
        case MenuType.decorationsExtra:
            return 'Special decorations'
        case MenuType.markers:
            return 'Markers'
        case MenuType.info:
            return 'Info'
        case MenuType.unselect:
            return 'unknown'
    }
}

interface Props {
    currentType: MenuType
    close: (event: React.KeyboardEvent | React.MouseEvent) => void
    onSelect: (type: MenuType) => void
    global: boolean | null
}

const Switcher: React.FC<Props> = props => {
    const { currentType, global, onSelect } = props
    const classes = useStyles()
    const history = useHistory()

    const [confirmOpen, setConfirmOpen] = useState(false)
    const confirm = useCallback(() => setConfirmOpen(true), [])

    const goHome = useCallback(() => history.push(''), [history])

    const menuList = useMemo(() => {
        if (global === null) return []

        return global
            ? [MenuType.locations, MenuType.markers, MenuType.decorations, MenuType.decorationsExtra,  MenuType.info]
            : [MenuType.global, MenuType.locations, MenuType.heroes, MenuType.info]
    }, [global])

    return (
        <List className={classes.switcher}>
            <ListItem button className={classes.group} onClick={confirm}>
                <ListItemIcon className={classes.icon_inactive}><HomeIcon fontSize="large"/></ListItemIcon>
            </ListItem>
            {
                menuList.map(type => (
                    <ListItem button className={classes.group} onClick={() => onSelect(type)} key={type}>
                        <ListItemIcon className={type === currentType ? classes.icon : classes.icon_inactive}>
                            {mapTypeToIcon(type)}
                        </ListItemIcon>
                    </ListItem>
                ))
            }
            <ConfirmDialog
                title="Are you sure you want to leave the game?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={goHome}
            />
        </List>
    )
}

export default Switcher