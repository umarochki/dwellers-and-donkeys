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

    pencilDown(options: { sender: number, boldness?, color? }) {
      this.component.pencilDown(options.sender, options.boldness, options.color)
    }

    pencilMove(options: { sender: number, xy: [number, number][] }) {
      this.component.pencilMove(options.sender, options.xy)
    }

    pencilUp(options: { sender: number }) {
      this.component.pencilUp(options.sender)
    }

    eraserDown(options: {sender: number}) {
      this.component.eraserDown()
    }

    eraserMove(options: {sender: number, xy: [number, number][]}) {
      this.component.eraserMove(options.xy)
    }

    eraserUp(options: { sender: number }) {
      this.component.eraserUp()
    }

    polygonClickStart(options: { sender: number, xy: [number, number], color?: string }) {
      this.component.polygonClickStart(options.sender, options.xy, options.color)
    }

    polygonClickMiddle(options: { sender: number, xy: [number, number] }) {
      this.component.polygonClickMiddle(options.sender, options.xy)
    }

    polygonClickEnd(options: { sender: number }) {
      this.component.polygonClickEnd(options.sender)
    }

    polygonMove(options: { sender: number, xy: [number, number]}) {
      this.component.polygonMove(options.sender, options.xy)
    }

    polygonAdd(options: { sender: number, xy: [number, number][], color: string }) {
      this.component.polygonAdd(options.sender, options.xy, options.color)
    }

    style(options: { color?: string, boldness?: number }) {
      this.component.style(options)
    }
}

class DrawingComponent extends Component {
    layer: Container
    
    context: Container
    mode: DrawingMode

    overlay: Container
    temp: Container
    board: Container

    markers: { [key: number]: Graphics }
    points: { [key: number]: [number, number][] }
    color: { [key: number]: number }
    boldness: { [key: number]: number }
    
    texture: PIXI.RenderTexture
    sprite: PIXI.Sprite
    
    edges: Graphics
    edge: Graphics
    vertices: Container
    vertex: PIXI.Sprite
    brush: Graphics
    
