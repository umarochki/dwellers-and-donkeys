import React from 'react'
import { Avatar, Card, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { primary900 } from '../../styles/colors'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:hover': {
                boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
            }
        },
        avatarLarge: {
            width: theme.spacing(11),
            height: theme.spacing(11),
        },
        avatarDark: {
            backgroundColor: primary900,
        }
    })
)

interface Props {
    selected?: boolean
}

const PersonCard: React.FC<Props> = props => {
    const classes = useStyles()
    const { selected } = props

    return (
        <Card raised={selected} className={classes.root}>
            <Avatar className={clsx(classes.avatarLarge, classes.avatarDark)}/>
        </Card>
    )
}

export default PersonCard