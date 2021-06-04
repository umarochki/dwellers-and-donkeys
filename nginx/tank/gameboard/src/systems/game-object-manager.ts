import { Component, Scene, Container, Message } from '../libs/pixi-ecs'
import GameObjectBuilder from '../entities/game-object-builder'

export default class GameObjectManager {
    scene: Scene
    private component: GameObjectManagerComponent
    
    constructor(scene: Scene) {
        this.scene = scene;
        this.component = new GameObjectManagerComponent();
        this.scene.addGlobalComponentAndRun(this.component);
    }

    add(options: ObjectOptions, callback?: () => any) {
        this.component.add(options, callback)
    }

    delete(options: { id: number }, callback?: () => any) {
        this.component.delete(options)
        typeof callback == "function" && callback();    
    }

    update(options: { id: number, xy?: [number, number], wh?: [number, number] }, callback?: () => any) {
        this.component.update(options)
        typeof callback == "function" && callback();    
    }

    refresh(options: { game_objects: { [key: number]: ObjectOptions }}, callback?: () => any) {
        this.component.refresh(options, callback)
    }
    
    clear(callback?: () => any) {
        this.component.clear()
        typeof callback == "function" && callback();    
    }
}

class GameObjectManagerComponent extends Component {
    layer: Container

    onAttach() {
        this.layer = new Container('game-object-container');
        this.scene.viewport.addChild(this.layer)
    }

    add(options: ObjectOptions, callback?: () => any) {
        if (this.scene.findObjectByName(String(options.id)))
            throw new Error(`Object with id ${options.id} already exists`)

        let request : LoaderRequest = {
            resources: [{ 
                name: options.sprite,
                url: options.sprite
            }],
            callback: (_, resources) => {
                let obj = GameObjectBuilder({
                    ...options,
                    texture: resources[options.sprite].texture,
                    wh: [0, 0],
                } as ObjectOptions); 
                this.layer.addChild(obj)
                this.scene.sendMessage(new Message('object/added', undefined, obj))
                typeof callback == "function" && callback(); 
            }
        }

        this.sendMessage('loader/add', request)
    }
    
    delete(options: { id: number }) {
        let obj = this.scene.findObjectByName(String(options.id))
        if (!obj) throw new Error(`Cannot find an element with id: ${options.id}`)
        this.scene.sendMessage(new Message('object/unselect', undefined, undefined))
        obj.destroy();
        
        this.sendMessage('object/deleted', {
            id: options.id
          })
    }

    update(options: any) {
        let obj = this.scene.findObjectByName(String(options.id))
        if (!obj) throw new Error(`Cannot find an element with id: ${options.id}`)
        if (options.wh) this.scene.sendMessage(new Message('object/resize', undefined, obj, { width: options.wh[0], height: options.wh[1] }))
        if (options.xy) this.scene.sendMessage(new Message('object/position', undefined, obj, { x: options.xy[0], y: options.xy[1] }))
        if (options.location) this.scene.sendMessage(new Message('object/location/set', undefined, obj, { location: options.location }))
        else if (options.location === null) this.scene.sendMessage(new Message('object/location/unset', undefined, obj ))
    }

    refresh(options: { game_objects: { [key: number]: ObjectOptions }}, callback?: () => any) {
        this.clear()
        
        let resources = [];
        
        for (let key in options.game_objects) {
            let obj = options.game_objects[key]
            if (this.scene.findObjectByName(String(obj.id))) throw new Error(`Object with id ${obj.id} already exists`)
            
            resources.push({ 
                name: obj.sprite,
                url: obj.sprite
            })
        }

        let request : LoaderRequest = {
            resources: resources,
            callback: (_, resources) => {

                for (let key in options.game_objects) {
                    
                    let obj = GameObjectBuilder({
                        ...options.game_objects[key],
                        texture: resources[options.game_objects[key].sprite].texture,
                        wh: [0, 0],
                    } as ObjectOptions); 

                    this.layer.addChild(obj)
                    this.scene.sendMessage(new Message('object/added', undefined, obj))
                }
                
                typeof callback == "function" && callback(); 
            }
        }
        
        this.sendMessage('loader/add', request)
    }
    
    clear() {
        this.scene.sendMessage(new Message('object/unselect', undefined, undefined))
        this.layer.destroyChildren()
    }
}