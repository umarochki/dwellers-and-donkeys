import * as PIXI from 'pixi.js-legacy';


export default class Drawer extends PIXI.Container {

  constructor(viewport, renderer, color='#ff0000', boldness=3) {
    super();

    this.mode = 'none';

    this.viewport = viewport;
    this.renderer = renderer;

    this.color = this.convertFromHexToNumericColor(color);
    this.boldness = boldness;

    // Creating overlay for handling extra event listeners
    this.overlay = new PIXI.Container();
    this.addChild(this.overlay);
    
    // Interactive area that covers the whole gameboard world
    let rect = new PIXI.Graphics();
    rect.beginFill(0, 0.5);
    rect.alpha = 0;
    rect.drawRect(-this.viewport._worldWidth, -this.viewport._worldHeight, this.viewport._worldWidth * 2, this.viewport._worldHeight * 2);
    rect.endFill();
    this.overlay.cursor = 'auto';
    this.overlay.addChild(rect);
    
    // Stores some auxiliary graphics in process of drawing
    this.temp = new PIXI.Container();
    this.overlay.addChild(this.temp);

    // Drawing board
    this.board = new PIXI.Container();
    this.board.isDrawer = true;
    this.addChild(this.board);

    // Bindings
    this.pencilDown = this.pencilDown.bind(this);
    this.pencilMove = this.pencilMove.bind(this);
    this.pencilUp = this.pencilUp.bind(this);

    this.eraserDown = this.eraserDown.bind(this);
    this.eraserMove = this.eraserMove.bind(this);
    this.eraserUp = this.eraserUp.bind(this);

    this.polygonStartClick = this.polygonStartClick.bind(this);
    this.polygonMiddleClick = this.polygonMiddleClick.bind(this);
    this.polygonEndClick = this.polygonEndClick.bind(this);
    this.polygonMove = this.polygonMove.bind(this);
  }

  transformToTexture(event) {
    this.texture = this.renderer.generateTexture(this.board);
    this.clear();
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.x = this.board._localBounds.minX;
    this.sprite.y = this.board._localBounds.minY;
    this.board.addChild(this.sprite);
  }

  // --------=====x{ HANDLERS }x=====--------

  pencilDown(event) {

    event.stopPropagation();
    this.marker = new PIXI.Graphics();
    this.context.addChild(this.marker);
    this.points = [];
    

    this.overlay.on('mousemove', this.pencilMove)
                .on('touchmove', this.pencilMove)
                .on('mouseup', this.pencilUp)
                .on('mouseupoutside',  this.pencilUp)
                .on('touchend',        this.pencilUp)
                .on('touchendoutside', this.pencilUp)
  }

  pencilMove(event) {
    const x = event.data.global.x
    const y = event.data.global.y

    var point = new PIXI.Point(
      (x - this.viewport.x) / this.viewport.scale.x, 
      (y - this.viewport.y) / this.viewport.scale.y
    );

    this.points.push(point);
    this.marker.clear();
    this.marker.lineStyle(this.boldness, this.color);
    this.drawCustomLine(this.points);
  }

  pencilUp(event) {
    this.overlay.off('mousemove', this.pencilMove)
                .off('touchmove', this.pencilMove)
                .off('mouseup', this.pencilUp)
                .off('mouseupoutside',  this.pencilUp)
                .off('touchend',        this.pencilUp)
                .off('touchendoutside', this.pencilUp)
    
    this.points = [];
  }

  // ----------------------------------------

  polygonStartClick(event) {
    event.stopPropagation();
    
    const x = event.data.global.x
    const y = event.data.global.y

    var point = new PIXI.Point(
      (x - this.viewport.x) / this.viewport.scale.x, 
      (y - this.viewport.y) / this.viewport.scale.y
    );

    this.edges = new PIXI.Graphics();
    this.temp.addChild(this.edges);
    
    this.vertices = new PIXI.Container();
    this.vertices.interactive = true;
    this.vertices.cursor = 'pointer';
    this.temp.addChild(this.vertices);
    
    this.edge = new PIXI.Graphics();
    this.edges.addChild(this.edge);

    let texture = new PIXI.Graphics();
    texture.beginFill(0xffffff, 0.5);
    texture.drawCircle(0, 0, 10)
    texture.endFill();

    let center = new PIXI.Graphics();
    center.beginFill(0xffffff);
    center.drawCircle(0, 0, 5)
    center.endFill();
    texture.addChild(center);

    this.vertex = new PIXI.Sprite(this.renderer.generateTexture(texture));
    this.vertex.anchor.set(0.5);
    this.vertex.position.copyFrom(point);
    this.vertex.interactive = true;
    this.vertex.cursor = 'pointer';

    this.vertices.addChild(this.vertex)

    this.points = [];
    this.points.push([point.x, point.y]);

    this.overlay.on('mousemove', this.polygonMove)
                .on('touchmove', this.polygonMove)
                .on('click', this.polygonMiddleClick)
                .on('touchstart', this.polygonMiddleClick)
                .off('click', this.polygonStartClick)
                .off('touchstart', this.polygonStartClick);

    this.vertex.on('click', this.polygonEndClick)
               .on('touchstart', this.polygonEndClick);
  }

