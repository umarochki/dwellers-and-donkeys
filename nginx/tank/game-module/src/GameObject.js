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

    if (options.name) {
      let text = new Text(
        options.name,
        {
          fontFamily : 'Arial', 
          fontSize: 20, 
          fill : 0xffffff, 
          align : 'center',
          fontWeight: "bold",
          strokeThickness: 5
        }
      );
      text.anchor.set(0.5);  
      text.y += this.sprite.height / 2 + 10;
      this.addChild(text);
    }
    
    this.position.set(options.xy[0], options.xy[1]);

    this.id = options.id;
    this.eventManager = options.eventManager;

    // TODO: Set sprite size the same as DOM size is (?)
    //obj.width = w;
    //obj.height = h;

    this.interactive = true;
    this.cursor = 'pointer';
    
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
    this.onEdit();
  };

  
  onEdit() {

    if (this.parent.selectedObject) {
      this.parent.selectedObject.offEdit();
    }

    this.parent.selectedObject = this;

    const [width, height] = [this.sprite.width, this.sprite.height];

    var border = new Graphics();
    this.border = border;
    this.addChild(border);

    var polygons = [];
    polygons.push({ x:  width / 2, y:  height / 2 });
    polygons.push({ x: -width / 2, y:  height / 2 });
    polygons.push({ x: -width / 2, y: -height / 2 });
    polygons.push({ x:  width / 2, y: -height / 2 });    

    function animate(time) {
      border.clear();
      border.lineStyle(2, 0xffffff, 0.5);
      
      var offsetInterval = 750;
      border.drawDashedPolygon(polygons, 0, 0, 0, 10, 5, (Date.now() % offsetInterval + 1) / offsetInterval);
      requestAnimationFrame(animate);
    }

    animate();

    const angle = new Graphics();
    angle.beginFill(0xffffff, 0.25);
    angle.moveTo(width / 2,      height / 2     );
    angle.lineTo(width / 2,      height / 2 - 20);
    angle.lineTo(width / 2 - 20, height / 2     );
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
      this.start   = { x: this.parent.parent.width, y: this.parent.parent.height }
      this.current = { x: this.parent.parent.width, y: this.parent.parent.height }
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

        const x = e.data.global.x
        const y = e.data.global.y

        this.current.x += (x - this.last.x) / this.parent.scale.x; 
        this.current.y += (y - this.last.y) / this.parent.scale.y;

        this.last = { x, y };

        this.parent.parent.width = this.current.x;
        this.parent.parent.height = this.current.y;

        if (this.timer == null) {

          this.timer = window.setTimeout(() => {
            this.timer = null;
          }, 17);

        }
      }
    }
  } 

  offEdit() {
    this.parent.selectedObject = null;
    this.removeChild(this.border);
  }


  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  updateOverlap() {
    // Change rendering order of objects
    const parent = this.parent;
    parent.removeChild(this);
    parent.addChild(this);
  }
}