import * as CONSTANTS from '../../constants'
import { Component, Sprite, Message, Graphics, Container } from '../../libs/pixi-ecs'
import { drawDashedPolygon } from '../../utils/draw';

export default class RestrictedVisibility extends Component {
  selected: Container

  onInit() {
    this.subscribe('object/clicked', 'clicked', 'object/update', 'region/update')
  }

  onMessage(msg: Message) {
    if (msg.action === 'object/clicked') {
        let obj = msg.gameObject
        
        if (!obj.hasFlag(CONSTANTS.FLAGS.RESTRICTED_VISIBILITY))
            return;

        if (this.selected) {
            this.sendMessage('region/hide')
            this.selected = undefined
        }

        this.selected = obj;
        this.sendMessage('object/restricted_visibility', { 
            id: this.selected.name
        })
        
        this.sendMessage('region/show', [obj.x, obj.y])
    }
    else if (msg.action === 'object/update') {
        if (this.selected && msg.gameObject.id === this.selected.id)
            this.sendMessage('region/show', [this.selected.x, this.selected.y])
    }
    else if (msg.action === 'region/update') {
        if (this.selected)
            this.sendMessage('region/show', [this.selected.x, this.selected.y])
    }
    else if (msg.action === 'clicked') {
        if (this.selected) {
            this.sendMessage('region/hide')
            this.selected = undefined
        }
    }
  }
}

