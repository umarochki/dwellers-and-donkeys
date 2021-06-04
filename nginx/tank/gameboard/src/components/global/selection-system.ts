import * as PIXI from 'pixi.js-legacy'
import * as CONSTANTS from '../../constants'
import { Component, Sprite, Message, Graphics, Container } from '../../libs/pixi-ecs'
import { drawDashedPolygon } from '../../utils/draw';

export default class SelectionSystem extends Component {
  selected: Container
  
  border: Graphics
  angle: Graphics
  timer: number
  resizing: boolean

  polygons: { x: number, y: number }[]
  start: Size

  onInit() {
    this._onResizeStart = this._onResizeStart.bind(this)
    this._onResizeMove = this._onResizeMove.bind(this)
    this._onResizeEnd = this._onResizeEnd.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this.subscribe('object/clicked', 'clicked', 'object/select', 'object/unselect')

    this.polygons = [
      { x: 0, y: 0 }, 
      { x: 0, y: 0 }, 
      { x: 0, y: 0 }, 
      { x: 0, y: 0 }
    ];
  }

  onMessage(msg: Message) {
    if (msg.action === 'object/clicked' || msg.action === 'object/select') {
      let obj = msg.gameObject
            
      if (this.selected) {
        if (this.selected.id === obj.id) {
          this.offSelect()
          return;
        }

        this.offSelect()
      }

      if (!obj.hasFlag(CONSTANTS.FLAGS.SELECTABLE)) return;
      
      this.selected = obj;
      this.onSelect()
    }
    else if (msg.action === 'clicked' || msg.action === 'object/unselect') {
      if (this.selected) this.offSelect()
    }
  }

  onSelect() {
    const sprite = this.selected.getAttribute('sprite') as Sprite
    const current: Size = { width: sprite.width, height: sprite.height }

    // -----=== SELECTION BORDER ===-----
    this.border = new Graphics();
    this.selected.addChild(this.border)
    this._calculateBorder(current)

    if (this.selected.hasFlag(CONSTANTS.FLAGS.RESIZABLE))
      this._onResize()
    
    window.addEventListener('keydown', this._onKeyDown)
    this.scene.sendMessage(new Message('object/selected', null, this.selected, { id: this.selected.name }))
  }

  offSelect() {
    if (!this.selected) {
      throw new Error('No object is selected')
      return;
    }

    this.selected.asContainer().removeChild(this.border)
    this.selected = undefined
    window.removeEventListener('keydown', this._onKeyDown, false)
    this.scene.sendMessage(new Message('object/unselected', null))
  }

  _onResize() {
    const sprite = this.selected.getAttribute('sprite') as Sprite
    const current: Size = { width: sprite.width, height: sprite.height }
    this.start = current

    // -----=== RESIZE ANGLE ===-----
    const angle = new PIXI.Graphics()
    angle.interactive = true
    angle.cursor = 'nwse-resize'

    this.border.addChild(angle)
    this._redrawAngle(current)

    angle
      // events for drag start
      .on('mousedown',  this._onResizeStart)
      .on('touchstart', this._onResizeStart)
      // events for drag end
      .on('mouseup',         this._onResizeEnd)
      .on('mouseupoutside',  this._onResizeEnd)
      .on('touchend',        this._onResizeEnd)
      .on('touchendoutside', this._onResizeEnd)
      // events for drag move
      .on('mousemove', this._onResizeMove)
      .on('touchmove', this._onResizeMove);
  }

  private _onKeyDown(key) {
    if (key.keyCode === 46) {
      
      this.sendMessage('object/delete', {
        id: this.selected.name
      })

      let obj = this.selected
      this.offSelect()
      obj.destroy()
    }
  }

  private _onResizeStart(e) {
    e.stopPropagation();
    this.resizing = true;
    this.timer = null;
  }

  private _onResizeEnd(e) {
    e.stopPropagation();
    this.resizing = false;
  }

  private _onResizeMove(e) {
    if (this.resizing) {

      const sprite = this.selected.getAttribute('sprite') as Sprite
      const current: Size = { width: sprite.width, height: sprite.height }
      
      const [x, y] = [e.data.global.x, e.data.global.y]
      const corner = this.scene.viewport.corner

      let point : Size = {
        width: (x  / this.scene.viewport.scale.x - (this.selected.asContainer().x - corner.x)) * 2,
        height: (y  / this.scene.viewport.scale.y - (this.selected.asContainer().y - corner.y)) * 2
      }

      if (point.width < 10) point.width = 10
      if (point.height < 10) point.height = 10

      this.scene.sendMessage(new Message('object/resize', null, this.selected, point))

      let diff: Size = { 
        width: (current.width - this.start.width) / 2, 
        height: (current.height - this.start.height) / 2
      }

      this._calculateBorder(point)
      this._calculateAngle(diff)
      this._redrawBorder()

      this.sendMessage('object/update', {
        id: this.id,
        wh: [point.width,  point.height]
      })
    }
  }

  private _calculateBorder(size: Size) {
    const {width, height} = size
    this.polygons[0].x =  width / 2;
    this.polygons[0].y =  height / 2;
    this.polygons[1].x = -width / 2;
    this.polygons[1].y =  height / 2;
    this.polygons[2].x = -width / 2;
    this.polygons[2].y = -height / 2;
    this.polygons[3].x =  width / 2;
    this.polygons[3].y = -height / 2;
  }

  private _calculateAngle(size: Size) {
    const {width, height} = size
    const angle = this.border.getChildAt(0);
    angle.x = width;
    angle.y = height;
  }

  private _redrawAngle(size: Size) {
      const {width, height} = size
      const angle = this.border.getChildAt(0) as PIXI.Graphics
      angle.clear()
      angle.beginFill(0xffffff, 0.25)
      angle.moveTo(width / 2,      height / 2     )
      angle.lineTo(width / 2,      height / 2 - 15)
      angle.lineTo(width / 2 - 15, height / 2     )
      angle.lineTo(width / 2,      height / 2     )
  }

  private _redrawBorder(offset = 750) {
      this.border.clear();
      this.border.lineStyle(2, 0xffffff, 0.5);
      drawDashedPolygon(this.border, this.polygons, 0, 0, 0, 10, 5, (Date.now() % offset + 1) / offset);
  }

  onUpdate() {
    if (this.border) this._redrawBorder();
  }

}

