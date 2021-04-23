import * as PIXI from 'pixi.js-legacy';

export default class Drawer extends PIXI.Container {

  constructor(wh, color='#ffffff', boldness=2) {
    super();

    let [width, height] = wh;
    this.color = this.convertFromHexToNumericColor(color);
    this.boldness = boldness;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0, 0.5);
    this.graphics.alpha = 0;
    this.graphics.drawRect(-width, -height, width * 2, height * 2);
    this.graphics.endFill();

    this.marker = new PIXI.Graphics();

    this.addChild(this.graphics);
    this.addChild(this.marker);

    this.handleDown = this.handleDown.bind(this);
    this.handleMoveListener = this.handleMove.bind(this);
    this.handleUpListener = this.handleUp.bind(this);
  }

  handleDown(event) {
    event.stopPropagation();
    this.parent.pause = true;

    var point = new PIXI.Point(
      (event.data.global.x - this.parent.x) / this.parent.scale.x, 
      (event.data.global.y - this.parent.y) / this.parent.scale.y
    );

    this.marker.beginFill(this.color);
    this.marker.lineStyle(this.boldness, this.color, 1);
    this.marker.moveTo(point.x, point.y);
    this.marker.lineTo(point.x, point.y);

    this.oldPoint = this.oldMidPoint = point;

    this.graphics.on('mousemove', this.handleMoveListener);
    this.graphics.on('mouseup', this.handleUpListener);
  }

  handleMove(event) {

    const x = event.data.global.x
    const y = event.data.global.y

    var point = new PIXI.Point(
      (x - this.parent.x) / this.parent.scale.x, 
      (y - this.parent.y) / this.parent.scale.y
    );

    var midPoint = new PIXI.Point(
      this.oldPoint.x + point.x >> 1, 
      this.oldPoint.y + point.y >> 1
    );

    this.marker.moveTo(midPoint.x, midPoint.y);

    this.marker.quadraticCurveTo(
      this.oldPoint.x, 
      this.oldPoint.y, 
      this.oldMidPoint.x, 
      this.oldMidPoint.y,
    );

    this.oldMidPoint = midPoint;
    this.oldPoint = point;

  }

  handleUp(event) {
    var point = new PIXI.Point(event.data.global.x, event.data.global.y);
    this.marker.endFill();
    this.graphics.off('mousemove', this.handleMoveListener);
    this.graphics.off('mouseup', this.handleUpListener);

    this.parent.pause = false;
  }

  clear() {
    this.marker.clear();
  }

  convertFromHexToNumericColor(color) {
    return parseInt(`0x${color.replace(/#/g, "")}`);
  }

  onDrawMode() {
    this.graphics.interactive = true;
    this.graphics.on('mousedown', this.handleDown);
  }

  offDrawMode() {
    this.graphics.interactive = false;
    this.graphics.off('mousedown', this.handleDown);
  }

  onEraseMode() {
    this.graphics.on('mousedown', this.handleDown);
  }

  offEraseMode() {
    this.graphics.on('mousedown', this.handleDown);
  }
}