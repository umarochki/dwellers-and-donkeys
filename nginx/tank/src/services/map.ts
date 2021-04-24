import { MapFile, Map } from '../models/map'
import API from './index'

const mapService = {
    uploadMedia: (file: FormData): Promise<MapFile> =>
        API.post(`/media`, file, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => response.data),
    getMaps: (game_id: string): Promise<Map[]> =>
        API.get('/maps', { params: { game_id } })
            .then(response => response.data)
}

export default mapService