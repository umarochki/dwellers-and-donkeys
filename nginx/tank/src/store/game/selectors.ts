import { RootState } from '../reducers'

export const selectCurrentGame = (state: RootState) => state.game.currentGame
export const selectGames = (state: RootState) => state.game.games
export const selectCurrentGameData = (state: RootState) => state.game.currentGameData
export const selectConnectGameState = (state: RootState) => state.game.connectGameState
export const selectGetGameHistoryState = (state: RootState) => state.game.getGameHistoryState
export const selectGameHistory = (state: RootState) => state.game.games
export const selectGetGMGameHistoryState = (state: RootState) => state.game.getGMGameHistoryState
export const selectGMGameHistory = (state: RootState) => state.game.gamesGM
export const selectPublicGames = (state: RootState) => state.game.publicGames