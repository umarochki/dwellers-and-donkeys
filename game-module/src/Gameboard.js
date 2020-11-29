import * as PIXI from 'pixi.js-legacy';
import { Viewport } from 'pixi-viewport'
//import { PixiPlugin } from "gsap/PixiPlugin";
//import { gsap } from "gsap";

import MapContainer from './Container';
import GameObject from './GameObject';


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

    // Init gameboard data
    this.data = { map: '', objects: [], grid: false };

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
    
    // Add drag event handlers to draggable DOM-elements
    Array.prototype.map.call(document.getElementsByClassName('draggable'),
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
      callback();
    });
  }

  /*
   * Gameboard rendering function
   *
   */
  onLoad() {
    // Create a viewport

    console.log();

    
    this.viewport = new Viewport({
        screenWidth: this.width,
        screenHeight: this.height,
        //worldWidth: 1000,
        //worldHeight: 1000,

        interaction: this.app.renderer.plugins.interaction 
    })

    // Add the viewport to the stage
    this.app.stage.addChild(this.viewport)

    // Activate plugins
    this.viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()
  }

  /*
   * Dragged DOM-object drop event handler
   *
   * @param {Touch|MouseEvent|PointerEvent} [e] - The normalized event data
   */
  onDrop(e) {

    // Check for dropping correct object
    if (!this.draggedDOM) return;
    this._safeLoad(this.draggedDOM.src, () => this.addObject(e))
  }

  // Add object to the viewpoint
  addObject(e) {
    const obj = new GameObject(this.app.loader.resources[this.draggedDOM.src].texture);

    // Get DOM-element web size
    var w = this.draggedDOM.clientWidth;
    var h = this.draggedDOM.clientHeight;

    // Move the sprite to the center of the screen
    obj.x = (e.layerX - this.viewport.x) / this.viewport.scale.x;
    obj.y = (e.layerY - this.viewport.y) / this.viewport.scale.y;

    this.viewport.addChild(obj);
    this.draggedDOM = undefined;
  }

  setMap(path, callback) {
    this._safeLoad(path, () => {

      // Draw map image as a background
      const image = PIXI.Sprite.from(this.app.loader.resources[path].texture);

      this.mapContainer = new MapContainer(
        this.app.loader.resources.grid.texture, 
        this.viewport, 
        image
      );
      
      this.viewport.addChild(this.mapContainer);

      callback();
    });
  }

  switchGrid() {
    this.mapContainer.switchGrid();
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

  /*
  // Set callback function for getting gameboard info updates.
  subscribe(callback) {
    this.callback = callback;
  }

  set data(upd) {
    this._data = upd; 

    if (this.callback) 
      this.callback(this._data);
  }

  get data() {
    return this._json;
  };
  */
}
