import * as PIXI from 'pixi.js-legacy';

export default class Drawer extends PIXI.Container {

  constructor(color, width, app, parent, renderer, img) {
    super();

    this.width = width;
    this.color = color;
    this.img = img;
    this.parent = parent;

    this.graphics = new PIXI.Graphics();
    this.marker = new PIXI.Graphics();
    this.oldPoint = undefined;
    this.oldMidPoint = undefined;

    this.graphics.beginFill(0, 0.5);
    this.graphics.drawRect(0, 0, this.parent.screenWidth, this.parent.screenHeight);
    this.graphics.endFill();
    this.graphics.interactive = true;
    this.graphics.on('mousedown', this.handleDown.bind(this));

    this.addChild(this.graphics);
    this.addChild(this.marker);

    this.handleMoveListener = this.handleMove.bind(this);
    this.handleUpListener = this.handleUp.bind(this);
  }

  handleDown(event) {

    this.parent.pause = true;

    var point = new PIXI.Point(
      event.data.global.x, 
      event.data.global.y
      );

    this.marker.beginFill(0xffd900);
    this.marker.lineStyle(2, 0xffd900, 1);
    this.marker.moveTo(point.x, point.y);
    this.marker.lineTo(point.x, point.y);

    this.oldPoint = this.oldMidPoint = point;

    this.graphics.on('mousemove', this.handleMoveListener);
    this.graphics.on('mouseup', this.handleUpListener);
  }

  handleMove(event) {

    const x = event.data.global.x
    const y = event.data.global.y

    const distX = (x - this.oldPoint.x) / this.parent.scale.x;
    const distY = (y - this.oldPoint.y) / this.parent.scale.y;

    var point = new PIXI.Point(x, y);

    var midPoint = new PIXI.Point(
      this.oldPoint.x + point.x >> 1, 
      this.oldPoint.y + point.y >> 1
    );

    console.log(`x: ${x}, distX: ${distX}, midPoint.x: ${midPoint.x}, scaleX: ${this.parent.scale.x}`, );

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



}