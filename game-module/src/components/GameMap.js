import React from 'react';
import PropTypes from 'prop-types';

import * as PIXI from 'pixi.js-legacy';
import { Viewport } from 'pixi-viewport'

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";


// Register GreenSock plugin
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const loader = new PIXI.Loader();

// Set path to image files
const assetPath = function(filename) { return './' + filename; };

function GameMap(props) {

  const {width, height, mapImagePath, backgroundColor} = props;

  const divRef = React.useRef();  // Reference to the main DOM
  const appRef = React.useRef();  // Reference to PIXI application
  const viewRef = React.useRef();  // Reference to the game viewport

  // A DOM-element that is currently dragged.
  // Can become a drawn "chip" if dropped on the game map.
  const [draggedDOM, setDraggedDOM] = React.useState('');

  // componentDidMount()
  React.useEffect(() => {

    // -----=== CREATE CANVAS ===-----
    const app = new PIXI.Application({
      backgroundColor: backgroundColor,
      width: width,
      height: height,
      forceCanvas: true
    });
    
    appRef.current = app;
    divRef.current.appendChild(app.view);

    //            -----=== ADD DRAGGING EVENT HANDLERS ===-----
    // -----=== TO OUTER DRAGGABLE DOM-ELEMENTS AND CANVAS ITSELF ===-----
    Array.prototype.map.call(document.getElementsByClassName('draggable'),
      (element) => {
        element.addEventListener('dragstart', function (e) {
          setDraggedDOM(e.target.src);
        });
      }
    );

    appRef.current.view
      .addEventListener('dragover', function (e) {
        e.preventDefault(); 
      });

    // Load images to PIXI cashe (in case to know their size in advance)
    app.loader
      .add('map', mapImagePath);

    app.loader.load(drawMap);

  }, [])

  // Update event listener for draggedDOM state
  React.useEffect(() => {
    appRef.current.view.addEventListener('drop', onDraggedDOMDrop);
    return () => appRef.current.view.removeEventListener('drop', onDraggedDOMDrop);
  }, [draggedDOM]);


  // Create a map container
  const drawMap = (loader, resources) => {

    // Create a viewport
    const viewport = new Viewport({
        screenWidth: width,
        screenHeight: height,
        worldWidth: 1000,
        worldHeight: 1000,

        interaction: appRef.current.renderer.plugins.interaction 
    })

    // Add the viewport to the stage
    appRef.current.stage.addChild(viewport)

    // Activate plugins
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()

    // Draw map image as a background
    const bg = PIXI.Sprite.from(loader.resources.map.texture);

    bg.anchor.set(0.5)

    bg.x = viewport.screenWidth / 2;
    bg.y = viewport.screenHeight / 2;

    viewRef.current = viewport;
    viewRef.current.addChild(bg);
  }

// Dragged DOM-object drop event handler
const onDraggedDOMDrop = (e) => {
    
    e.preventDefault();

    if (appRef.current.loader.resources[draggedDOM]) 
      addObjectToGame(e)
    else 
      appRef.current.loader.add(draggedDOM).load(() => addObjectToGame(e));
}

// Add Object to the viewpoint
const addObjectToGame = (e) => {

  const obj = PIXI.Sprite.from(appRef.current.loader.resources[draggedDOM].texture);

      // Center the sprite's anchor point
      obj.anchor.set(0.5);

      // TODO: Set sprite size the same as DOM size is
      obj.scale.set(0.5);

      // Move the sprite to the center of the screen
      obj.x = (e.layerX - viewRef.current.x) / viewRef.current.scale.x;
      obj.y = (e.layerY - viewRef.current.y) / viewRef.current.scale.y;

      obj.interactive = true;

      obj
            // events for drag start
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);

      viewRef.current.addChild(obj);

    function onDragStart(event) {
      viewRef.current.pause = true;
      this.dragging = true;
      this.data = event.data;
      this.last = { x: event.data.global.x, y: event.data.global.y }
    }

    function onDragEnd() {
      viewRef.current.pause = false;
        this.dragging = false;
        this.data = null;
    }

    function onDragMove(e) {
      if (this.dragging) {

        const x = e.data.global.x
        const y = e.data.global.y

        const distX = x - this.last.x
        const distY = y - this.last.y

        const newPoint = { x, y }

        this.x += (newPoint.x - this.last.x) / viewRef.current.scale.x;
        this.y += (newPoint.y - this.last.y) / viewRef.current.scale.y;

        this.last = newPoint
      }
    }
}


  return (
    <div ref={divRef}>
    </div>
  );
}

GameMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  mapImagePath: PropTypes.string,
  backgtoundColor: PropTypes.number
};

export default GameMap;
