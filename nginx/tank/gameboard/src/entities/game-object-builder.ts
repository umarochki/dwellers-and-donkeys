import * as CONSTANTS from '../constants'
import { Container, Sprite, Text } from '../libs/pixi-ecs'

import Draggable from '../components/draggable'
import PixelPerfectHitArea from '../components/pixel-perfect-hit-area';
//import RestrictedVisibility from '../components/restricted-visibility'
//import LinkedToMap from '../components/linked-to-map'

export default function GameObjectBuilder(options: ObjectOptions) : Container {

  let obj = new Container()
  
  obj.name = String(options.id)
  obj.position.set(options.xy[0], options.xy[1]);
  obj.interactive = true;
  obj.cursor = 'pointer';
  
  // Initialize sprite
  let sprite = new Sprite('', options.texture)
  sprite.anchor.set(0.5); 
  obj.addChild(sprite);
  obj.assignAttribute('sprite', sprite)

  if (sprite.height > 128) {
    sprite.scale.set(128 / sprite.height)
  }

  if (options.name) {
    // Initialize name
    let name = new Text('',
      options.name, {
        fontFamily : 'Arial', 
        fontSize: 20, 
        fill : 0xffffff, 
        align : 'center',
        fontWeight: "bold",
        strokeThickness: 5
    });
    name.anchor.set(0.5, 0.5);  
    name.y += sprite.height / 2 + 10;
    obj.addChild(name);
    obj.assignAttribute('name', name)
  }
  
  switch (options.type) {
    case 'hero':
      sprite.addComponent(new PixelPerfectHitArea())
      obj.setFlag(CONSTANTS.FLAGS.SELECTABLE)
      obj.setFlag(CONSTANTS.FLAGS.RESIZABLE)
      obj.setFlag(CONSTANTS.FLAGS.RESTRICTED_VISIBILITY)
      obj.addComponent(new Draggable())
      return obj

    case 'marker':
      obj.setFlag(CONSTANTS.FLAGS.SELECTABLE)
      obj.setFlag(CONSTANTS.FLAGS.RESIZABLE)
      obj.addComponent(new Draggable())
      //obj.addComponent(new LinkedToMap())
      return obj

    case 'obstacle':
      obj.setFlag(CONSTANTS.FLAGS.SELECTABLE)
      obj.addComponent(new Draggable())
      return obj

    default:
      obj.setFlag(CONSTANTS.FLAGS.SELECTABLE)
      obj.addComponent(new Draggable())
      return obj
  
  }
}
