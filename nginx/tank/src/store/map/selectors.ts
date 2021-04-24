import { RootState } from '../reducers'

export const selectGetMapsState = (state: RootState) => state.map.getMapsState
export const selectMaps = (state: RootState) => state.map.maps