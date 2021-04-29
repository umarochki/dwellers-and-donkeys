import * as PIXI from 'pixi.js-legacy';

export default class VisionRegion extends PIXI.Container {

  constructor(drawer, renderer) {
    super();

    // Drawing manager will help to create an obstacle
    this.drawer = drawer;
    this.renderer = renderer;
    this.mode = 'none';

    this.overlay = new PIXI.Container();
    this.addChild(this.overlay);

    this.border = [];
    this.segments = [];

    this.polygon = new PIXI.Graphics();
    
    this.context = new PIXI.Container();
    this.addChild(this.context);


    this.contextToSegments = this.contextToSegments.bind(this);
    this.context.onChildrenChange = this.contextToSegments;
  }

  redrawBorders(width, height) {
    this.border = [[-1, -1], [width + 1, -1], [width + 1, height + 1], [-1, height + 1]];
    this.context.removeChildren();
    
    this.texture = PIXI.RenderTexture.create(width, height);
    
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.alpha = 0;
    this.sprite.blendMode = PIXI.BLEND_MODES.DST_IN;
    this.overlay.addChild(this.sprite);
  }

  contextToSegments() {
   
    if (this.border.length === 0) {
      console.warn('Cannot calculate vision region: no map was loaded.');
      return;
    }

    let polygons = [];
    polygons.push(this.border);

    for (let i = 0; i < this.context.children.length; i++)
      polygons.push(this.context.getChildAt(i).points);

    let segments = this._convertToSegments(polygons);
    segments = this._breakIntersections(segments);
    
    this.segments = segments;

    console.log(this.context);
  }

  getRegion(position) {

    if (this._inPolygon(position, this.border)) {
      var visibility = this.compute(position, this.segments);

      if (visibility.length === 0) return;

      this.polygon.clear();
      this.polygon.beginFill(0xffffff);
      this.polygon.drawPolygon(visibility);
      this.polygon.endFill();

      this.sprite.alpha = 1;
      this.renderer.render(this.polygon, this.texture, true, null, false);
    }
    else {
      //console.warn('Out of polygon!');
    }
   
  }

  clear() {
    this.sprite.alpha = 0;
    this.polygon.clear();
    this.context.removeChildren();
  }

  hide() {
    this.polygon.clear();
  }


  setMode(mode) {
    
    if (this.mode === mode) this.mode = 'none';
    else this.mode = mode;

    switch (this.mode) {
      case 'draw':
        this.drawer.setMode('polygon', true, this.context);
        break;

      case 'none':      
      default:
        this.drawer.setMode('none', false);
        break;
    }
  }

  // ----------------------------------------

  compute(position, segments) {
    var polygon = [];
    var sorted = this._sortPoints(position, segments);
    var map = new Array(segments.length);
    
    for (var i = 0; i < map.length; ++i) map[i] = -1;
    var heap = [];
    var start = [position[0] + 1, position[1]];
    
    for (var i = 0; i < segments.length; ++i) {
      var a1 = this._angle(segments[i][0], position);
      var a2 = this._angle(segments[i][1], position);
      var active = false;
      if (a1 > -180 && a1 <= 0 && a2 <= 180 && a2 >= 0 && a2 - a1 > 180) active = true;
      if (a2 > -180 && a2 <= 0 && a1 <= 180 && a1 >= 0 && a1 - a2 > 180) active = true;
      if (active) {
        this._insert(i, heap, position, segments, start, map);
      }
    }

    for (var i = 0; i < sorted.length;) {
      var extend = false;
      var shorten = false;
      var orig = i;
      var vertex = segments[sorted[i][0]][sorted[i][1]];
      var old_segment = heap[0];
      
      do {
        if (map[sorted[i][0]] != -1) {
          if (sorted[i][0] == old_segment) {
            extend = true;
            vertex = segments[sorted[i][0]][sorted[i][1]];
          }
          this._remove(map[sorted[i][0]], heap, position, segments, vertex, map);
        } else {
          this._insert(sorted[i][0], heap, position, segments, vertex, map);
          if (heap[0] != old_segment) {
            shorten = true;
          }
        }
        ++i;
        if (i == sorted.length) break;
      } while (sorted[i][2] < sorted[orig][2] + this._epsilon());

      if (extend) {
        polygon.push(...vertex);
        var cur = this._intersectLines(segments[heap[0]][0], segments[heap[0]][1], position, vertex);
        if (!this._equal(cur, vertex)) polygon.push(...cur);
      } else if (shorten) {
        polygon.push(...this._intersectLines(segments[old_segment][0], segments[old_segment][1], position, vertex));
        polygon.push(...this._intersectLines(segments[heap[0]][0], segments[heap[0]][1], position, vertex));
      } 
    }
    return polygon;
  };

