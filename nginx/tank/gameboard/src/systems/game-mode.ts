import { Component, Scene, Container, Message } from '../libs/pixi-ecs'

export default class Gamemode {
    scene: Scene
    private component: GamemodeComponent
    
    constructor(scene: Scene, isGameMaster: boolean) {
        this.scene = scene;
        this.component = new GamemodeComponent(isGameMaster);
        this.scene.addGlobalComponentAndRun(this.component);
    }

    me(options: { id: number }) {
        this.component.me(options)
    }

    set(mode: boolean) : boolean {
        return this.component.set(mode)
    } 
}

class GamemodeComponent extends Component {
    isGameMaster: boolean
    user: Container

    constructor(isGameMaster: boolean) {
        super()
        this.isGameMaster = isGameMaster || false
        this.user = undefined
    }

    onAttach() {
        this.subscribe('gamemode/mode/get', 'gamemode/mode/set', 'gamemode/user/get', 'gamemode/user/set')
    }

    onMessage(msg: Message) {
        switch (msg.action) {
            case 'gamemode/mode/get':
                return { mode: this.isGameMaster }
            case 'gamemode/user/get':
                return this.user
            case 'gamemode/user/set':
                this.me(msg.data)
                return undefined;
            default: 
                // TODO
                return undefined
        }
    }

    me(options: { id: number }) {
        if (this.isGameMaster) 
            throw new Error(`You are the Game Master! You cannot have a user object!`)
        
        let obj = this.scene.findObjectByName(String(options.id))
       
        if (!obj) 
            throw new Error(`Cannot find an element with id: ${options.id}`)
        
        if ((obj.getAttribute('options') as any).type !== 'hero') 
            throw new Error(`Object is not a hero: ${options.id}`)

        this.user = obj;
        this.scene.sendMessage(new Message('gamemode/user/set/after', undefined, obj, { id: obj.name }))
    }

    set(mode: boolean) : boolean {
        this.isGameMaster = mode;
        if (this.user) this.user = undefined
        this.sendMessage('gamemode/mode/set/after')
        return mode
    }
}