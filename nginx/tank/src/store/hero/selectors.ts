import { RootState } from '../reducers'

export const selectGetHeroesState = (state: RootState) => state.hero.getHeroesState
export const selectHeroes = (state: RootState) => state.hero.heroes
export const selectUpdateHeroState = (state: RootState) => state.hero.updateHeroState
export const selectHero = (state: RootState) => state.hero.hero