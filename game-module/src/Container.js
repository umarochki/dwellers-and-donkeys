import { Container, TilingSprite, Texture, Sprite } from 'pixi.js-legacy';

export default class MapContainer extends Container {

    /**
     * @constructor
     * @param {string} name 
     */
    constructor(grid, parent, img, name = '[noname] container') {
        super()
        this.grid = grid;
        this.img = img;
        this.name = name;

        img.anchor.set(0.5)

        img.x = parent.screenWidth / 2;
        img.y = parent.screenHeight / 2;

        this.addChild(img);
    }

    switchGrid() {
        
        if (this.tilingSprite) {
            this.removeChild(this.tilingSprite); 
            this.tilingSprite = undefined;
            return;
        }

        this.tilingSprite = new TilingSprite(this.grid, this.width, this.height);

        this.tilingSprite.position.x = this.img.x - this.img.width / 2;  //this.parent.x;
        this.tilingSprite.position.y = this.img.y - this.img.height / 2;  //this.parent.y;

        this.addChild(this.tilingSprite);                
    }
}

Sprite.prototype.containsPoint = function (point) {
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
        if (!genHitmap(baseTex, 255)) {
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

function genHitmap(baseTex, threshold) {
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