  polygonMiddleClick(event) {
    event.stopPropagation();
    
    const x = event.data.global.x
    const y = event.data.global.y

    var point = new PIXI.Point(
      (x - this.viewport.x) / this.viewport.scale.x, 
      (y - this.viewport.y) / this.viewport.scale.y
    );

    this.edge.lineStyle(this.boldness, 0xffffff, 0.5);
    this.edge.moveTo(this.points[this.points.length - 1][0], this.points[this.points.length - 1][1]);
    this.edge.lineTo(point.x, point.y);

    this.points.push([point.x, point.y]);
    
    this.edge = new PIXI.Graphics();
    this.edges.addChild(this.edge);
  }

  polygonEndClick(event) {
    event.stopPropagation();

    let polygon = new PIXI.Graphics();
    polygon.points = this.points;
    
    let arr = [];
    for (let row of this.points) for (let e of row) arr.push(e);


    if (this.context.isDrawer)
      polygon.beginFill(0xff0000);
    else
      polygon.beginFill(0x43536B);
    
    polygon.drawPolygon(arr);
    polygon.endFill();

    // Draw on board or pass it to the outer context
    this.context.addChild(polygon);

    this.temp.removeChild(this.edges);
    this.temp.removeChild(this.vertices);

    this.overlay.off('mousemove', this.polygonMove)
                .off('touchmove', this.polygonMove)
                .off('click', this.polygonMiddleClick)
                .off('touchstart', this.polygonMiddleClick)
                .on('click', this.polygonStartClick)
                .on('touchstart', this.polygonStartClick);


    this.vertex.off('click', this.polygonEndClick)
               .off('touchstart', this.polygonEndClick);

  }

  polygonMove(event) {
    event.stopPropagation();
    const x = event.data.global.x;
    const y = event.data.global.y;

    var point = new PIXI.Point(
      (x - this.viewport.x ) / this.viewport.scale.x, 
      (y - this.viewport.y ) / this.viewport.scale.y
    );

    this.edge.clear();
    this.edge.lineStyle(this.boldness, 0xffffff, 0.5);
    this.edge.moveTo(this.points[this.points.length - 1][0], this.points[this.points.length - 1][1]);
    this.edge.lineTo(point.x, point.y);

  }


  // ----------------------------------------

  eraserDown(event) {
    event.stopPropagation();
    this.brush = new PIXI.Graphics();
    this.brush.beginFill(0xffffff);
    this.brush.drawCircle(0, 0, 50);
    this.brush.endFill();
    this.overlay.on('mousemove', this.eraserMove)
                .on('touchmove', this.eraserMove);

    this.overlay.on('mouseup', this.eraserUp)
                .on('mouseupoutside',  this.eraserUp)
                .on('touchend',        this.eraserUp)
                .on('touchendoutside', this.eraserUp);
  }

  eraserMove(event) {
    const x = event.data.global.x;
    const y = event.data.global.y;

    if (!this.sprite) return;

    var point = new PIXI.Point(
      (x - this.viewport.x ) / this.viewport.scale.x - this.sprite.x, 
      (y - this.viewport.y ) / this.viewport.scale.y - this.sprite.y
    );

    this.brush.position.copyFrom(point);
    this.brush.blendMode = PIXI.BLEND_MODES.DST_OUT;
    this.renderer.render(this.brush, this.texture, false, null, false);
  }

  eraserUp(event) {
    this.overlay.off('mousemove', this.eraserMove)
                .off('touchmove', this.eraserMove);

    this.overlay.off('mouseup', this.eraserUp)
                .off('mouseupoutside',  this.eraserUp)
                .off('touchend',        this.eraserUp)
                .off('touchendoutside', this.eraserUp);
  }

  // --------=====x{ METHODS }x=====--------

  drawCustomLine(points, create=false, color='#ff0000', boldness=3) {
    
    var graphics;

    if (create) {
      graphics = new PIXI.Graphics();
      graphics.lineStyle(boldness, color);
    }
    else
      graphics = this.marker;

    if (points.length < 3) {
      var point = points[0];
      graphics.beginFill(color);
      graphics.arcTo(point.x, point.y, boldness / 2, 0, Math.PI * 2, !0);
      graphics.endFill();      
      return graphics;
    }
    
    graphics.moveTo(points[0].x, points[0].y);
    
    for (var i = 1; i < points.length - 2; i++) {
      var c = (points[i].x + points[i + 1].x) / 2;
      var d = (points[i].y + points[i + 1].y) / 2;
      
      graphics.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }
    
    // For the last 2 points
    graphics.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );

    return graphics;
  }

  clear() {
    this.board.removeChildren();
    this.temp.removeChildren();
  }

  convertFromHexToNumericColor(color) {
    return parseInt(`0x${color.replace(/#/g, "")}`);
  }


  setMode(mode, texture=true, context=this.board) {
    
    if (texture) this.transformToTexture();

    this.context = context;

    if (this.mode === mode) this.mode = 'none';
    else this.mode = mode;

    this.overlay.interactive = true;
    this.overlay.removeAllListeners();
    this.temp.removeChildren();

    this.viewport.plugins.pause('drag');

    switch (this.mode) {
      case 'pencil':
        this.overlay.on('mousedown', this.pencilDown)
                    .on('touchstart', this.pencilDown);
        break;

      case 'polygon':
        this.overlay.on('click', this.polygonStartClick)
                    .on('touchstart', this.polygonStartClick);
        break;

      case 'eraser':
        this.overlay.on('mousedown', this.eraserDown)
                    .on('touchstart', this.eraserDown);
        break;

      case 'none':      
      default:
        this.viewport.plugins.resume('drag');
        this.mode = 'none';
        this.overlay.interactive = false;
    }
  }
}