  _inPolygon(position, polygon) {
    var val = 0;
    for (var i = 0; i < polygon.length; ++i) {
      val = Math.min(polygon[i][0], val);
      val = Math.min(polygon[i][1], val);
    }
    var edge = [val-1, val-1];
    var parity = 0;
    for (var i = 0; i < polygon.length; ++i) {
      var j = i + 1;
      if (j == polygon.length) j = 0;
      if (this._doLineSegmentsIntersect(edge[0], edge[1], position[0], position[1], polygon[i][0], polygon[i][1], polygon[j][0], polygon[j][1])) {
        var intersect = this._intersectLines(edge, position, polygon[i], polygon[j]);
        if (this._equal(position, intersect)) return true;
        if (this._equal(intersect, polygon[i])) {
          if (this._angle2(position, edge, polygon[j]) < 180) ++parity;
        } else if (this._equal(intersect, polygon[j])) {
          if (this._angle2(position, edge, polygon[i]) < 180) ++parity;
        } else {
          ++parity;
        }
      }
    }
    return (parity%2)!=0;
  };

  _convertToSegments(polygons) {
    var segments = [];
    for (var i = 0; i < polygons.length; ++i) {
      for (var j = 0; j < polygons[i].length; ++j) {
        var k = j+1;
        if (k == polygons[i].length) k = 0;
        segments.push([polygons[i][j], polygons[i][k]]);
      }
    }
    return segments;
  };

  _breakIntersections(segments) {
    var output = [];
    for (var i = 0; i < segments.length; ++i) {
      var intersections = [];
      for (var j = 0; j < segments.length; ++j) {
        if (i == j) continue;
        if (this._doLineSegmentsIntersect(segments[i][0][0], segments[i][0][1], segments[i][1][0], segments[i][1][1], segments[j][0][0], segments[j][0][1], segments[j][1][0], segments[j][1][1])) {
          var intersect = this._intersectLines(segments[i][0], segments[i][1], segments[j][0], segments[j][1]);
          if (intersect.length != 2) continue;
          if (this._equal(intersect, segments[i][0]) || this._equal(intersect, segments[i][1])) continue;
          intersections.push(intersect);
        }
      }
      var start = segments[i][0];
      while (intersections.length > 0) {
        var endIndex = 0;
        var endDis = this._distance(start, intersections[0]);
        for (var j = 1; j < intersections.length; ++j) {
          var dis = this._distance(start, intersections[j]);
          if (dis < endDis) {
            endDis = dis;
            endIndex = j;
          }
        }
        output.push([[start[0], start[1]], [intersections[endIndex][0], intersections[endIndex][1]]]);
        start[0] = intersections[endIndex][0];
        start[1] = intersections[endIndex][1];
        intersections.splice(endIndex, 1);
      }
      output.push([start, segments[i][1]]);
    }
    return output;
  };

  _epsilon() {
    return 0.0000001;
  };

  _equal(a, b) {
    if (Math.abs(a[0] - b[0]) < this._epsilon() && Math.abs(a[1] - b[1]) < this._epsilon()) return true;
    return false;
  };

  _remove(index, heap, position, segments, destination, map) {
    map[heap[index]] = -1;
    if (index == heap.length - 1) {
      heap.pop();
      return;
    }
    heap[index] = heap.pop();
    map[heap[index]] = index;
    var cur = index;
    var parent = this._parent(cur);
    if (cur != 0 && this._lessThan(heap[cur], heap[parent], position, segments, destination)) {
      while (cur > 0) {
        var parent = this._parent(cur);
        if (!this._lessThan(heap[cur], heap[parent], position, segments, destination)) {
          break;
        }
        map[heap[parent]] = cur;
        map[heap[cur]] = parent;
        var temp = heap[cur];
        heap[cur] = heap[parent];
        heap[parent] = temp;
        cur = parent;
      }
    } else {
      while (true) {
        var left = this._child(cur);
        var right = left + 1;
        if (left < heap.length && this._lessThan(heap[left], heap[cur], position, segments, destination) &&
            (right == heap.length || this._lessThan(heap[left], heap[right], position, segments, destination))) {
          map[heap[left]] = cur;
          map[heap[cur]] = left;
          var temp = heap[left];
          heap[left] = heap[cur];
          heap[cur] = temp;
          cur = left;
        } else if (right < heap.length && this._lessThan(heap[right], heap[cur], position, segments, destination)) {
          map[heap[right]] = cur;
          map[heap[cur]] = right;
          var temp = heap[right];
          heap[right] = heap[cur];
          heap[cur] = temp;
          cur = right;
        } else break;
      }
    }
  };

