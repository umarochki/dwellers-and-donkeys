import * as PIXI from 'pixi.js-legacy'
import { Component, Container, Graphics, Message, Scene } from '../libs/pixi-ecs'
import { drawCustomLine } from '../utils/draw'

type DrawingMode = 'none' | 'pencil' | 'eraser' | 'polygon'

export default class DrawingSystem {
    scene: Scene
    private component: DrawingComponent
    
    constructor(scene: Scene) {
        this.scene = scene;
        this.component = new DrawingComponent();
        this.scene.addGlobalComponentAndRun(this.component);
    }

    set(mode: DrawingMode)  {
        this.component.set(mode)
    }

    clear() {
        this.component.clear()
    }

    pencilDown(id: number) {
      this.component.pencilDown(id)
    }

    pencilMove(id: number, point: [number, number][], boldness?, color?) {
      this.component.pencilMove(id, point, boldness, color)
    }

    pencilUp(id: number) {
      this.component.pencilUp(id)
    }
}

class DrawingComponent extends Component {
    layer: Container
    color: number
    boldness: number
    mode: DrawingMode

    overlay: Container
    temp: Container
    board: Container

    markers: { [key: number]: Graphics }
    points: { [key: number]: [number, number][] }
    
    texture: PIXI.RenderTexture
    sprite: PIXI.Sprite
    
    context: Container
    edges: Graphics
    edge: Graphics
    vertices: Container
    vertex: PIXI.Sprite
    brush: Graphics
    
    constructor(color='#ff0000', boldness=3) {
      super()
      this.color = this.convertFromHexToNumericColor(color)
      this.boldness = boldness
      this.mode = 'none';
      
      this.markers = {}
      this.points = {}
    }
    
    onAttach() {
      // Creating drawing layer
      this.layer = new Container();
      this.scene.viewport.addChild(this.layer)

      // Drawing board
      this.board = new Container();
      this.board.assignAttribute('is-drawer', true)
      this.layer.addChild(this.board);

      this.context = this.board;

      // Creating overlay for handling extra event listeners
      this.overlay = new Container();
      this.overlay.cursor = 'auto';
      this.layer.addChild(this.overlay);
      
      // Interactive area that covers the whole gameboard world
      let rect = new Graphics();
      rect.beginFill(0x000000, 1);
      rect.alpha = 0;
      rect.drawRect(
        -this.scene.viewport.worldWidth / 2, 
        -this.scene.viewport.worldHeight / 2, 
        this.scene.viewport.worldWidth, 
        this.scene.viewport.worldHeight
      );
      rect.endFill();
      this.overlay.addChild(rect);
      
      // Stores some auxiliary graphics in process of drawing
      this.temp = new Container();
      this.overlay.addChild(this.temp);
      
      // Bindings
      this.onPencilDown = this.onPencilDown.bind(this);
      this.onPencilMove = this.onPencilMove.bind(this);
      this.onPencilUp = this.onPencilUp.bind(this);
  
      this.onEraserDown = this.onEraserDown.bind(this);
      this.onEraserMove = this.onEraserMove.bind(this);
      this.onEraserUp = this.onEraserUp.bind(this);
  
      this.onPolygonStartClick = this.onPolygonStartClick.bind(this);
      this.onPolygonMiddleClick = this.onPolygonMiddleClick.bind(this);
      this.onPolygonEndClick = this.onPolygonEndClick.bind(this);
      this.onPolygonMove = this.onPolygonMove.bind(this);

      this.subscribe('drawing')
    }

    onMessage(msg: Message) {
      if (msg.action === 'drawing') {
        const {mode, toTexture, context} = msg.data
        this.set(mode, toTexture, context)
      }
    }
    
    transformToTexture() {
      this.texture = this.scene.app.renderer.generateTexture(this.board, 1, 1);
      this.clear();
      this.sprite = new PIXI.Sprite(this.texture);
      this.sprite.x = this.board._localBounds.minX;
      this.sprite.y = this.board._localBounds.minY;
      this.board.addChild(this.sprite);
    }
    
