import { Component, Scene, Container, Message } from '../libs/pixi-ecs'
import * as PIXI from 'pixi.js-legacy'

const AMOUNT = 1000
const fov = 20;
const baseSpeed = 0.025;
const starStretch = 5;
const starBaseSize = 0.05;

export default class FilterManager {
    scene: Scene
    private component: FilterManagerComponent
    
    constructor(scene: Scene) {
        this.scene = scene;
        this.component = new FilterManagerComponent();
        this.scene.addGlobalComponentAndRun(this.component);
    }

    night() : boolean  {
        return this.component.night()
    }

    rain() : boolean {
        return false // TODO: this.component.rain()
    }

}

class FilterManagerComponent extends Component {
    layer: Container
    mode: 'night' | 'rain' | 'none'

    cameraZ: number;
    speed: number;
    warpSpeed: number;

    stars: { sprite: PIXI.Sprite; z: number; x: number; y: number; }[]

    onAttach() {
        this.layer = new Container('filter-container');
        this.scene.viewport.addChild(this.layer)

        this.mode = 'none'
        
        // Get the texture for rope.
        const starTexture = PIXI.Texture.from('star.png');

        // Create the stars
        this.stars = [];
        for (let i = 0; i < AMOUNT; i++) {
            const star = {
                sprite: new PIXI.Sprite(starTexture),
                z: 0,
                x: 0,
                y: 0,
            };

            star.sprite.anchor.x = 0.5;
            star.sprite.anchor.y = 0.7;
            
            this.stars.push(star);
            this.layer.addChild(this.stars[i].sprite);
            this.stars[i].sprite.alpha = 0
        }

        for (let star of this.stars) {
            star.sprite.alpha = 0;
            this.randomizeStar(star, true);
        }

        this.cameraZ = 0;
        this.speed = 0;
        this.warpSpeed = 0;

        this.nightTicker = this.nightTicker.bind(this)
    }

    night() : boolean {
        
        if (this.mode === 'night' || this.mode === 'rain')  {
            this.mode = 'none'

            for (let star of this.stars) {
                star.sprite.alpha = 0;
                this.randomizeStar(star, true);
            }

            this.scene.app.ticker.remove(this.nightTicker);
            let map = this.sendMessage('map/get').responses.responses[0].data.map
            if (map) { map.filters = [] }

            return false;   
        }
        else {
            this.mode = 'night'
            
            
            for (let star of this.stars) {
                star.sprite.alpha = 1;
            }

            // Listen for animate update
            this.scene.app.ticker.add(this.nightTicker)
            //t.destroy()
            
            let colorMatrix = new PIXI.filters.ColorMatrixFilter();
            let map = this.sendMessage('map/get').responses.responses[0].data.map
            if (map) {
                map.filters = [colorMatrix]
                colorMatrix.night(0.5, false);
                colorMatrix.alpha = 0.3
            }
            
            return true;
        }
    }

    randomizeStar(star, initial) {
        let cameraZ = 0;
        star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

        // Calculate star positions with radial random coordinate so no star hits the camera.
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }

    nightTicker(delta) {
        // Simple easing. This should be changed to proper easing function when used for real.
        this.speed += (this.warpSpeed - this.speed) / 20;
        this.cameraZ += delta * 10 * (this.speed + baseSpeed);
        for (let i = 0; i < AMOUNT; i++) {
            const star = this.stars[i];
            if (star.z < this.cameraZ) this.randomizeStar(star, undefined);
    
            // Map star 3d position to 2d with really simple projection
            const z = star.z - this.cameraZ;
            star.sprite.x = star.x * (fov / z) * this.scene.app.renderer.screen.width + this.scene.app.renderer.screen.width / 2;
            star.sprite.y = star.y * (fov / z) * this.scene.app.renderer.screen.width + this.scene.app.renderer.screen.height / 2;
    
            // Calculate star scale & rotation.
            const dxCenter = star.sprite.x - this.scene.app.renderer.screen.width / 2;
            const dyCenter = star.sprite.y - this.scene.app.renderer.screen.height / 2;
            const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
            const distanceScale = Math.max(0, (2000 - z) / 2000);
            star.sprite.scale.x = distanceScale * starBaseSize;
            // Star is looking towards center so that y axis is towards center.
            // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
            star.sprite.scale.y = distanceScale * starBaseSize + distanceScale * this.speed * starStretch * distanceCenter / this.scene.app.renderer.screen.width;
            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
        }
    }
    
}


