import { Container, TilingSprite, Texture, Sprite } from 'pixi.js-legacy';
import GameObject from './GameObject';

export default class Marker extends GameObject {

    constructor(options) {
      super(options);

      this.location = options.sprite;
      this.sprite.scale.set(0.3);

      if (options.location) { 
        this.location = location;
        this.setLocation(options.location); 
      }
   }
   
   setLocation(location) {
     this.addChild(new PIXI.Sprite(location));
   }
}