    constructor(color=0xff0000, boldness=3) {
      super()
      
      this.mode = 'none';
      this.markers = {}
      this.points = {}
      this.color = {}
      this.boldness = {}
      this.color[0] = color
      this.boldness[0] = boldness
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
    
    pencilDown(id: number, boldness = this.boldness[0], color?: string) {
      // Create marker and points for id
      this.markers[id] = new Graphics()
      this.boldness[id] = boldness
      
      if (!color) this.color[id] = this.color[0]
      else this.color[id] = this.convertFromHexToNumericColor(color) 

      this.points[id] = []

      this.context.addChild(this.markers[id])
    }

    pencilMove(id: number, points: [number, number][] = []) {
      
      if (!this.points[id]) return
      
      this.points[id] = this.points[id].concat(points)
      
      this.markers[id].clear();
      this.markers[id].lineStyle(this.boldness[id], this.color[id]);
            
      if (points.length > 0)
        drawCustomLine(this.markers[id], this.points[id]);
    }

    pencilUp(id: number) {
      // Delete marker and points for id
      //this.context.removeChild(this.markers[id])
      delete this.points[id]
      delete this.markers[id]
      if (id !== 0) {
        delete this.boldness[id]
        delete this.color[id]
      }
    }

    eraserDown() {
      this.brush = new Graphics();
      this.brush.beginFill(0xffffff);
      this.brush.drawCircle(0, 0, 50);
      this.brush.endFill();
    }

    eraserMove(points: [number, number][]) {
      for (let point of points) {
        this.brush.position.set(point[0], point[1]);
        this.brush.blendMode = PIXI.BLEND_MODES.DST_OUT;
        this.scene.app.renderer.render(this.brush, { 
          renderTexture: this.texture,
          clear: false,
          transform: null,
          skipUpdateTransform: false }
        );
      }
    }

    eraserUp() { }

    polygonClickStart(id: number, point: [number, number],  color?: string) {
      
      if (!color) this.color[id] = this.color[0]
      else this.color[id] = this.convertFromHexToNumericColor(color)
      
      // Edges container creation
      this.edges = new Graphics();
      this.temp.addChild(this.edges);
      
      // Edge creation
      this.edge = new Graphics();
      this.edges.addChild(this.edge);

      // Vertices container creation
      this.vertices = new Container();
      this.vertices.interactive = true;
      this.vertices.cursor = 'pointer';
      this.temp.addChild(this.vertices);
  
      this.points[id] = [];
      this.points[id].push(point);
    }

    polygonClickMiddle(id: number, point: [number, number]) {
      this.points[id].push(point);
      this.edge = new Graphics();
      this.edges.addChild(this.edge);
    }

    polygonClickEnd(id: number) {
      this.temp.removeChild(this.edges);
      this.temp.removeChild(this.vertices);
    }

    polygonMove(id: number, point: [number, number]) {
      this.edge.clear();
      this.edge.lineStyle(this.boldness[0], 0xffffff, 0.5);
      this.edge.moveTo(this.points[id][this.points[id].length - 1][0], this.points[id][this.points[id].length - 1][1]);
      this.edge.lineTo(point[0], point[1]);
    }

    polygonAdd(id: number, xy: [number, number][], color?: string ) {
      
      
      let polygon = new Graphics();
      polygon.assignAttribute('points', xy);
      let arr = [];
      // @ts-ignore
      for (let row of xy) for (let e of row) arr.push(e);
      polygon.beginFill(this.convertFromHexToNumericColor(color));
      polygon.drawPolygon(arr);
      polygon.endFill();
  
      // Draw on board or pass it to the outer context
      this.context.addChild(polygon);
    }
    
    // --------=====x{ HANDLERS }x=====--------
    
    onPencilDown(event: Event) {
      event.stopPropagation();
      this.pencilDown(0)
      this.overlay.on('mousemove', this.onPencilMove);
      this.overlay.on('mouseup', this.onPencilUp);
      this.sendMessage('draw/pencil/started', { color: this.convertFromNumericColorToHex(this.color[0]) })
    }
    
    onPencilMove(event) {
      const x = event.data.global.x
      const y = event.data.global.y
  
      var point: [number, number] = [
        (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y) / this.scene.viewport.scale.y
      ];
  
      this.pencilMove(0, [point])
      this.sendMessage('draw/pencil/moved', { xy: point })
    }
    
    onPencilUp() {
      this.pencilUp(0)
      this.overlay.off('mousemove', this.onPencilMove);
      this.overlay.off('mouseup', this.onPencilUp);
      this.sendMessage('draw/pencil/stopped', {})
      this.points[0] = []
    }

    // ----------------------------------------

    onEraserDown(event) {
      event.stopPropagation();
      this.eraserDown()
      this.overlay.on('mousemove', this.onEraserMove);
      this.overlay.on('mouseup', this.onEraserUp);
      this.sendMessage('draw/eraser/started', {})
    }
    
    onEraserMove(event) {
      const x = event.data.global.x;
      const y = event.data.global.y;
  
      if (!this.sprite) return;
  
      var point : [number, number] = 
      [ (x - this.scene.viewport.x ) / this.scene.viewport.scale.x - this.sprite.x, 
        (y - this.scene.viewport.y ) / this.scene.viewport.scale.y - this.sprite.y ];
  
      this.eraserMove([point])
      this.sendMessage('draw/eraser/moved', { xy: point })
    }
    
    onEraserUp() {
        this.eraserUp()
        this.overlay.off('mousemove', this.onEraserMove);
        this.overlay.off('mouseup', this.onEraserUp);
        this.sendMessage('draw/eraser/stopped', {})
    }
    
    // ----------------------------------------
    
    onPolygonStartClick(event) {
      event.stopPropagation();
      
      const x = event.data.global.x
      const y = event.data.global.y
  
      var point : [number, number] = [
        (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y) / this.scene.viewport.scale.y
      ];
      
      this.polygonClickStart(0, point)
  
      // Vertex creation
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
      this.vertex.position.set(point[0], point[1]);
      this.vertex.interactive = true;
      this.vertex.cursor = 'pointer';
  
      this.vertices.addChild(this.vertex)
      
      this.overlay.on('mousemove', this.onPolygonMove);
      this.vertex.on('click', this.onPolygonEndClick);
  
      this.overlay.off('click', this.onPolygonStartClick);
      this.overlay.on('click', this.onPolygonMiddleClick);
      this.sendMessage('draw/polygon/click/started', { xy: point, color: this.convertFromNumericColorToHex(this.color[0]) })
    }
    
    onPolygonMiddleClick(event) {
      event.stopPropagation();
      
      const x = event.data.global.x
      const y = event.data.global.y
  
      var point : [number, number] = [
        (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y) / this.scene.viewport.scale.y
      ];
  
      this.polygonClickMiddle(0, point)
      this.sendMessage('draw/polygon/click/middle', { xy: point })
    }
    
    onPolygonEndClick(event) {
      event.stopPropagation();
  
      this.polygonClickEnd(0)

      if (!this.context.getAttribute('is-drawer')) {
        this.sendMessage('region/obstacle/add', { xy: this.points[0] })
      }
      else {
        this.sendMessage('draw/polygon/add', { xy: this.points[0], color: this.convertFromNumericColorToHex(this.color[0]) })
      }
  
      this.overlay.off('mousemove', this.onPolygonMove)
      this.overlay.off('click', this.onPolygonMiddleClick)
      this.overlay.on('click', this.onPolygonStartClick);
  
      this.vertex.off('click', this.onPolygonEndClick);
      this.sendMessage('draw/polygon/click/stopped', {})
    }
    
    onPolygonMove(event) {
      event.stopPropagation();
      const x = event.data.global.x;
      const y = event.data.global.y;
  
      var point : [number, number] = [
        (x - this.scene.viewport.x ) / this.scene.viewport.scale.x, 
        (y - this.scene.viewport.y ) / this.scene.viewport.scale.y
      ];
  
      this.polygonMove(0, point)
      this.sendMessage('draw/polygon/moved', { xy: point })
    }
    
    // --------=====x{ METHODS }x=====--------    
    
    checkLineIntersection() {
      // TODO
    }
    
    clear() {
        this.board.removeChildren();
        this.temp.removeChildren();
    }
    
    convertFromHexToNumericColor(color: string) {
        return parseInt(`0x${color.replace(/#/g, "")}`);
    }

    convertFromNumericColorToHex(i: number){
      let c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();
  
      return "#" + "00000".substring(0, 6 - c.length) + c;
  }
    
    style(options: { color?: string, boldness?: number }) {
      if (options.color) this.color[0] = this.convertFromHexToNumericColor(options.color)
      if (options.boldness) this.boldness[0] = options.boldness
    }
    
    set(mode: DrawingMode, 
        toTexture: boolean = true, 
        context: Container = this.board) : DrawingMode {
                
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
          break
  
        case 'polygon':
          this.overlay.on('click', this.onPolygonStartClick);
          break
  
        case 'eraser':
          this.overlay.on('mousedown', this.onEraserDown);
          break
  
        case 'none':      
        default:
          this.scene.viewport.plugins.resume('drag');
          this.mode = 'none';
          this.overlay.interactive = false;
          break
      }

      return this.mode
    }
}