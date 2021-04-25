import * as PIXI from 'pixi.js-legacy';

PIXI.Container.prototype.removeChildren = function() {
  for (var i = this.children.length - 1; i > -1; i--) {  
      this.removeChild(this.children[i])
    };
}