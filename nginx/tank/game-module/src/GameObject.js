import { Container, Sprite, Text, Graphics } from 'pixi.js-legacy';


export default class GameObject extends Container {

  /**
   * @constructor
   *
   * @param {object} [options] - The optional game object parameters.
   * @param {object} [viewport] - The gameboard viewport.
   * @param {string} [sprite] - Object image source.
   * @param {number[]} [xy] - Object init coordinates: [x, y].
   * @param {number[]} [wh] - Object init size: [width, height].
   * @returns {GameObject}
   */
  constructor(options) {
    
    super();

    this.viewport = options.viewport;

    this.sprite = new Sprite(options.texture);
    this.sprite.anchor.set(0.5);  // Center the sprite's anchor point
    this.sprite.scale.set(0.1);   // TEMP
    this.addChild(this.sprite);

    this.position.set(options.xy[0], options.xy[1]);

    this.id = options.id;
    this.eventManager = options.eventManager;

    // TODO: Set sprite size the same as DOM size is (?)
    //obj.width = w;
    //obj.height = h;

    this.interactive = true;
    this.cursor = 'pointer';
    
    if (options.name) {
      this.name = options.name;
      this.redrawText(options.name);
    }
    
    this.polygons = [{ x: 0, y: 0 }, 
                     { x: 0, y: 0 }, 
                     { x: 0, y: 0 }, 
                     { x: 0, y: 0 }];

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResizeMove = this.onResizeMove.bind(this);
    this.onResizeEnd = this.onResizeEnd.bind(this);   

    this.animate = this.animate.bind(this); 

    this
      // events for drag start
      .on('mousedown',  this.onDragStart)
      .on('touchstart', this.onDragStart)
  }

  onClick(e) {
    e.stopPropagation();
    this.onSelect();
  };
  
  onSelect() {
    
    this.eventManager.notify('click', {
      id: this.id
    })

    if (this.viewport.selectedObject)
      this.viewport.selectedObject.offSelect();

    this.viewport.selectedObject = this;

    const [width, height] = [this.sprite.width, this.sprite.height];

    // -----=== SELECTION BORDER ===-----
    var border = new Graphics();
    this.border = border;
    this.addChild(border);

    // -----=== RESIZE ANGLE ===-----
    const angle = new Graphics();
    angle.interactive = true;
    angle.cursor = 'nwse-resize';
    this.border.addChild(angle);
    this.calculateBorder();
    this.redrawAngle();
    this.animate();
    if (this.name) this.calculateText()

    this.beforeResize = { w: this.sprite.width, h: this.sprite.height };

    angle
      // events for drag start
      .on('mousedown',  this.onResizeStart)
      .on('touchstart', this.onResizeStart)
      // events for drag end
      .on('mouseup',         this.onResizeEnd)
      .on('mouseupoutside',  this.onResizeEnd)
      .on('touchend',        this.onResizeEnd)
      .on('touchendoutside', this.onResizeEnd)
      // events for drag move
      .on('mousemove', this.onResizeMove)
      .on('touchmove', this.onResizeMove);
  }

  offSelect() {
    this.viewport.selectedObject = null;
    this.removeChild(this.border);
  }

  onDragStart(e) {
    this.updateOverlap();

    this.viewport.pause = true;
    this.dragging = true;
    
    this.start   = { x: this.x, y: this.y }
    this.current = { x: this.x, y: this.y }
    this.last = { x: e.data.global.x, y: e.data.global.y }
    this.timer = null;

    this
      // events for drag end 
      .on('mouseup',         this.onDragEnd)
      .on('mouseupoutside',  this.onDragEnd)
      .on('touchend',        this.onDragEnd)
      .on('touchendoutside', this.onDragEnd)
      // events for drag move
      .on('mousemove', this.onDragMove)
      .on('touchmove', this.onDragMove);

    this.eventManager.notify('update_and_start', {
      id: this.id,
      xy: [this.current.x, this.current.y]
    })
  }

  onDragEnd(e) {
    // CHECK X Y
    if (Math.abs(this.current.x - this.start.x) <= 2 && Math.abs(this.current.y - this.start.y) <= 2)
      this.onClick(e);

    this.viewport.pause = false;
    this.dragging = false;

    this.eventManager.notify('update_and_save', {
      id: this.id,
      xy: [this.current.x, this.current.y]
    })
  }

