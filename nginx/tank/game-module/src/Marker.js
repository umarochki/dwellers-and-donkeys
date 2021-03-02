import { Container, TilingSprite, Texture, Sprite } from 'pixi.js-legacy';
import GameObject from './GameObject';

export default class Marker extends GameObject {

    constructor(options) {
        super(options);

        this.location = options.sprite;
        this.sprite.scale.set(0.3);
   }

   

   /*
   onClick(e) {

        this.eventManager.notify('map', {
          sprite: this.location
        })
    }
    */
}
