import { getConstants } from '../../helpers/getConstants'

const heroConstants = getConstants([
    'GET_HEROES_REQUEST_STARTED',
    'GET_HEROES_REQUEST_FINISHED',
    'GET_HEROES_REQUEST_ERROR',
    'ADD_HERO_REQUEST_STARTED',
    'ADD_HERO_REQUEST_FINISHED',
    'ADD_HERO_REQUEST_ERROR'
])

export default heroConstants