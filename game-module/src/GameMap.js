import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js-legacy';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
//import { InertiaPlugin } from "gsap/InertiaPlugin";


// Register GreenSock plugin
gsap.registerPlugin(PixiPlugin);//, InertiaPlugin);
PixiPlugin.registerPIXI(PIXI);

const loader = new PIXI.Loader();

// Set path to image files
const assetPath = function(filename) { return './' + filename; };

function GameMap(props) {

  const {width, height} = props;

  const appRef = React.useRef();  // Reference to PIXI application
  const divRef = React.useRef();  // Reference to main DOM

  // componentDidMount()
  React.useEffect(() => {

    const app = new PIXI.Application({
      backgroundColor: 0x000,
      width: width,
      height: height,
      forceCanvas: true
    });

    appRef.current = app;

    //app.stage.interactive = true;
    //app.stage.buttonMode = true;

    divRef.current.appendChild(app.view);

    // Load images to PIXI cashe (in case to know their size in advance)
    loader.add('map', assetPath('map.jpg'));
    loader.load(drawMap);

  }, [])

  const drawMap = () => {

    const map = PIXI.Sprite.from(assetPath('map.jpg'));

    var r = map.width / map.height; // ratio
    var pr = width / height;        // parent ratio

    // Scale-to-fit
    //map.scale.set(r < pr ? width / map.width : height / map.height);

    // TEMPORARY: To present dragging
    map.scale.set(3);

    // Center the sprite's anchor point
    map.anchor.set(0.5);

    // Move the sprite to the center of the screen
    map.x = appRef.current.screen.width / 2;
    map.y = appRef.current.screen.height / 2;

    map.interactive = true;

    map
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


    appRef.current.stage.addChild(map);

    // Listen for animate update
    appRef.current.ticker.add((delta) => {
        //map.rotation += 0.01 * delta;
    });
  }

function onDragStart(event) {
    this.dragging = true;
    this.data = event.data;
}

function onDragEnd() {
    this.dragging = false;
    this.data = null;

    //gsap.to(this, {pixi: {scaleX: 2, scaleY: 1.5, skewX: 30, rotation: 60}, duration: 1});
}


// TODO: positions to center better, but doesnt work on iOS
function onDragMove() {
  if (this.dragging) {
    var newX = this.x + this.data.originalEvent.movementX;
    var newY = this.y + this.data.originalEvent.movementY;

    var w = this.width;
    var h = this.height;

    if (newX - w / 2 > 0 || newX + w / 2 < width)
      this.x += 0;
    else 
      this.x = newX;

    if (newY - h / 2 > 0 || newY + h / 2 < height)
      this.y += 0;
    else 
      this.y = newY;    
  }
}

  return (
    <div ref={divRef}></div>
  );
}

GameMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default GameMap;
