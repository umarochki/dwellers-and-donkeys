import { Component, Container, Message, Sprite, Text } from '../../libs/pixi-ecs'

export default class TransformSystem extends Component {

    onInit() {
      this.subscribe('object/resize', 'object/position')
    }

    onMessage(msg: Message) {
        let obj = msg.gameObject
        if (msg.action === 'object/resize') {
           
            let sprite: Sprite | undefined = obj.getAttribute('sprite')
            let name: Text | undefined = obj.getAttribute('name')
            let map: Container | undefined = obj.getAttribute('map')
            const size: Size = msg.data
                        
            if (sprite) {
                sprite.width = size.width
                sprite.height = size.height
            }
            
            if (name) {
                name.y = size.height / 2 + 10
            }

            if (map) {
                map.y = -size.height / 2 - 10
            }
        }
        else if (msg.action === 'object/position') {
            const data: { x: number, y: number } = msg.data

            obj.x = data.x
            obj.y = data.y
        }
    }
}