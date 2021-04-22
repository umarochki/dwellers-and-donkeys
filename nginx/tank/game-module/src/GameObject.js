import { Container, Sprite, Text, Graphics } from 'pixi.js-legacy';


export default class GameObject extends Container {

  /**
   * @constructor
   *
   * @param {object} [options] - The optional game object parameters.
   * @param {string} [sprite] - Object image source.
   * @param {number} [width] - Object width.
   * @param {number} [height] - Object height.
   * @param {number[]} [xy] - Object init coordinates: [x, y].
   * @returns {GameObject}
   */
  constructor(options) {
    
    super();

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
      this.updateName(options.name);
    }
    
    this
      // events for drag start
      .on('mousedown',  onDragStart)
      .on('touchstart', onDragStart)
      // events for drag end
      .on('mouseup',         onDragEnd)
      .on('mouseupoutside',  onDragEnd)
      .on('touchend',        onDragEnd)
      .on('touchendoutside', onDragEnd)
      // events for drag move
      .on('mousemove', onDragMove)
      .on('touchmove', onDragMove);

    
    function onDragStart(event) {

      this.updateOverlap();

      this.parent.pause = true;
      this.dragging = true;
      this.data = event.data;
      this.start   = { x: this.x, y: this.y }
      this.current = { x: this.x, y: this.y }
      this.last = { x: event.data.global.x, y: event.data.global.y }

      this.timer = null;

      this.eventManager.notify('update_and_start', {
        id: this.id,
        xy: [this.current.x, this.current.y]
      })

    }

    function onDragEnd(e) {

      //e.stopPropagation();
      // CHECK X Y
      if (Math.abs(this.current.x - this.start.x) <= 2 && Math.abs(this.current.y - this.start.y) <= 2)
        this.onClick(e);

      this.parent.pause = false;
      this.dragging = false;
      this.data = null;

      this.eventManager.notify('update_and_save', {
        id: this.id,
        xy: [this.current.x, this.current.y]
      })
    }

    function onDragMove(e) {
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
  }

  onClick(e) {
    e.stopPropagation();
    this.onSelect();
    this.onResize();
  };


  onSelect() {
    if (this.parent.selectedObject) {
      this.parent.selectedObject.offSelect();
    }

    this.parent.selectedObject = this;

    const [width, height] = [this.sprite.width, this.sprite.height];

    var border = new Graphics();
    this.border = border;
    this.addChild(border);

    var polygons = []
    this.polygons = polygons;
    this.polygons.push({ x:  width / 2, y:  height / 2 });
    this.polygons.push({ x: -width / 2, y:  height / 2 });
    this.polygons.push({ x: -width / 2, y: -height / 2 });
    this.polygons.push({ x:  width / 2, y: -height / 2 });    

    function animate(time) {
      border.clear();
      border.lineStyle(2, 0xffffff, 0.5);
      
      var offsetInterval = 750;
      border.drawDashedPolygon(this.polygons, 0, 0, 0, 10, 5, (Date.now() % offsetInterval + 1) / offsetInterval);
      requestAnimationFrame(animate.bind(this));
    }

    animate.bind(this)();
  }

  offSelect() {
    this.parent.selectedObject = null;
    this.removeChild(this.border);
  }
  
  onResize() {

    const [width, height] = [this.sprite.width, this.sprite.height];

    const angle = new Graphics();
    angle.beginFill(0xffffff, 0.25);
    angle.moveTo(width / 2,      height / 2     );
    angle.lineTo(width / 2,      height / 2 - 15);
    angle.lineTo(width / 2 - 15, height / 2     );
    angle.lineTo(width / 2,      height / 2     );
    angle.interactive = true;
    angle.cursor = 'nwse-resize';
    
    this.border.addChild(angle);

    angle
      // events for drag start
      .on('mousedown',  onResizeStart)
      .on('touchstart', onResizeStart)
      // events for drag end
      .on('mouseup',         onResizeEnd)
      .on('mouseupoutside',  onResizeEnd)
      .on('touchend',        onResizeEnd)
      .on('touchendoutside', onResizeEnd)
      // events for drag move
      .on('mousemove', onResizeMove)
      .on('touchmove', onResizeMove);

    
    function onResizeStart(e) {
      e.stopPropagation();

      this.resizing = true;
      this.data = e.data;
      this.start   = { x: this.parent.parent.sprite.width, y: this.parent.parent.sprite.height }
      this.current = { x: this.parent.parent.sprite.width, y: this.parent.parent.sprite.height }
      this.last = { x: e.data.global.x, y: e.data.global.y }
      this.timer = null;
    }

    function onResizeEnd(e) {
       e.stopPropagation();

      this.resizing = false;
      this.data = null;
    }

    function onResizeMove(e) {

      if (this.resizing) {

        let object = this.parent.parent

        const x = e.data.global.x
        const y = e.data.global.y

        this.current.x += (x - this.last.x) * 2 / object.parent.scale.x; 
        this.current.y += (y - this.last.y) * 2 / object.parent.scale.y;

        this.x = (this.current.x - this.start.x) / 2;
        this.y = (this.current.y - this.start.y) / 2;

        this.last = { x, y };

        object.sprite.width = this.current.x;
        object.sprite.height = this.current.y;

        const [width, height] = [object.sprite.width, object.sprite.height];
        
        object.polygons[0].x = width / 2;
        object.polygons[0].y = height / 2;

        object.polygons[1].x = -width / 2;
        object.polygons[1].y = height / 2;

        object.polygons[2].x = -width / 2;
        object.polygons[2].y = -height / 2;

        object.polygons[3].x = width / 2;
        object.polygons[3].y = -height / 2;

        if (object.name) object.updateName(object.name)

        if (this.timer == null) {

          object.eventManager.notify('update', {
            id: object.id,
            wh: [object.sprite.width,  object.sprite.height]
          })
          
          this.timer = window.setTimeout(() => {
            this.timer = null;
          }, 17);

        }
      }
    }
  } 


  updateName(name) {

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

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  updateSize(w, h) {
    this.sprite.width = w;
    this.sprite.height = h;

    if (this.parent.selectedObject)
      this.parent.selectedObject.offSelect();

    if (this.name) this.updateName(this.name);
  }

  updateOverlap() {
    // Change rendering order of objects
    const parent = this.parent;
    parent.removeChild(this);
    parent.addChild(this);
  }
}