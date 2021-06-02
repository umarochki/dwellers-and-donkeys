import containsPoint from '../utils/contains-point'
import { Component, Sprite } from '../libs/pixi-ecs'

export default class PixelPerfectHitArea extends Component {

    onInit() {
        (this.owner as Sprite).containsPoint = containsPoint
    }

    onDestroy() {
        console.log('5678')
    }
}