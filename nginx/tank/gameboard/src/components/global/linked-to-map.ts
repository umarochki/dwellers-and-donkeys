import * as PIXI from 'pixi.js-legacy'
import { Component, Sprite, Message, Container, Graphics } from '../../libs/pixi-ecs'
import * as CONSTANTS from '../../constants'
import { SVG } from '../../libs/pixi-svg';

import createSVGElement from '../../utils/create-svg-element';
import DUMMY_MAP_RAW from '../../assets/svg';

export default class LinkedToMapSystem extends Component {

    onInit() {
        this.subscribe('object/added', 'object/location/set', 'object/location/reset')
    }
    
    onMessage(msg: Message) {
        if (msg.action === 'object/added') {
            let obj = msg.gameObject
            if (obj.hasFlag(CONSTANTS.FLAGS.LINKED_TO_MAP))
                this.init(obj)
        }
        else if (msg.action === 'object/location/set') {
            this.set(msg.gameObject, msg.data.location)
        }
        else if (msg.action === 'object/location/unset') {
            this.unset(msg.gameObject)   
        }
    }

    init(obj: Container) {

        let frame = new Container()
        frame.position.y = -obj.height / 2 - 10
        obj.addChild(frame)
        obj.assignAttribute('map', frame)
        
        let location = (obj.getAttribute('options') as any).location as string
        
        if (location) {
            this.set(obj, location)          
        }
        else {
            let dummy = this.setDummy()
            dummy.x = -dummy.width / 2
            dummy.y = -dummy.height / 2 - frame.parent.height / 2
            frame.addChild(dummy)
        }
    }

    setDummy() : Graphics {
        let rect = new Graphics()
        rect.beginFill(0x000000, 0.5);
        rect.drawRect(0, 0, 200, 120);
        rect.endFill();

        let dummy = new SVG(createSVGElement(DUMMY_MAP_RAW));
        dummy.scale.set(180 / dummy.width)
        dummy.x = rect.width / 2 - dummy.width / 2
        dummy.y = rect.height / 2 - dummy.height / 2
        rect.addChild(dummy)

        return rect
    }
    
    set(obj: Container, location: string) {

        let request : LoaderRequest = {
            resources: [{ 
                name: location,
                url: location
            }],
            callback: (_, resources) => {

                let frame = obj.getAttribute('map') as Graphics
                let map = new Sprite('', resources[location].texture)

                obj.assignAttribute('options', { location: location, ...obj.getAttribute('options')})
                
                map.anchor.set(0.5, 1)
                map.scale.set(map.width > map.height ? 200 / map.width : 200 / map.height)
                
                frame.removeChildren()
                frame.addChild(map)

                map.interactive = true;
                (map as any).clickable = false;
                
                map.on('mousedown', (e: PIXI.InteractionEvent) => {  (e as any).clickable = false })
                map.on('pointerdown', (e: PIXI.InteractionEvent) => {  (e as any).clickable = false })
                map.on('click', (e: Event) => { this.sendMessage('map/set', { sprite: location }) })
                map.on('pointertap', (e: Event) => this.sendMessage('map/set', { sprite: location }) )
            }
        }

        this.sendMessage('loader/add', request)  
    }

    unset(obj: Container) {
        let frame = obj.getAttribute('map') as Graphics
        frame.destroyChildren()
        let dummy = this.setDummy()
        dummy.x = -dummy.width / 2
        dummy.y = -dummy.height / 2 - frame.parent.height / 2 - 10
        frame.addChild(dummy)
    }
}