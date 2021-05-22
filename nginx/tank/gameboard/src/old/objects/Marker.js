import { Container, TilingSprite, Texture, Sprite, Graphics } from 'pixi.js-legacy';
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

      this.marker = new Graphics();
      this.marker.beginFill(0xff0000)
                 .arc(0, 0, 25, 5 * Math.PI / 6, Math.PI / 6)
                 .lineTo(0, 50)
                 .endFill();

   }
   
   setMap(map) {
     this.addChild(this.marker);
     this.addChild(new Sprite(map.texture));
     console.log(this, map)
   }
}