  _insert(index, heap, position, segments, destination, map) {
    var intersect = this._intersectLines(segments[index][0], segments[index][1], position, destination);
    if (intersect.length == 0) return;
    var cur = heap.length;
    heap.push(index);
    map[index] = cur;
    while (cur > 0) {
      var parent = this._parent(cur);
      if (!this._lessThan(heap[cur], heap[parent], position, segments, destination)) {
        break;
      }
      map[heap[parent]] = cur;
      map[heap[cur]] = parent;
      var temp = heap[cur];
      heap[cur] = heap[parent];
      heap[parent] = temp;
      cur = parent;
    }
  };

  _lessThan(index1, index2, position, segments, destination) {
    var inter1 = this._intersectLines(segments[index1][0], segments[index1][1], position, destination);
    var inter2 = this._intersectLines(segments[index2][0], segments[index2][1], position, destination);
    if (!this._equal(inter1, inter2)) {
      var d1 = this._distance(inter1, position);
      var d2 = this._distance(inter2, position);
      return d1 < d2;
    }
    var end1 = 0;
    if (this._equal(inter1, segments[index1][0])) end1 = 1;
    var end2 = 0;
    if (this._equal(inter2, segments[index2][0])) end2 = 1;
    var a1 = this._angle2(segments[index1][end1], inter1, position);
    var a2 = this._angle2(segments[index2][end2], inter2, position);
    if (a1 < 180) {
      if (a2 > 180) return true;
      return a2 < a1;
    }
    return a1 < a2;
  };

  _parent(index) {
    return Math.floor((index-1)/2);
  };

  _child(index) {
    return 2*index+1;
  };

  _angle2(a, b, c) {
    var a1 = this._angle(a,b);
    var a2 = this._angle(b,c);
    var a3 = a1 - a2;
    if (a3 < 0) a3 += 360;
    if (a3 > 360) a3 -= 360;
    return a3;
  };

  _sortPoints(position, segments) {
    var points = new Array(segments.length * 2);
    for (var i = 0; i < segments.length; ++i) {
      for (var j = 0; j < 2; ++j) {
        var a = this._angle(segments[i][j], position);
        points[2*i+j] = [i, j, a];
      }
    }
    points.sort(function(a,b) {return a[2]-b[2];});
    return points;
  };

  _angle(a, b) {
    return Math.atan2(b[1]-a[1], b[0]-a[0]) * 180 / Math.PI;
  };

  _intersectLines(a1, a2, b1, b2) {
    var ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    var ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    var u_b  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
    if (u_b != 0) {
      let ua = ua_t / u_b;
      let ub = ub_t / u_b;
      return [a1[0] - ua * (a1[0] - a2[0]), a1[1] - ua * (a1[1] - a2[1])];
    }
    return [];
  };

  _distance(a, b) {
    return (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]);
  };

  _isOnSegment(xi, yi, xj, yj, xk, yk) {
    return (xi <= xk || xj <= xk) && (xk <= xi || xk <= xj) &&
           (yi <= yk || yj <= yk) && (yk <= yi || yk <= yj);
  };

  _computeDirection(xi, yi, xj, yj, xk, yk) {
    let a = (xk - xi) * (yj - yi);
    let b = (xj - xi) * (yk - yi);
    return a < b ? -1 : a > b ? 1 : 0;
  };

  _doLineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    let d1 = this._computeDirection(x3, y3, x4, y4, x1, y1);
    let d2 = this._computeDirection(x3, y3, x4, y4, x2, y2);
    let d3 = this._computeDirection(x1, y1, x2, y2, x3, y3);
    let d4 = this._computeDirection(x1, y1, x2, y2, x4, y4);
    return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
            ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
           (d1 == 0 && this._isOnSegment(x3, y3, x4, y4, x1, y1)) ||
           (d2 == 0 && this._isOnSegment(x3, y3, x4, y4, x2, y2)) ||
           (d3 == 0 && this._isOnSegment(x1, y1, x2, y2, x3, y3)) ||
           (d4 == 0 && this._isOnSegment(x1, y1, x2, y2, x4, y4));
  };

}


