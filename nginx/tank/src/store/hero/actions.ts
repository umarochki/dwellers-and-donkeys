import { Dispatch } from '../index'
import { showErrorNotification } from '../notifications/actions'
import * as heroConstants from './constants'
import heroesService from '../../services/heroes'
import { Hero } from '../../models/hero'

export const getHeroes = () => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        heroesService.get()
            .then((heroes: Hero[]) => {
                dispatch(success(heroes))
            }, error => {
                dispatch(failure(error))
                dispatch(showErrorNotification(error.message))
            })
    }

    function request() { return { type: heroConstants.GET_HEROES_REQUEST_STARTED } }
    function success(heroes: Hero[]) { return { type: heroConstants.GET_HEROES_REQUEST_FINISHED, payload: heroes } }
    function failure(error: Error) { return { type: heroConstants.GET_HEROES_REQUEST_ERROR, error } }
}

export const updateHero = (hero: Hero) => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        heroesService.update(hero)
            .then((hero: Hero) => {
                dispatch(success(hero))
            }, error => {
                dispatch(failure(error))
                dispatch(showErrorNotification(error.message))
            })
    }

    function request() { return { type: heroConstants.UPDATE_HERO_REQUEST_STARTED } }
    function success(hero: Hero) { return { type: heroConstants.UPDATE_HERO_REQUEST_FINISHED, payload: hero } }
    function failure(error: Error) { return { type: heroConstants.UPDATE_HERO_REQUEST_ERROR, error } }
}
