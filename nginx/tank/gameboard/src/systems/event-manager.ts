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

  add(eventType: string, listener: (any) => void, limit = false) {
    this.component.add(eventType, listener, limit)
  }

  remove(eventType: string, listener: (any) => any) {
    this.component.remove(eventType, listener)
  }
}

class EventManagerComponent extends Component {
  private listeners: { [key: string]: ((any) => void)[] }
  private timers: { [key: number]: number }

  constructor() {
    super()
    this.listeners = {}
    this.timers = {}
  }
  
  add(eventType: string, listener: (any) => void, limit = false) {
    this.listeners[eventType] = this.listeners[eventType] || []
    this.listeners[eventType].push(listener)
    this.subscribe(eventType)
    
    if (limit) {
      this.timers[eventType] = 0
    }
  }

  remove(eventType: string, listener: (any) => any) {
    this.listeners[eventType] = this.listeners[eventType].filter(e => e !== listener)
    this.unsubscribe(eventType)
  }

  onMessage(msg: Message) {

    if (!this.timers.hasOwnProperty(msg.action)) {
      for (let i = 0; i < this.listeners[msg.action].length; i++) {
        this.listeners[msg.action][i](msg.data)
      }
    }
    else if (this.timers[msg.action] === 0) {
      
      for (let i = 0; i < this.listeners[msg.action].length; i++) {
        this.listeners[msg.action][i](msg.data)
      }
      
      this.timers[msg.action] = window.setTimeout(() => {
        this.timers[msg.action] = 0
      }, FPS)
    }
  }
}