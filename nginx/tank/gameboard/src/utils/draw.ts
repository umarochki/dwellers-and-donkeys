import { Graphics } from 'pixi.js-legacy'

function drawPolygon(graphics, points) {
    points.push(points[0]);
    if (typeof points[0] == 'number') points.push(points[1]);

    graphics.drawPolygon(points);
}

function drawPolygonWithHoles(graphics, outer, holes) {
  graphics.currentPath = null;
  drawPolygon(graphics, outer);
  graphics.beginHole();
  for (let i=0;i<holes.length;i++)
      drawPolygon(graphics, holes[i]);
  graphics.endHole();
}

function drawCustomLine(graphics, points: [number, number][], color='#ff0000', boldness=3) {
  if (points.length < 3) {
    var point = points[0];
    graphics.beginFill(color);
    graphics.arcTo(point[0], point[1], boldness / 2, 0, Math.PI * 2, !0);
    graphics.endFill();      
    return graphics;
  }
  
  graphics.moveTo(points[0][0], points[0][1]);
  
  for (var i = 1; i < points.length - 2; i++) {
    var c = (points[i][0] + points[i + 1][0]) / 2;
    var d = (points[i][1] + points[i + 1][1]) / 2;
    
    graphics.quadraticCurveTo(points[i][0], points[i][1], c, d);
  }
  
  // For the last 2 points
  graphics.quadraticCurveTo(
    points[i][0],
    points[i][1],
    points[i + 1][0],
    points[i + 1][1]
  );
}

function drawDashedPolygon(
    graphics: Graphics,
    polygons: {x: number, y: number}[], 
    x, y, rotation, dash, gap, offsetPercentage) {

    var i;
    var p1;
    var p2;
    var dashLeft = 0;
    var gapLeft = 0;
    if(offsetPercentage>0){
        var progressOffset = (dash+gap)*offsetPercentage;
        if(progressOffset < dash) dashLeft = dash-progressOffset;
        else gapLeft = gap-(progressOffset-dash);
    }
    var rotatedPolygons = [];
    for(i = 0; i<polygons.length; i++){
        var p = {x:polygons[i].x, y:polygons[i].y};
        var cosAngle = Math.cos(rotation);
        var sinAngle = Math.sin(rotation);
        var dx = p.x;
        var dy = p.y;
        p.x = (dx*cosAngle-dy*sinAngle);
        p.y = (dx*sinAngle+dy*cosAngle);
        rotatedPolygons.push(p);
    }
    for(i = 0; i<rotatedPolygons.length; i++){
        p1 = rotatedPolygons[i];
        if(i == rotatedPolygons.length-1) p2 = rotatedPolygons[0];
        else p2 = rotatedPolygons[i+1];
        var dx = p2.x-p1.x;
        var dy = p2.y-p1.y;
        var len = Math.sqrt(dx*dx+dy*dy);
        var normal = {x:dx/len, y:dy/len};
        var progressOnLine = 0;
        graphics.moveTo(x+p1.x+gapLeft*normal.x, y+p1.y+gapLeft*normal.y);
        while(progressOnLine<=len){
        progressOnLine+=gapLeft;
        if(dashLeft > 0) progressOnLine += dashLeft;
        else progressOnLine+= dash;
        if(progressOnLine>len){
            dashLeft = progressOnLine-len;
            progressOnLine = len;
        }else{
            dashLeft = 0;
        }
        graphics.lineTo(x+p1.x+progressOnLine*normal.x, y+p1.y+progressOnLine*normal.y);
        progressOnLine+= gap;
        if(progressOnLine>len && dashLeft == 0){
            gapLeft = progressOnLine-len;
        }else{
            gapLeft = 0;
            graphics.moveTo(x+p1.x+progressOnLine*normal.x, y+p1.y+progressOnLine*normal.y);
        }
        }
    }
}

export { drawPolygon, drawPolygonWithHoles, drawCustomLine, drawDashedPolygon }