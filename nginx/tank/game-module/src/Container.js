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
