import { Container, Sprite, Text } from 'pixi.js-legacy';


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

    const sprite = new Sprite(options.texture);
    sprite.anchor.set(0.5);  // Center the sprite's anchor point
    sprite.scale.set(0.1);   // TEMP
    this.sprite = sprite;
    this.addChild(sprite);

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
      text.y += sprite.height / 2 + 10;
      this.addChild(text);
    }
    
    this.position.set(options.xy[0], options.xy[1]);

    this.id = options.id;
    this.eventManager = options.eventManager;

    // TODO: Set sprite size the same as DOM size is (?)
    //obj.width = w;
    //obj.height = h;

    this.interactive = true;

     this
      // events for drag start
      .on('mousedown', onDragStart)
      .on('touchstart', onDragStart)
      // events for drag end
      .on('mouseup', onDragEnd)
      .on('mouseupoutside', onDragEnd)
      .on('touchend', onDragEnd)
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
        xy: [this.x, this.y]
      })

    }

    function onDragEnd(e) {

      //if (Math.abs(this.x - this.start.x) <= 2 && 
      //    Math.abs(this.y - this.start.y) <= 2)
      //      this.onClick(e);

      this.parent.pause = false;
      this.dragging = false;
      this.data = null;

      this.eventManager.notify('update_and_save', {
        id: this.id,
        xy: [this.x, this.y]
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

  };

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