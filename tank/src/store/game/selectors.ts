import { RootState } from '../reducers'

export const selectCurrentGame = (state: RootState) => state.game.currentGame
export const selectGames = (state: RootState) => state.game.games