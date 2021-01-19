import { Container, TilingSprite, Texture, Sprite } from 'pixi.js-legacy';
import GameObject from './GameObject';

export default class LocationMarker extends GameObject {

    constructor(options) {
        super(options);

        this.location = options.sprite;
        this.scale.set(0.3);
   }

   /*
   onClick(e) {

        this.eventManager.notify('map', {
          sprite: this.location
        })
    }
    */
}
