import { RootState } from '../reducers'

export const selectCurrentGame = (state: RootState) => state.game.currentGame
export const selectGames = (state: RootState) => state.game.games
export const selectCurrentGameData = (state: RootState) => state.game.currentGameData
export const selectConnectGameState = (state: RootState) => state.game.connectGameState
export const selectAllGames = (state: RootState) => state.game.allGames
export const selectGetAllGamesState = (state: RootState) => state.game.getAllGamesState
export const selectGameHistory = (state: RootState) => state.game.games
export const selectGMGameHistory = (state: RootState) => state.game.gamesGM
export const selectPublicGames = (state: RootState) => state.game.publicGames