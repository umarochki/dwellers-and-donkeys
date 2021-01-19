import { Container, TilingSprite, Texture, Sprite } from 'pixi.js-legacy';
import GameObject from './GameObject';

export default class LocationMarker extends GameObject {

    constructor(options) {
        super();

        this.location = options.location;

        this.
        .on('click', onClick);

        function onClick(e) {
            this.eventManager.notify('map', {
              sprite: this.location
            })
        }
   }


}
