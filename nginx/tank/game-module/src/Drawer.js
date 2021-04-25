import * as PIXI from 'pixi.js-legacy';

export default class Drawer extends PIXI.Container {

  constructor(wh, renderer, color='#ffff00', boldness=3) {
    super();

    let [width, height] = wh;
    this.renderer = renderer;
    this.color = this.convertFromHexToNumericColor(color);
    this.boldness = boldness;

    this.tool = 'none';

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0, 0.5);
    this.graphics.alpha = 0;
    this.graphics.drawRect(-width, -height, width * 2, height * 2);
    this.graphics.endFill();
    this.graphics.cursor = 'auto';
    this.addChild(this.graphics);

    this.markers = new PIXI.Container();
    this.addChild(this.markers);

    this.paintDown = this.paintDown.bind(this);
    this.paintMove = this.paintMove.bind(this);
    this.paintUp = this.paintUp.bind(this);

    this.eraseDown = this.eraseDown.bind(this);
    this.eraseMove = this.eraseMove.bind(this);
    this.eraseUp = this.eraseUp.bind(this);
  }

  paintDown(event) {
    event.stopPropagation();

    this.markers.cacheAsBitmap = false;

    this.marker = new PIXI.Graphics();
    this.points = [];
    this.markers.addChild(this.marker);

    this.graphics.on('mousemove', this.paintMove);
    this.graphics.on('mouseup', this.paintUp);
  }

  paintMove(event) {

    const x = event.data.global.x
    const y = event.data.global.y

    var point = new PIXI.Point(
      (x - this.parent.x) / this.parent.scale.x, 
      (y - this.parent.y) / this.parent.scale.y
    );

    // Saving all the points in an array
    this.points.push(point);

    if (this.points.length < 3) {
      var point = this.points[0];
      this.marker.beginFill(this.color);
      this.marker.arcTo(point.x, point.y, this.boldness / 2, 0, Math.PI * 2, !0);
      this.marker.endFill();      
      return;
    }
    
    // Tmp canvas is always cleared up before drawing.
    this.marker.clear();
    this.marker.lineStyle(this.boldness, this.color);
    this.marker.moveTo(this.points[0].x, this.points[0].y);
    
    for (var i = 1; i < this.points.length - 2; i++) {
      var c = (this.points[i].x + this.points[i + 1].x) / 2;
      var d = (this.points[i].y + this.points[i + 1].y) / 2;
      
      this.marker.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d);
    }
    
    // For the last 2 points
    this.marker.quadraticCurveTo(
      this.points[i].x,
      this.points[i].y,
      this.points[i + 1].x,
      this.points[i + 1].y
    );
  }

  paintUp(event) {
    this.graphics.off('mousemove', this.paintMove);
    this.graphics.off('mouseup', this.paintUp);
    this.points = [];

    this.markers.cacheAsBitmap = true;
  }

  // ----------------------------------------

  eraseDown(event) {
    event.stopPropagation();

    var texture = this.renderer.generateTexture(this.markers);
    const maskSprite = new PIXI.Sprite(texture);
    maskSprite.blendMode = PIXI.BLEND_MODES.DST_IN;
    maskSprite.alpha = 1;

    this.brush = new PIXI.Graphics();
    this.brush.beginFill(0xffffff);
    this.brush.drawCircle(0, 0, 50);
    this.brush.endFill();
    
    this.graphics.on('mousemove', this.eraseMove);
    this.graphics.on('mouseup', this.eraseUp);
  }

  eraseMove(event) {

    const x = event.data.global.x;
    const y = event.data.global.y;

    var point = new PIXI.Point(
      (x - this.parent.x ) / this.parent.scale.x - this.sprite.x, 
      (y - this.parent.y ) / this.parent.scale.y - this.sprite.y
    );

    this.brush.position.copyFrom(point);
    this.brush.blendMode = PIXI.BLEND_MODES.DST_OUT;
    this.renderer.render(this.brush, this.texture, false, null, false);
  }

  eraseUp(event) {
    this.graphics.off('mousemove', this.eraseMove);
    this.graphics.off('mouseup', this.eraseUp);
  }

  clear() {
    this.markers.cacheAsBitmap = false;
    for (var i = this.markers.children.length - 1; i > -1; i--) {  
      this.markers.removeChild(this.markers.children[i])
    };
  }

  convertFromHexToNumericColor(color) {
    return parseInt(`0x${color.replace(/#/g, "")}`);
  }

  drawMode() {
    if (this.tool !== 'pensil') {
      if (this.tool == 'eraser') this.eraseMode();
      this.graphics.interactive = true;
      this.graphics.on('mousedown', this.paintDown);
      this.tool = 'pensil';
      return true;
    }
    else {
      this.graphics.off('mousedown', this.paintDown);
      this.graphics.interactive = false;
      this.markers.cacheAsBitmap = false;
      this.texture = this.renderer.generateTexture(this.markers);
      this.clear();
      this.sprite = new PIXI.Sprite(this.texture);
      this.sprite.x = this.markers._localBounds.minX;
      this.sprite.y = this.markers._localBounds.minY;
      this.markers.addChild(this.sprite);
      this.tool = 'none';
      return false;
    }
    
  }

  eraseMode() {
    if (this.tool !== 'eraser') {
      if (this.tool == 'pensil') this.drawMode();
      this.graphics.interactive = true;
      this.graphics.on('mousedown', this.eraseDown);
      this.tool = 'eraser';
      return true;
    }
    else {
      this.graphics.off('mousedown', this.eraseDown);
      this.graphics.interactive = false;
      this.tool = 'none';
      return false;
    }
  }
}