    pencilDown(id: number) {
      // Create marker and points for id
      this.markers[id] = new Graphics()
      this.context.addChild(this.markers[id])
      this.points[id] = []
    }

    pencilMove(id: number, points: [number, number][] = [], boldness = this.boldness, color = this.color) {
      
      if (!this.points[id]) return
      
      this.points[id] = this.points[id].concat(points)
      
      this.markers[id].clear();
      this.markers[id].lineStyle(boldness, color);
            
      if (points.length > 0)
        drawCustomLine(this.markers[id], this.points[id]);
    }

    pencilUp(id: number) {
      // Delete marker and points for id
      //this.context.removeChild(this.markers[id])
      //delete this.markers[id]
      delete this.points[id]
    }
    
    // --------=====x{ HANDLERS }x=====--------
    
    onPencilDown(event: Event) {
      event.stopPropagation();
      this.pencilDown(0)
      this.overlay.on('mousemove', this.onPencilMove);
      this.overlay.on('mouseup', this.onPencilUp);
      this.sendMessage('draw/pencil/start')
    }
    
    onPencilMove(event) {
      const x = event.data.global.x
      const y = event.data.global.y
  
      var point: [number, number] = [
        (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y) / this.scene.viewport.scale.y
      ];
  
      this.pencilMove(0, [point])
      this.sendMessage('draw/pencil/move', { xy: point })
    }
    
    onPencilUp(event) {
      this.overlay.off('mousemove', this.onPencilMove);
      this.overlay.off('mouseup', this.onPencilUp);
      this.pencilUp(0)
      this.sendMessage('draw/pencil/stop')
    }
    
    // ----------------------------------------
    
    onPolygonStartClick(event) {
      event.stopPropagation();
      
      const x = event.data.global.x
      const y = event.data.global.y
  
      var point = new PIXI.Point(
        (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y) / this.scene.viewport.scale.y
      );
  
      this.edges = new Graphics();
      this.temp.addChild(this.edges);
      
      this.vertices = new Container();
      this.vertices.interactive = true;
      this.vertices.cursor = 'pointer';
      this.temp.addChild(this.vertices);
      
      this.edge = new Graphics();
      this.edges.addChild(this.edge);
  
      let texture = new Graphics();
      texture.beginFill(0xffffff, 0.5);
      texture.drawCircle(0, 0, 10)
      texture.endFill();
  
      let center = new Graphics();
      center.beginFill(0xffffff);
      center.drawCircle(0, 0, 5)
      center.endFill();
      texture.addChild(center);
  
      this.vertex = new PIXI.Sprite(this.scene.app.renderer.generateTexture(texture, 1, 1));
      this.vertex.anchor.set(0.5);
      this.vertex.position.copyFrom(point);
      this.vertex.interactive = true;
      this.vertex.cursor = 'pointer';
  
      this.vertices.addChild(this.vertex)
  
  
      this.points[0] = [];
      this.points[0].push([point.x, point.y]);
  
      this.overlay.on('mousemove', this.onPolygonMove);
      this.vertex.on('click', this.onPolygonEndClick);
  
      this.overlay.off('click', this.onPolygonStartClick);
      this.overlay.on('click', this.onPolygonMiddleClick);
    }
    
    onPolygonMiddleClick(event) {
      event.stopPropagation();
      
      const x = event.data.global.x
      const y = event.data.global.y
  
      var point = new PIXI.Point(
        (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y) / this.scene.viewport.scale.y
      );
  
  
  
      this.points[0].push([point.x, point.y]);
      
      this.edge = new Graphics();
      this.edges.addChild(this.edge);
    }
    
