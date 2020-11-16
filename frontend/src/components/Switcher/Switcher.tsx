import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ListItem, Theme } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
import HomeIcon from '@material-ui/icons/Home'
import LayersIcon from '@material-ui/icons/Layers'
import List from '@material-ui/core/List'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'

const switcherWidth = 60

const useStyles = makeStyles((theme: Theme) => ({
    switcher: {
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
    }
}))

interface Props {
    onClick: (event: React.KeyboardEvent | React.MouseEvent) => void
}

const Switcher: React.FC<Props> = props => {
    const { onClick } = props
    const classes = useStyles()

    return (
        <List onClick={onClick} className={classes.switcher}>
            <ListItem button className={classes.group}>
                <ListItemIcon className={classes.icon}><HomeIcon fontSize="large"/></ListItemIcon>
            </ListItem>
            <ListItem button className={classes.group}>
                <ListItemIcon className={classes.icon_inactive}><LayersIcon fontSize="large"/></ListItemIcon>
            </ListItem>
            <ListItem button className={classes.group}>
                <ListItemIcon className={classes.icon_inactive}><BusinessCenterIcon fontSize="large"/></ListItemIcon>
            </ListItem>
        </List>
    )
}

export default Switcher