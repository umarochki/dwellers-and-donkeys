import mapService from '../services/map'
import { MapFile } from '../models/map'

export const handleUploadMap = (name: string, files: File[], callback: (result?: MapFile) => void) => {
    if (files.length) {
        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('type', 'map')
        formData.append('name', name)

        mapService
            .uploadMedia(formData)
            .then((result: MapFile) => {
                callback(result)
            })
            .catch(error => console.log('Failed to add map. Error:', error))
    }
    else {
        callback()
    }
}