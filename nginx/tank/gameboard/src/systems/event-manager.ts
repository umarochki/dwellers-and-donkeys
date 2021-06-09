import { Component, Message, Scene } from '../libs/pixi-ecs'

const FPS = 60

export default class EventManager {
  scene: Scene
  private component: EventManagerComponent
    
  constructor(scene: Scene) {
    this.scene = scene;
    this.component = new EventManagerComponent();
    this.scene.addGlobalComponentAndRun(this.component);
  }

  add(eventType: string, listener: (any) => void, limit: boolean = false, accumulate: string[] = []) {
    this.component.add(eventType, listener, limit, accumulate)
  }

  remove(eventType: string, listener: (any) => any) {
    this.component.remove(eventType, listener)
  }
}

class EventManagerComponent extends Component {
  private listeners: { [key: string]: ((any) => void)[] }
  private timers: { [key: string]: (number | null)[] }
  private cache: { [key: string]: any }

  constructor() {
    super()
    this.listeners = {}
    this.timers = {}
    this.cache = {}
  }
  
  add(eventType: string, listener: (any) => void, limit: boolean = false, accumulate: string[] = []) {
    this.listeners[eventType] = this.listeners[eventType] || []
    this.listeners[eventType].push(listener)
    this.timers[eventType] = this.timers[eventType] || []
    this.timers[eventType].push(limit ? 0 : null)
    
    let acc = {}
    accumulate.map((prop) => acc[prop] = [])

    this.cache[eventType] = this.cache[eventType] || []
    this.cache[eventType].push(accumulate.length > 0 ? acc : null)
    this.subscribe(eventType)
  }

  remove(eventType: string, listener: (any) => any) {
    let index = this.listeners[eventType].indexOf(e => e === listener)
    this.listeners[eventType].splice(index, 1)
    this.timers[eventType].splice(index, 1)
    this.cache[eventType].splice(index, 1)
    this.unsubscribe(eventType)
  }

  onMessage(msg: Message) {

    for (let i = 0; i < this.listeners[msg.action].length; i++) {
                  
      if (this.timers[msg.action][i] === null)
        this.listeners[msg.action][i](msg.data)
      
      else if (this.timers[msg.action][i] === 0) {

        this.timers[msg.action][i] = window.setTimeout(() => {
          this.timers[msg.action][i] = 0
          if (!!this.cache[msg.action][i]) {
            this.listeners[msg.action][i](Object.assign(msg.data, this.cache[msg.action][i]))
            for (let prop in this.cache[msg.action][i]) this.cache[msg.action][i][prop] = []
          }
          else this.listeners[msg.action][i](msg.data)
          
        }, FPS)
      }
      else {
        if (!!this.cache[msg.action][i]) 
          this.mergeObjectsByKey(this.cache[msg.action][i], msg.data)
      }
    }
  }

  private mergeObjectsByKey(acc, ...objs) {
    return objs.reduce((_, obj) => {
      for (let k in acc) 
        if (obj[k]) acc[k].push(obj[k]);
        
      return acc;
    }, {});
  }
}