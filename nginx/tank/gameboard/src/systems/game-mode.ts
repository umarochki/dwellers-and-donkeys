import { Component, Scene, Container, Message } from '../libs/pixi-ecs'

export default class Gamemode {
    scene: Scene
    private component: GamemodeComponent
    
    constructor(scene: Scene, isGameMaster: boolean) {
        this.scene = scene;
        this.component = new GamemodeComponent(isGameMaster);
        this.scene.addGlobalComponentAndRun(this.component);
    }

    me(options: { id: number }, callback?: () => any) {
        this.component.me(options, callback)
    }
}

class GamemodeComponent extends Component {
    isGameMaster: boolean
    userId: Container

    constructor(isGameMaster: boolean) {
        super()
        this.isGameMaster = isGameMaster
        this.userId = undefined
    }

    me(options: { id: number }, callback?: () => any) {
        if (this.isGameMaster) 
            throw new Error(`You are the Game Master!`)
        
        let obj = this.scene.findObjectByName(String(options.id))
        if (!obj) 
            throw new Error(`Cannot find an element with id: ${options.id}`)
        
        if ((obj.getAttribute('options') as any).type !== 'hero') 
            throw new Error(`Object is not a hero: ${options.id}`)

        // magic
        
        typeof callback == "function" && callback(); 
    }
}