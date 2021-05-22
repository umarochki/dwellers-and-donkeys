import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Button, Card, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person'
import { primary200, primary50 } from '../../styles/colors'
import InviteDialog from '../Dialogs/InviteDialog'
import CharacterInfoDialog from '../Dialogs/CharacterInfoDialog'
import { getHeroes } from '../../store/hero/actions'
import { useDispatch } from 'react-redux'
import { Hero } from '../../models/hero'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        me: {
            backgroundColor: '#43536B',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%',
            paddingTop: theme.spacing(3),
            borderRadius: 0,
            [theme.breakpoints.down('md')]: {
                height: 250
            }
        },
        avatarLarge: {
            width: theme.spacing(8),
            height: theme.spacing(8),
            marginBottom: theme.spacing(3),
            cursor: 'pointer',
            [theme.breakpoints.down('md')]: {
                width: theme.spacing(6),
                height: theme.spacing(6)
            }
        },
        name: {
            color: primary50,
            fontWeight: 'bold',
            fontSize: '1.2rem',
            marginBottom: theme.spacing(1)
        },
        race: {
            userSelect: 'none',
            color: primary200,
            marginBottom: theme.spacing(1),
        },
        code: {
            userSelect: 'none',
            fontSize: '1.5rem',
            color: primary200,
            [theme.breakpoints.down('md')]: {
                fontSize: '1rem'
            }
        }
    })
)

interface Props {
    code: string
    hero?: Hero
}

const UserCard: React.FC<Props> = props => {
    const classes = useStyles()
    const { code, hero } = props
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)

    const openDialog = useCallback(() => setOpen(true), [])
    const closeDialog = useCallback(() => setOpen(false), [])

    const [characterCardOpen, setCharacterCardOpen] = useState(false)
    const openCharacterCard = useCallback(() => setCharacterCardOpen(true), [])
    const closeCharacterCard = useCallback(() => setCharacterCardOpen(false), [])

    const handleShowCharacter = () => {
        openCharacterCard()
    }

    useEffect(() => {
        dispatch(getHeroes())
    }, [dispatch])

    return (
        <Card className={classes.me} raised>
            <Avatar className={classes.avatarLarge} onClick={handleShowCharacter}>
                <PersonIcon fontSize="large"/>
            </Avatar>
            {/*<span className={classes.name}>Я кто-то там</span>*/}
            <span className={classes.race}>Invitation code:</span>
            <span className={classes.code}>{code}</span>
            <Button
                color="secondary"
                onClick={openDialog}>
                Invite
            </Button>
            <InviteDialog open={open} code={code} onClose={closeDialog}/>
            <CharacterInfoDialog open={characterCardOpen} onClose={closeCharacterCard} isEdit={false} hero={hero}/>
        </Card>
    )
}

export default UserCard