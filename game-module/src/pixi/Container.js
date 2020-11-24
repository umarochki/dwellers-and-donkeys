import { Container } from 'pixi.js-legacy';

export default class MapContainer extends Container {

    /**
     * @constructor
     * @param {string} name 
     */
    constructor(name = '[noname] container') {
        super()
        this.name = name

    }
}