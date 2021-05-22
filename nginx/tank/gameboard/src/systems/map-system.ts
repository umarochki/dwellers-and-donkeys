import { Component, Container, Scene, Sprite, TilingSprite } from '../libs/pixi-ecs'
import { SVG } from '../libs/pixi-svg';

import createSVGElement from '../utils/create-svg-element';
import DUMMY_MAP_RAW from '../assets/svg';

export default class MapSystem {
    scene: Scene
    private component: MapSystemComponent
    
    constructor(scene: Scene) {
        this.scene = scene;
        this.component = new MapSystemComponent();
        this.scene.addGlobalComponentAndRun(this.component);
    }

    set(options) {
        this.component.set(options)
    }

    reset() {
        this.component.reset()
    }

    switchGrid() : boolean {
        return this.component.switchGrid()
    }
}

class MapSystemComponent extends Component {
    layer: Container
    dummy: SVG
    map: Sprite
    grid: TilingSprite
    
    onAttach() {
        this.layer = new Container();
        this.scene.viewport.addChild(this.layer)
        
        this.initDummyMap()
        this.layer.addChild(this.dummy)
    }

    onDetach() {
        this.scene.viewport.removeChild(this.layer)
        this.layer.destroy()
        this.reset()
    }

    set(options: { sprite: string }) {
        this.layer.removeChildren()
                
        let request : LoaderRequest = {
            resources: [{ 
                name: options.sprite,
                url: options.sprite
            }],
            callback: (_, resources) => {
                this.map = new Sprite('', resources[options.sprite].texture) 
                
                this.grid = new TilingSprite('', resources['grid'].texture, this.map.width, this.map.height);
                this.layer.addChild(this.map)
                this.scene.viewport.moveCenter(this.map.width / 2, this.map.height / 2);
                this.sendMessage('map/set', { width: this.map.width, height: this.map.height })
            }
        }

        this.sendMessage('loader/add', request)
    }

    reset() {
        if (this.map) {
            this.map.destroy()
            this.grid.destroy()
            this.scene.viewport.addChild(this.dummy)
        }
        this.sendMessage('map/reset', {})
    }

    switchGrid() : boolean {
        
        if (this.grid._proxy.isOnScene) {
            this.grid.detach()
            this.sendMessage('map/grid', { enabled: false })
            return false
        }

        this.map.addChild(this.grid)
        this.sendMessage('map/grid', { enabled: true })
        return true
    }

    private initDummyMap() {
        this.dummy = new SVG(createSVGElement(DUMMY_MAP_RAW));
        this.dummy.scale.set(0.5)
        this.dummy.x = this.scene.viewport.screenWidth / 2 - this.dummy.width / 2;
        this.dummy.y = this.scene.viewport.screenHeight / 2 - this.dummy.height / 1.3;
    }
}