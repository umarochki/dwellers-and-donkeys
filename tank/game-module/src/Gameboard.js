import * as PIXI from 'pixi.js-legacy';
import { Viewport } from 'pixi-viewport'
//import { PixiPlugin } from "gsap/PixiPlugin";
//import { gsap } from "gsap";

import MapContainer from './Container';
import GameObject from './GameObject';
import EventManager from './EventManager';

// PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

// Register GreenSock plugin
//gsap.registerPlugin(PixiPlugin);
//PixiPlugin.registerPIXI(PIXI);

export default class Gameboard {
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
    }, options);

    
    this.eventManager = new EventManager();

    // A DOM-element that is currently dragged.
    // Can become a drawn object if dropped on the game map.
    this.draggedDOM = undefined;
    
    this.width = options.width;
    this.height = options.height;

    // Create PIXI application
    this.app = new PIXI.Application(options);

    // Add created canvas to parent element
    if (!options.view)
      options.parent.appendChild(this.app.view);

    return this;
  }

  /*
   * Gameboard preloading function
   *
   */
  preload(assets, callback) {

    const appView = this.app.view;

    // Prevent pinch gesture
    appView.addEventListener('wheel', e => { e.preventDefault(); }, { passive: false });

     // Prevent all drag-related events
    appView.addEventListener("drag", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });
    appView.addEventListener("dragend", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });
    appView.addEventListener("dragenter", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });
    appView.addEventListener("dragexit", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });
    appView.addEventListener("dragleave", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });
    appView.addEventListener("dragover", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });
    appView.addEventListener("dragstart", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });
    appView.addEventListener("drop", e => { e = e || window.event; e.preventDefault(); e.stopPropagation(); });

    // Add drop behavior on PIXI application
    appView.addEventListener('drop', (e) => this.onDrop(e) );
    
    // Listen for window resize events
    window.addEventListener('resize', (e) => this.onResize(e));

    // Add drag event handlers to draggable DOM-elements
    Array.prototype.map.call(document.querySelectorAll('[draggable="true"]'),
      (element) => {
        element.addEventListener('dragstart', (e) => this.draggedDOM = e.target );
      }
    );

    // Load images to PIXI cashe (in case to know their size in advance)
    for (var i = 0 ; i < assets.length; i++) {
      this.app.loader
      .add(assets[i].name, assets[i].path);
    }
    
    this.app.loader.load(() => { 
      this.onLoad();
      typeof callback == "function" && callback();
    });
  }

  // Reset drag event handlers if draggable DOM-elements were recreated
  resetDraggedDOMListeners() {
    Array.prototype.map.call(document.querySelectorAll('[draggable="true"]'),
      (element) => {
        element.removeEventListener('dragstart', (e) => this.draggedDOM = e.target );
        element.addEventListener('dragstart', (e) => this.draggedDOM = e.target );
      }
    );
  }

  // Resize function window
  onResize(e) {

    // Get the parent
    const parent = this.app.view.parentNode;
     
    // Resize the renderer
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
    this.viewport.screenWidth = parent.clientWidth
    this.viewport.screenHeight = parent.clientHeight
  }

  /*
   * Gameboard rendering function
   *
   */
  onLoad() {
    // Create a viewport
    
    const world = { width: 10000, height: 10000 }

    this.viewport = new Viewport({
        screenWidth: this.width,
        screenHeight: this.height,
        worldWidth: world.width,
        worldHeight: world.height,

        interaction: this.app.renderer.plugins.interaction,

        // To prevent interaction with overlay DOM's
        divWheel: this.app.view
    })

    // Add the viewport to the stage
    this.app.stage.addChild(this.viewport)

    // Activate plugins
    this.viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()

    this.viewport.clampZoom({ minScale: .3, maxScale: 2 })
    
    this.viewport.clamp({ 
      left: -world.height, 
      right: world.width, 
      top: -world.height, 
      bottom: world.width 
    })
  }

  /*
   * Dragged DOM-object drop event handler
   *
   * @param {Touch|MouseEvent|PointerEvent} [e] - The normalized event data
   */
  onDrop(e) {

    // Check for dropping correct object
    if (!this.draggedDOM) return;

    /*
    this.addObject({
      sprite: this.draggedDOM.src,
      width: this.draggedDOM.clientWidth,
      height: this.draggedDOM.clientHeight,
      xy: [(e.layerX - this.viewport.x) / this.viewport.scale.x, 
           (e.layerY - this.viewport.y) / this.viewport.scale.y],
    })
    */
    
    this.eventManager.notify('add', {
      sprite: this.draggedDOM.src,
      xy: [(e.layerX - this.viewport.x) / this.viewport.scale.x, 
           (e.layerY - this.viewport.y) / this.viewport.scale.y]
    })

  }

  /* Add object to the viewpoint
   *
   * @param {string} [sprite] - Object image source
   * @param {number} [width] - Object width
   * @param {number} [height] - Object height
   * @param {number[]} [xy] - Object init coordinates
   * @param {function} [callback] - Callback function.
   */
  addObject(options, callback) {

    this._safeLoad(options.sprite, () => {

      const obj = new GameObject({
        id: options.id,
        eventManager: this.eventManager, 
        texture: this.app.loader.resources[options.sprite].texture,
        src: options.sprite,
        width: options.width,
        height: options.height,
        xy: options.xy
      });

      this.viewport.addChild(obj);
      this.draggedDOM = undefined;

      typeof callback == "function" && callback();
      return Promise.resolve();
    });
  }

  updateObjectPosition(options, callback) {
    this.viewport.children[options.id + 1].updatePosition(options.xy[0], options.xy[1]);
    typeof callback == "function" && callback();
  }

  deleteObject(options, callback) {

    var object = this.viewport.children[options.id + 1];
    object.parent.removeChild(object);

    typeof callback == "function" && callback(); 
  }

  refresh(options, callback) {

    let promises = [];

    for (let key in options.game_objects) {
      promises.push(
        this.addObject({
          id: parseInt(key),
          sprite: options.game_objects[key].sprite,
          width: 0, // TODO:
          height: 0, // TODO:
          xy: options.game_objects[key].xy
        })
      )
    }

    Promise.all(promises).then(() => typeof callback == "function" && callback());
  }

  clear(options, callback) {
    for (var i = this.viewport.children.length - 1; i >= 1; i--) {  
      this.viewport.removeChild(this.viewport.children[i])
    };

    typeof callback == "function" && callback(); 
  }

  setMap(options, callback) {
    this._safeLoad(options.sprite, () => {
      // Draw map image as a background
      const image = PIXI.Sprite.from(this.app.loader.resources[options.sprite].texture);

      this.mapContainer = new MapContainer(
        this.app.loader.resources.grid.texture, 
        this.viewport, 
        image
      );
      
      this.viewport.addChild(this.mapContainer);

      this.eventManager.notify('map', { sprite: options.sprite });

      typeof callback == "function" && callback();
    });
  }

  switchGrid() {
    this.mapContainer.switchGrid();

    this.eventManager.notify('grid', { enabled: true });
  }

  _safeLoad(res, callback) {
    // If resource has already been loaded, not doing it again
    if (this.app.loader.resources[res])  {
      callback.bind(this)();
    }
    else {
      this.app.loader.add(res).load(callback.bind(this));
    }
  }
}
