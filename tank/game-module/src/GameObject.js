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


  containsPoint(point) {
      const tempPoint = {x: 0, y: 0 }

      // Get mouse poisition relative to the object anchor point
      this.worldTransform.applyInverse(point, tempPoint);

      const width = this._texture.orig.width;
      const height = this._texture.orig.height;
      const x1 = -width * this.anchor.x;
      let y1 = 0;

      let flag = false;

      // Collision detection for sprite (as a square, not pixel perfect)
      if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
          y1 = -height * this.anchor.y;

          if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
              flag = true;
          }
      }

      // If collision not detected, return false
      if (!flag)
          return false
      
      // Bitmap check
      const tex = this.texture;
      const baseTex = this.texture.baseTexture;
      const res = baseTex.resolution;

      if (!baseTex.hitmap) {

          // Generate hitmap
          if (!this.genHitmap(baseTex, 255)) {
              return true;
          }
      }

      const hitmap = baseTex.hitmap;
      // this does not account for rotation yet!!!

      //check mouse position if its over the sprite and visible
      let dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
      let dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
      let ind = (dx + dy * baseTex.realWidth);
      let ind1 = ind % 32;
      let ind2 = ind / 32 | 0;
      return (hitmap[ind2] & (1 << ind1)) !== 0;
  }

  genHitmap(baseTex, threshold) {
      //check sprite props
      if (!baseTex.resource) {
          //renderTexture
          return false;
      }
      const imgSource = baseTex.resource.source;
      let canvas = null;
      if (!imgSource) {
          return false;
      }
      let context = null;
      if (imgSource.getContext) {
          canvas = imgSource;
          context = canvas.getContext('2d');
      } else if (imgSource instanceof Image) {
          canvas = document.createElement('canvas');
          canvas.width = imgSource.width;
          canvas.height = imgSource.height;
          context = canvas.getContext('2d');
          context.drawImage(imgSource, 0, 0);
      } else {
          //unknown source;
          return false;
      }
      
      const w = canvas.width, h = canvas.height;
      let imageData = context.getImageData(0, 0, w, h);
      //create array
      let hitmap = baseTex.hitmap = new Uint32Array(Math.ceil(w * h / 32));
      //fill array
      for (let i = 0; i < w * h; i++) {
          //lower resolution to make it faster
          let ind1 = i % 32;
          let ind2 = i / 32 | 0;
          //check every 4th value of image data (alpha number; opacity of the pixel)
          //if it's visible add to the array
          if (imageData.data[i * 4 + 3] >= threshold) {
              hitmap[ind2] = hitmap[ind2] | (1 << ind1);
          }
      }
    return true;
  }


}