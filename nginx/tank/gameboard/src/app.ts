// app.ts
import * as ECS from './libs/pixi-ecs'
import { Viewport } from './libs/pixi-viewport'

import EventManager from './systems/event-manager'
import Loader from './loader'

import LoaderSystem from './systems/loader-system'
import MapSystem from './systems/map-system'
import DragAndDrop from './systems/drag-and-drop'
import GameObjectManager from './systems/game-object-manager'
import DrawingSystem from './systems/drawing-system'
import VisibilityRegion from './systems/visibility-region'

import Selection from './components/global/selection-system'
import TransformSystem from './components/global/transform-system'
import LinkedToMapSystem from './components/global/linked-to-map'

export default class Gameboard {
    private engine: ECS.Engine
    loader: Loader
    
    eventManager: EventManager
    dragAndDrop: DragAndDrop
    map: MapSystem
    gameObjectManager: GameObjectManager
    visibilityRegion: VisibilityRegion
    drawing: DrawingSystem

    isGameMaster: boolean
  
    /*
    * Gameboard Constructor
    *
    * @param {object} [options] - The optional gameboard parameters.
    * @param {number} [options.width=800] - Width of PIXI application.
    * @param {number} [options.height=600] - Height of PIXI application.
    * @param {HTMLCanvasElement} [options.view] - The canvas to use as a view, optional.
    * @param {boolean} [options.transparent=false] - If the render view is transparent.
    * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area.
    * @param {string} [options.spritesheet] - Path to the spritesheet file that PIXI's loader should load.
    * @param {Window|HTMLElement} [options.resizeTo] - Element to automatically resize stage to.
    * @returns {Gameboard}
    */
    constructor(options) {      
      options = Object.assign({
        forceCanvas: false,
        antialias: true
      }, options)
      
      this.isGameMaster = options.isGameMaster || true
      
      this.engine = new ECS.Engine()  
      this.engine.init(options)
      
      // Add created canvas to parent element
      if (!options.view)
        options.parent.appendChild(this.engine.app.view);
      
      this.loader = new Loader()
    }
  
    init(assets: { name: string, url: string }[], callback?: () => any) {
      
      const view = this.engine.app.view

      // Prevent pinch gesture
      view.addEventListener('wheel', e => { e.preventDefault() }, { passive: false })

      // Prevent all drag-related events
      view.addEventListener("drag",      e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
      view.addEventListener("dragend",   e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
      view.addEventListener("dragenter", e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
      view.addEventListener("dragexit",  e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
      view.addEventListener("dragleave", e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
      view.addEventListener("dragover",  e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
      view.addEventListener("dragstart", e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
      view.addEventListener("drop",      e => { e = e || window.event as DragEvent; e.preventDefault(); e.stopPropagation() })
            
      // Load images to PIXI cache
      this.loader.loadMany({
        resources: assets, 
        callback: (loader, resources) => {
          this.onLoad()
          typeof callback == "function" && callback() 
        }
      })
    }
    
    private onLoad = () => {
      const world = { width: 10000, height: 10000 }

      // Create a viewport
      let viewport = new Viewport({
        screenWidth: this.engine.app.view.width,
        screenHeight: this.engine.app.view.height,
        worldWidth: world.width,
        worldHeight: world.height,
        stopPropagation: true,
        interaction: this.engine.app.renderer.plugins.interaction,
        // To prevent interaction with overlay DOM's
        divWheel: this.engine.app.view
      })

      // Activate plugins
      viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()
        .clampZoom({ minScale: .3, maxScale: 2 })
        .clamp({ 
          left: -world.height / 2, 
          right: world.width / 2, 
          top: -world.height / 2, 
          bottom: world.width / 2 
        })

      // Unselect object by clicking anywhere
      viewport.on('clicked', () => {
        this.engine.scene.sendMessage(new ECS.Message('clicked', undefined, viewport));
      })

      // Set viewport as a stage
      this.engine.scene.viewport = viewport

      // Listen for window resize events
      window.addEventListener('resize', (e) => {
        //@ts-ignore
        viewport.resize(this.engine.app.resizeTo.clientWidth, this.engine.app.resizeTo.clientHeight)
      })
      
      // Set viewport cursor style
      viewport.cursor = 'move'

      // -------------------------------------------------------
      // Default board configuration is done. Adding API & global components
      // -------------------------------------------------------

      this.engine.scene.addGlobalComponentAndRun(new LoaderSystem(this.loader))
      this.engine.scene.addGlobalComponentAndRun(new Selection())
      this.engine.scene.addGlobalComponentAndRun(new TransformSystem())
      this.engine.scene.addGlobalComponentAndRun(new LinkedToMapSystem())

      this.eventManager = new EventManager(this.engine.scene)
      this.dragAndDrop = new DragAndDrop(this.engine.scene)
      
      this.map = new MapSystem(this.engine.scene)
      this.gameObjectManager = new GameObjectManager(this.engine.scene)
      this.visibilityRegion = new VisibilityRegion(this.engine.scene, this.isGameMaster)
      this.drawing = new DrawingSystem(this.engine.scene)
    }
  }