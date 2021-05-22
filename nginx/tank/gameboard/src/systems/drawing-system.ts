import { Sprite } from 'pixi.js-legacy';
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
}

class DrawingComponent extends Component {
    layer: Container
    color: number
    boldness: number
    mode: DrawingMode

    overlay: Container
    temp: Container
    board: Container

    texture: PIXI.RenderTexture
    sprite: Sprite
    marker: Graphics
    context: Container
    points: ([number, number] | PIXI.Point)[]
    edges: Graphics
    edge: Graphics
    vertices: Container
    vertex: Sprite
    brush: Graphics
    
    constructor(color='#ff0000', boldness=3) {
      super()
      this.color = this.convertFromHexToNumericColor(color)
      this.boldness = boldness
      this.mode = 'none';
    }
    
    onAttach() {
      // Creating drawing layer
      this.layer = new Container();
      this.scene.viewport.addChild(this.layer)

      // Drawing board
      this.board = new Container();
      this.board.assignAttribute('is-drawer', true)
      this.layer.addChild(this.board);

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
    
    // --------=====x{ HANDLERS }x=====--------
    
    pencilDown(event: Event) {
      event.stopPropagation();
      this.marker = new Graphics();
      this.context.addChild(this.marker);
      this.points = [];
      this.overlay.on('mousemove', this.pencilMove);
      this.overlay.on('mouseup', this.pencilUp);
    }
    
    pencilMove(event) {
        const x = event.data.global.x
        const y = event.data.global.y
    
        var point = new PIXI.Point(
          (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
          (y - this.scene.viewport.y) / this.scene.viewport.scale.y
        );
    
        this.points.push(point);
        this.marker.clear();
        this.marker.lineStyle(this.boldness, this.color);
        drawCustomLine(this.marker, this.points);
    }
    
    pencilUp(event) {
        this.overlay.off('mousemove', this.pencilMove);
        this.overlay.off('mouseup', this.pencilUp);
        this.points = [];
    }
    
    // ----------------------------------------
    
    polygonStartClick(event) {
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
    
        this.vertex = new Sprite(this.scene.app.renderer.generateTexture(texture, 1, 1));
        this.vertex.anchor.set(0.5);
        this.vertex.position.copyFrom(point);
        this.vertex.interactive = true;
        this.vertex.cursor = 'pointer';
    
        this.vertices.addChild(this.vertex)
    
    
        this.points = [];
        this.points.push([point.x, point.y]);
    
        this.overlay.on('mousemove', this.polygonMove);
        this.vertex.on('click', this.polygonEndClick);
    
        this.overlay.off('click', this.polygonStartClick);
        this.overlay.on('click', this.polygonMiddleClick);
    }
    
    polygonMiddleClick(event) {
        event.stopPropagation();
        
        const x = event.data.global.x
        const y = event.data.global.y
    
        var point = new PIXI.Point(
          (x - this.scene.viewport.x) / this.scene.viewport.scale.x, 
          (y - this.scene.viewport.y) / this.scene.viewport.scale.y
        );
    
    
    
        this.points.push([point.x, point.y]);
        
        this.edge = new Graphics();
        this.edges.addChild(this.edge);
    }
    
    polygonEndClick(event) {
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
    
        this.overlay.off('mousemove', this.polygonMove)
        this.overlay.off('click', this.polygonMiddleClick)
        this.overlay.on('click', this.polygonStartClick);
    
        this.vertex.off('click', this.polygonEndClick);
    }
    
    polygonMove(event) {
        event.stopPropagation();
        const x = event.data.global.x;
        const y = event.data.global.y;
    
        var point = new PIXI.Point(
          (x - this.scene.viewport.x ) / this.scene.viewport.scale.x, 
          (y - this.scene.viewport.y ) / this.scene.viewport.scale.y
        );
    
        this.edge.clear();
        this.edge.lineStyle(this.boldness, 0xffffff, 0.5);
        this.edge.moveTo(this.points[this.points.length - 1][0], this.points[this.points.length - 1][1]);
        this.edge.lineTo(point.x, point.y);
    
    }
    
    
    // ----------------------------------------
    
    eraserDown(event) {
        event.stopPropagation();
        this.brush = new Graphics();
        this.brush.beginFill(0xffffff);
        this.brush.drawCircle(0, 0, 50);
        this.brush.endFill();
        this.overlay.on('mousemove', this.eraserMove);
        this.overlay.on('mouseup', this.eraserUp);
    }
    
    eraserMove(event) {
        const x = event.data.global.x;
        const y = event.data.global.y;
    
        if (!this.sprite) return;
    
        var point = new PIXI.Point(
          (x - this.scene.viewport.x ) / this.scene.viewport.scale.x - this.sprite.x, 
          (y - this.scene.viewport.y ) / this.scene.viewport.scale.y - this.sprite.y
        );
    
        this.brush.position.copyFrom(point);
        this.brush.blendMode = PIXI.BLEND_MODES.DST_OUT;
        this.scene.app.renderer.render(this.brush, this.texture, false, null, false);
    }
    
    eraserUp(event) {
        this.overlay.off('mousemove', this.eraserMove);
        this.overlay.off('mouseup', this.eraserUp);
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
          this.overlay.on('mousedown', this.pencilDown);
          break;
  
        case 'polygon':
          this.overlay.on('click', this.polygonStartClick);
          break;
  
        case 'eraser':
          this.overlay.on('mousedown', this.eraserDown);
          break;
  
        case 'none':      
        default:
          this.scene.viewport.plugins.resume('drag');
          this.mode = 'none';
          this.overlay.interactive = false;
      }
    }
}