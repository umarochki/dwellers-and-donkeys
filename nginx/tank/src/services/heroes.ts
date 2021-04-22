import API from './index'
import { Hero } from '../models/hero'

const heroesService = {
    get: (): Promise<Hero[]> =>
        API.get(`/heroes`)
            .then(response => response.data),
    update: (request: Hero): Promise<Hero> =>
        API.post('/heroes', request)
            .then(response => response.data)
}

export default heroesService