    onPolygonEndClick(event) {
      event.stopPropagation();
  
      let polygon = new Graphics();
      polygon.assignAttribute('points', this.points);
      
      let arr = [];
      // @ts-ignore
      for (let row of this.points) for (let e of row) arr.push(e);
  
      if (this.context.getAttribute('is-drawer'))
        polygon.beginFill(0xff0000);
      else
        polygon.beginFill(0x43536B);
      
      polygon.drawPolygon(arr);
      polygon.endFill();
  
      // Draw on board or pass it to the outer context
      this.context.addChild(polygon);
  
      this.temp.removeChild(this.edges);
      this.temp.removeChild(this.vertices);
  
      this.overlay.off('mousemove', this.onPolygonMove)
      this.overlay.off('click', this.onPolygonMiddleClick)
      this.overlay.on('click', this.onPolygonStartClick);
  
      this.vertex.off('click', this.onPolygonEndClick);
    }
    
    onPolygonMove(event) {
      event.stopPropagation();
      const x = event.data.global.x;
      const y = event.data.global.y;
  
      var point = new PIXI.Point(
        (x - this.scene.viewport.x ) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y ) / this.scene.viewport.scale.y
      );
  
      this.edge.clear();
      this.edge.lineStyle(this.boldness, 0xffffff, 0.5);
      this.edge.moveTo(this.points[0][this.points[0].length - 1][0], this.points[0][this.points[0].length - 1][1]);
      this.edge.lineTo(point.x, point.y);
    }
    
    
    // ----------------------------------------
    
    onEraserDown(event) {
      event.stopPropagation();
      this.brush = new Graphics();
      this.brush.beginFill(0xffffff);
      this.brush.drawCircle(0, 0, 50);
      this.brush.endFill();
      this.overlay.on('mousemove', this.onEraserMove);
      this.overlay.on('mouseup', this.onEraserUp);
    }
    
    onEraserMove(event) {
      const x = event.data.global.x;
      const y = event.data.global.y;
  
      if (!this.sprite) return;
  
      var point = new PIXI.Point(
        (x - this.scene.viewport.x ) / this.scene.viewport.scale.x - this.sprite.x, 
        (y - this.scene.viewport.y ) / this.scene.viewport.scale.y - this.sprite.y
      );
  
      this.brush.position.copyFrom(point);
      this.brush.blendMode = PIXI.BLEND_MODES.DST_OUT;
      this.scene.app.renderer.render(this.brush, { 
        renderTexture: this.texture,
        clear: false,
        transform: null,
        skipUpdateTransform: false }
      );
    }
    
    onEraserUp(event) {
        this.overlay.off('mousemove', this.onEraserMove);
        this.overlay.off('mouseup', this.onEraserUp);
    }
    
    // --------=====x{ METHODS }x=====--------    
    
    checkLineIntersection() {
    
    }
    
    clear() {
        this.board.removeChildren();
        this.temp.removeChildren();
    }
    
    convertFromHexToNumericColor(color) {
        return parseInt(`0x${color.replace(/#/g, "")}`);
    }
    
    
    set(mode: DrawingMode, 
        toTexture: boolean = true, 
        context: Container = this.board) {
                
      if (toTexture) this.transformToTexture();
          
      this.context = context;
  
      if (this.mode === mode) this.mode = 'none';
      else this.mode = mode;
  
      this.overlay.interactive = true;
      this.overlay.removeAllListeners();
      this.temp.removeChildren();
  
      this.scene.viewport.plugins.pause('drag');
  
      switch (this.mode) {
        case 'pencil':
          this.overlay.on('mousedown', this.onPencilDown);
          break;
  
        case 'polygon':
          this.overlay.on('click', this.onPolygonStartClick);
          break;
  
        case 'eraser':
          this.overlay.on('mousedown', this.onEraserDown);
          break;
  
        case 'none':      
        default:
          this.scene.viewport.plugins.resume('drag');
          this.mode = 'none';
          this.overlay.interactive = false;
      }
    }
}