import * as PIXI from 'pixi.js-legacy'
import { Component } from '../libs/pixi-ecs'
export default class Draggable extends Component {
  dragging: boolean
  start: { x: number, y: number }
  last: { x: number, y: number }
  timer: number

  onInit() {
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragMove = this._onDragMove.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    
    this.owner
    // events for drag start
    .on('mousedown',  this._onDragStart)
    .on('touchstart', this._onDragStart)
    
  }

  private _onDragStart(e: PIXI.InteractionEvent) {
      
    this._updateOverlap()
    this.scene.viewport.pause = true

    this.dragging = true
    
    this.start = { x: this.owner.x, y: this.owner.y }
    this.last = { x: e.data.global.x, y: e.data.global.y }
    this.timer = null

    this.sendMessage('object/updated/before', {
      id: this.owner.name,
      xy: [this.start.x, this.start.y]
    })

    this.owner
    // events for drag end 
    .on('mouseup',         this._onDragEnd)
    .on('mouseupoutside',  this._onDragEnd)
    .on('touchend',        this._onDragEnd)
    .on('touchendoutside', this._onDragEnd)
    // events for drag move
    .on('mousemove', this._onDragMove)
    .on('touchmove', this._onDragMove)
  }
  
    
  private _onDragEnd(e: PIXI.InteractionEvent) {
    
    if (this.start && 
      (e.target as any).clickable !== false &&
      Math.abs(this.owner.x - this.start.x) <= 2 && 
      Math.abs(this.owner.y - this.start.y) <= 2)
      this.sendMessage('object/clicked', {
        id: this.owner.name 
      })

    this.scene.viewport.pause = false
    this.dragging = false

    this.sendMessage('object/updated/after', {
      id: this.owner.name,
      xy: [this.owner.x, this.owner.y]
    })

    this.owner
    // events for drag end 
    .off('mouseup',         this._onDragEnd)
    .off('mouseupoutside',  this._onDragEnd)
    .off('touchend',        this._onDragEnd)
    .off('touchendoutside', this._onDragEnd)
    // events for drag move
    .off('mousemove', this._onDragMove)
    .off('touchmove', this._onDragMove)
  }
  
  private _onDragMove(e: PIXI.InteractionEvent) {
    if (this.dragging) {

      const x = e.data.global.x
      const y = e.data.global.y

      this.sendMessage('object/position', {
        x: this.owner.x + (x - this.last.x) / this.scene.viewport.scale.x,
        y: this.owner.y + (y - this.last.y) / this.scene.viewport.scale.y
      })

      this.last = { x, y }

      this.sendMessage('object/updated', {
        id: this.owner.name,
        xy: [this.owner.x, this.owner.y]
      })
    }
  }

  private _updateOverlap() {
    // Change rendering order of objects
    const parent = this.owner.parent
    parent.removeChild(this.owner)
    parent.addChild(this.owner)
  }
}