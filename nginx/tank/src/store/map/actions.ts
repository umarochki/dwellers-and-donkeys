import { Dispatch } from '../index'
import { showErrorNotification } from '../notifications/actions'
import * as mapConstants from './constants'
import mapService from '../../services/map'
import { Map, MapFile } from '../../models/map'

export const getMaps = (game_id: string, callback?: (maps: Map[]) => void) => {
    return (dispatch: Dispatch) => {
        dispatch(request())

        mapService.getMaps(game_id)
            .then(maps => {
                dispatch(success(maps))
                callback && callback(maps)
            }, error => {
                dispatch(failure(error))
                dispatch(showErrorNotification(error.message))
            })
    }

    function request() { return { type: mapConstants.GET_MAPS_REQUEST_STARTED } }
    function success(maps: Map[]) { return { type: mapConstants.GET_MAPS_REQUEST_FINISHED, payload: maps } }
    function failure(error: any) { return { type: mapConstants.GET_MAPS_REQUEST_ERROR, error } }
}

export const addMap = (map: MapFile, callback: Function) => {
    return (dispatch: Dispatch) => {
        dispatch(add({
            name: map.name,
            hash: map.hash,
            file: map.file
        }))
        callback()
    }

    function add(map: Map) { return { type: mapConstants.ADD_MAP, payload: map } }
}