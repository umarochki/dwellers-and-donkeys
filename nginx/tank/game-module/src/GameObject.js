import { Sprite } from 'pixi.js-legacy';


export default class GameObject extends Sprite {

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
    
    console.log(options);

    super(options.texture);

    this.position.set(options.xy[0], options.xy[1]);

    this.id = options.id;
    this.eventManager = options.eventManager;

    // Center the sprite's anchor point
    this.anchor.set(0.5);

    // TODO: Set sprite size the same as DOM size is (?)
    //obj.width = w;
    //obj.height = h;

    // TEMP
    this.scale.set(0.1);

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

      this.parent.pause = true;
      this.dragging = true;
      this.data = event.data;
      this.start = { x: this.x, y: this.y }
      this.last = { x: event.data.global.x, y: event.data.global.y }

      // Change rendering order of objects
      const parent = this.parent;
      parent.removeChild(this);
      parent.addChild(this);

    }

    function onDragEnd(e) {

      if (Math.abs(this.x - this.start.x) <= 2 && 
          Math.abs(this.y - this.start.y) <= 2)
            this.onClick(e);

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

        const distX = x - this.last.x
        const distY = y - this.last.y

        const newPoint = { x, y }

        this.x += (newPoint.x - this.last.x) / this.parent.scale.x;
        this.y += (newPoint.y - this.last.y) / this.parent.scale.y;

        this.last = newPoint;

        this.eventManager.notify('update', {
          id: this.id,
          xy: [this.x, this.y]
        })

      }
    }
  }

  onClick(e) {

  };

  updatePosition(x, y) {
        this.x = x;
        this.y = y;
  }


  


}