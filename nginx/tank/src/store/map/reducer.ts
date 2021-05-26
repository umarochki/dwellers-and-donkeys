import { Reducer } from 'redux'
import { AsyncState } from '../user/reducer'
import { Map } from '../../models/map'
import mapConstants from './constants'

export interface MapState {
    getMapsState: AsyncState
    maps: Map[]
}

const INITIAL_STATE: MapState = {
    getMapsState: AsyncState.unknown,
    maps: []
}

const mapReducer: Reducer<MapState> = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case mapConstants.GET_MAPS_REQUEST_STARTED:
            return { ...state, getMapsState: AsyncState.inProcess }
        case mapConstants.GET_MAPS_REQUEST_FINISHED:
            return { ...state, getMapsState: AsyncState.success, maps: action.payload }
        case mapConstants.GET_MAPS_REQUEST_ERROR:
            return { ...state, getMapsState: AsyncState.error }
        case mapConstants.ADD_MAP:
            return { ...state, maps: [...state.maps, action.payload] }
        default:
            return state
    }
}

export default mapReducer