import React, { useEffect, useState } from 'react'
import { Avatar, Card, GridList } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { primary50 } from '../../styles/colors'
import AddCard from '../Cards/AddCard'
import clsx from 'clsx'
import { Hero } from '../../models/hero'
import CharacterInfoDialog from '../Dialogs/CharacterInfoDialog'
import { useDispatch, useSelector } from 'react-redux'
import { selectHeroes } from '../../store/hero/selectors'
import { getHeroes } from '../../store/hero/actions'

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
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
            '-webkit-filter': 'brightness(60%)',
            filter: 'brightness(60%)',
            transition: '.3s ease-in-out',
            boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
        },
        backgroundColor: '#43536B',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    characterTile: {
        paddingTop: theme.spacing(2)
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
        '&:hover': {
            color:'#FFF'
        }
    },
    avatarLarge: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
    name: {
        color: primary50,
        fontWeight: 'bold',
        fontSize: '1rem',
        marginTop: theme.spacing(2)
    },
    list: {
        width: 550
    },
    addCard: {
        width: '100%',
        height: '100%'
    },
    wrapper: {
        padding: theme.spacing(1)
    }
}))

interface Props {
    onChoose: (hero: Hero) => void
}

const CharacterGallery: React.FC<Props> = props => {
    const { onChoose } = props
    const classes = useStyles()
    const [createCharacterDialogOpen, setCreateCharacterDialogOpen] = useState(false)

    const handleAddCharacter = () => setCreateCharacterDialogOpen(true)

    const dispatch = useDispatch()
    const characters = useSelector(selectHeroes)

    useEffect(() => {
        dispatch(getHeroes())
    }, [dispatch])

    return (
        <GridList cellHeight={150} cols={3} className={classes.list} spacing={10}>
            <div className={classes.wrapper}>
                <Card className={classes.tile}>
                    <AddCard className={clsx(classes.tile, classes.addCard)} onClick={handleAddCharacter} />
                </Card>
            </div>
            {characters.map(character => (
                <div className={classes.wrapper} key={character.id}>
                    <Card className={clsx(classes.tile, classes.characterTile)} onClick={() => onChoose(character)}>
                        <Avatar className={classes.avatarLarge} src={`/heroes/${character.sprite}.png`}/>
                        <span className={classes.name}>{character.name}</span>
                    </Card>
                </div>
            ))}
            <CharacterInfoDialog
                open={createCharacterDialogOpen}
                onClose={() => setCreateCharacterDialogOpen(false)}
            />
        </GridList>
    )
}

export default CharacterGallery