  onDragMove(e) {
    if (this.dragging) {

      const x = e.data.global.x
      const y = e.data.global.y

      this.current.x += (x - this.last.x) / this.parent.scale.x; 
      this.current.y += (y - this.last.y) / this.parent.scale.y;

      this.last = { x, y };

      this.x = this.current.x;
      this.y = this.current.y;

      if (this.timer == null) {

        this.eventManager.notify('update', {
          id: this.id,
          xy: [this.current.x, this.current.y]
        })
        
        this.timer = window.setTimeout(() => {
          this.timer = null;
        }, 17);
      }
    }
  }

  onResizeStart(e) {
    e.stopPropagation();

    this.resizing = true;
    this.data = e.data;
    this.current = { x: this.sprite.width, y: this.sprite.height }
    this.start = { x: this.sprite.width, y: this.sprite.height }
    this.last = { x: e.data.global.x, y: e.data.global.y }
    this.timer = null;
  }

  onResizeEnd(e) {
     e.stopPropagation();

    this.resizing = false;
    this.data = null;
  }

  onResizeMove(e) {

    if (this.resizing) {

      const [width, height] = [this.sprite.width, this.sprite.height];
      const [x, y] = [e.data.global.x, e.data.global.y]

      console.log(this);

      this.current.x += (x - this.last.x) * 2 / this.parent.scale.x; 
      this.current.y += (y - this.last.y) * 2 / this.parent.scale.y;

      this.last = { x, y };

      this.sprite.width = this.current.x;
      this.sprite.height = this.current.y;

      this.calculateBorder();
      this.calculateAngle();
      this.redrawBorder();

      if (this.name) this.calculateText()

      if (this.timer == null) {
        this.eventManager.notify('update', {
          id: this.id,
          wh: [this.sprite.width,  this.sprite.height]
        })
        
        this.timer = window.setTimeout(() => {
          this.timer = null;
        }, 17);

      }
    }
  }


  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  updateSize(w, h) {
    this.sprite.width = w;
    this.sprite.height = h;

    if (this.parent.selectedObject)
      this.parent.selectedObject.offSelect();

    if (this.name) this.calculateText();
  }

  updateOverlap() {
    // Change rendering order of objects
    const parent = this.parent;
    parent.removeChild(this);
    parent.addChild(this);
  }

  calculateText() {
    this.text.y = this.sprite.height / 2 + 10;
  }

  calculateBorder(w = this.sprite.width, h = this.sprite.height) {
    this.polygons[0].x =  w / 2;
    this.polygons[0].y =  h / 2;
    this.polygons[1].x = -w / 2;
    this.polygons[1].y =  h / 2;
    this.polygons[2].x = -w / 2;
    this.polygons[2].y = -h / 2;
    this.polygons[3].x =  w / 2;
    this.polygons[3].y = -h / 2;
  }

  calculateAngle(w, h) {
    if (!w || !h) {
      w = (this.sprite.width - this.beforeResize.w) / 2;
      h = (this.sprite.height - this.beforeResize.h) / 2;
    }

    const angle = this.border.getChildAt(0);
    angle.x = w;
    angle.y = h;
  }

  redrawText(name) {
    if (this.text) this.removeChild(this.text);

    this.text = new Text(
      name,
      {
        fontFamily : 'Arial', 
        fontSize: 20, 
        fill : 0xffffff, 
        align : 'center',
        fontWeight: "bold",
        strokeThickness: 5
      }
    );

    this.text.anchor.set(0.5, 0);  
    this.text.y += this.sprite.height / 2 + 10;
    this.addChild(this.text);
  }

  redrawAngle(w = this.sprite.width, h = this.sprite.height) {
    const angle = this.border.getChildAt(0);
    angle.clear();
    angle.beginFill(0xffffff, 0.25);
    angle.moveTo(w / 2,      h / 2     );
    angle.lineTo(w / 2,      h / 2 - 15);
    angle.lineTo(w / 2 - 15, h / 2     );
    angle.lineTo(w / 2,      h / 2     );
  }

  redrawBorder(offset = 750) {
    this.border.clear();
    this.border.lineStyle(2, 0xffffff, 0.5);
    this.border.drawDashedPolygon(this.polygons, 0, 0, 0, 10, 5, (Date.now() % offset + 1) / offset);
  }

  animate(time) {
    this.redrawBorder();
    requestAnimationFrame(this.animate);
  }
}