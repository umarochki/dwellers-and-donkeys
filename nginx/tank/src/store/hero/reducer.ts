import { AsyncState } from '../user/reducer'
import { Hero } from '../../models/hero'
import { Reducer } from 'redux'
import * as heroConstants from './constants'

export interface HeroState {
    getHeroesState: AsyncState
    updateHeroState: AsyncState
    heroes: Hero[]
}

const INITIAL_STATE: HeroState = {
    getHeroesState: AsyncState.unknown,
    updateHeroState: AsyncState.unknown,
    heroes: [],
}

const heroReducer: Reducer<HeroState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case heroConstants.GET_HEROES_REQUEST_STARTED:
            return { ...state, getHeroesState: AsyncState.inProcess }
        case heroConstants.GET_HEROES_REQUEST_FINISHED:
            return {
                ...state,
                getHeroesState: AsyncState.success,
                heroes: action.payload,
            }
        case heroConstants.GET_HEROES_REQUEST_ERROR:
            return { ...state, getHeroesState: AsyncState.error }
        case heroConstants.ADD_HERO_REQUEST_STARTED:
            return { ...state, updateHeroState: AsyncState.inProcess }
        case heroConstants.ADD_HERO_REQUEST_FINISHED:
            return {
                ...state,
                updateHeroState: AsyncState.success,
                heroes: [...state.heroes, action.payload],
            }
        case heroConstants.ADD_HERO_REQUEST_ERROR:
            return { ...state, updateHeroState: AsyncState.error }
        default:
            return state
    }
}

export default heroReducer