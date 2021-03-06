import { Component, Container, Scene, Sprite, TilingSprite, Message } from '../libs/pixi-ecs'
import { SVG } from '../libs/pixi-svg';
import * as PIXI from 'pixi.js-legacy'
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

    get width() {
        return this.component.width
    }

    get height() {
        return this.component.height
    }
    
    set(options, callback?: () => any) {
        this.component.set(options, callback)
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
    
    get width() {
        return (this.map) ? this.map.width : 0
    }

    get height() {
        return (this.map) ? this.map.height : 0
    }
    
    onAttach() {
        this.layer = new Container('map-container');
        this.scene.viewport.addChild(this.layer)
        
        this.initDummyMap()
        this.layer.addChild(this.dummy)
        this.subscribe(/*'map/set',*/ 'map/get')
    }

    onMessage(msg: Message) {
        if (msg.action === 'map/set') {
            this.set({sprite: msg.data.sprite })
        } 
        else if (msg.action === 'map/get') {
            return { map: this.map }
        }

        return undefined;
    }

    onDetach() {
        this.scene.viewport.removeChild(this.layer)
        this.layer.destroy()
        this.reset()
    }

    set(options: { sprite: string }, callback?: () => any) {
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
                this.sendMessage('map/set/after', { sprite: options.sprite, width: this.map.width, height: this.map.height })
                typeof callback == "function" && callback();    
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
        this.sendMessage('map/reset/after', {})
    }

    switchGrid() : boolean {
        
        if (this.grid.parent) {
            this.grid.detach()
            this.sendMessage('map/grid/after', { enabled: false })
            return false
        }

        this.map.addChild(this.grid)
        this.sendMessage('map/grid/after', { enabled: true })
        return true
    }

    private initDummyMap() {
        this.dummy = new SVG(createSVGElement(DUMMY_MAP_RAW));
        this.dummy.scale.set(0.5)
        this.dummy.x = this.scene.viewport.screenWidth / 2 - this.dummy.width / 2;
        this.dummy.y = this.scene.viewport.screenHeight / 2 - this.dummy.height / 1.3;
    }
}