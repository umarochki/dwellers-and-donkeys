import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../classes/canvas_object.dart';
import '../classes/rect_points.dart';

class CanvasController {
  Function sendMove;
  Function sendSave;
  Function isGm;
  Function hero;

  CanvasController(
      Function sendMove, Function isGm, Function hero, Function sendSave) {
    this.sendMove = sendMove;
    this.isGm = isGm;
    this.hero = hero;
    this.sendSave = sendSave;
  }

  final _controller = StreamController<CanvasController>();

  Stream<CanvasController> get stream => _controller.stream;

  void add([CanvasController val]) => _controller.add(val ?? this);

  void close() {
    _controller.close();
    focusNode.dispose();
  }

  void init() => add();

  final List<CanvasObject<Widget>> _objects = [];

  List<CanvasObject<Widget>> get objects => _objects;

  void addObject(CanvasObject<Widget> value) => _update(() {
        if (_objects.length > 0 &&
            _objects[_objects.length - 1]
                .unselectable) //мб потом придётся разделять анселектабл и мап
        {
          final item = _objects.removeAt(_objects.length - 1);
          _objects.add(value);
          _objects.add(item);
        } else {
          _objects.add(value);
        }
      });

  void updateObject(int i, CanvasObject<Widget> value) => _update(() {
        _objects[i] = value;
      });

  void removeObject(int i) => _update(() {
        _objects.removeAt(i);
      });

  void removeAll() => _update(() {
        while (_objects.length > 0) _objects.removeAt(0);
      });

  final focusNode = FocusNode();

  void shiftSelect() {
    _shiftPressed = true;
  }

  void metaSelect() {
    _metaPressed = true;
  }

  final Map<int, Offset> _pointerMap = {};

  int get touchCount => _pointerMap.values.length;

  RectPoints get marquee => _marquee;
  RectPoints _marquee;

  bool get isMovingCanvasObject => _isMovingCanvasObject;
  bool _isMovingCanvasObject = false;

  final List<int> _selectedObjects = [];
  List<int> get selectedObjectsIndices => _selectedObjects;
  List<CanvasObject<Widget>> get selectedObjects =>
      _selectedObjects.map((i) => _objects[i]).toList();
  bool isObjectSelected(int i) => _selectedObjects.contains(i);

  void addTouch(int pointer, Offset offsetVal, Offset globalVal) {
    _pointerMap[pointer] = offsetVal;

    if (shiftPressed) {
      final pt = (offsetVal / scale) - (offset);
      _marquee = RectPoints(pt, pt);
    }

    add(this);
  }

  void updateTouch(int pointer, Offset offsetVal, Offset globalVal) {
    if (_marquee != null) {
      final _pts = _marquee;
      final a = _pointerMap.values.first;
      _pointerMap[pointer] = offsetVal;
      final b = _pointerMap.values.first;
      final delta = (b - a) / scale;
      _pts.end = _pts.end + delta;
      _marquee = _pts;
      final _rect = Rect.fromPoints(_pts.start, _pts.end);
      _selectedObjects.clear();
      for (var i = 0; i < _objects.length; i++) {
        if (_rect.overlaps(_objects[i].rect)) {
          _selectedObjects.add(i);
        }
      }
    } else if (touchCount == 1) {
      _isMovingCanvasObject = true;
      final a = _pointerMap.values.first;
      _pointerMap[pointer] = offsetVal;
      final b = _pointerMap.values.first;
      if (_selectedObjects.isEmpty) {
        add(this);
        return;
      }
      for (final idx in _selectedObjects) {
        if (isGm() || (hero() != null && _objects[idx].id == hero()['id'])) {
          final widget = _objects[idx];
          final delta = (b - a) / scale;
          final _newOffset = widget.offset + delta;
          _objects[idx] = widget.copyWith(dx: _newOffset.dx, dy: _newOffset.dy);
          sendMove(_objects[idx].id, [
            _objects[idx].dx + _objects[idx].width / 2,
            _objects[idx].dy + _objects[idx].height / 2
          ]);
        }
      }
    } else if (touchCount == 2) {
      _isMovingCanvasObject = false;
      final _rectA = _getRectFromPoints(_pointerMap.values.toList());
      _pointerMap[pointer] = offsetVal;
      final _rectB = _getRectFromPoints(_pointerMap.values.toList());
      final _delta = _rectB.center - _rectA.center;
      final _newOffset = offset + (_delta / scale);
      offset = _newOffset;
      final aDistance = (_rectA.topLeft - _rectA.bottomRight).distance;
      final bDistance = (_rectB.topLeft - _rectB.bottomRight).distance;
      final change = (bDistance / aDistance);
      scale = scale * change;
    } else {
      _isMovingCanvasObject = false;
      final _rectA = _getRectFromPoints(_pointerMap.values.toList());
      _pointerMap[pointer] = offsetVal;
      final _rectB = _getRectFromPoints(_pointerMap.values.toList());
      final _delta = _rectB.center - _rectA.center;
      offset = offset + (_delta / scale);
    }
    _pointerMap[pointer] = offsetVal;

    add(this);
  }

  void removeTouch(int pointer) {
    _pointerMap.remove(pointer);

    if (touchCount < 1) {
      _isMovingCanvasObject = false;
    }
    if (_marquee != null) {
      _marquee = null;
      _shiftPressed = false;
    }

    for (final idx in _selectedObjects) {
      if (isGm() || (hero() != null && _objects[idx].id == hero()['id'])) {
        sendSave(_objects[idx].id, [
          _objects[idx].dx + _objects[idx].width / 2,
          _objects[idx].dy + _objects[idx].height / 2
        ]);
      }
    }

    add(this);
  }

  void selectObject(int i) => _update(() {
        if (_objects[i].unselectable) return; // not to select map
        if (!_metaPressed) {
          _selectedObjects.clear();
        }
        _selectedObjects.add(0);
        final item = _objects.removeAt(i);
        _objects.insert(0, item);
      });

  void unselectAll() {
    _selectedObjects.clear();
  }

  bool get shiftPressed => _shiftPressed;
  bool _shiftPressed = false;

  bool get metaPressed => _metaPressed;
  bool _metaPressed = false;

  double get scale => _scale;
  double _scale = 1;
  set scale(double value) => _update(() {
        if (value <= minScale) {
          value = minScale;
        } else if (value >= maxScale) {
          value = maxScale;
        }
        _scale = value;
      });

  static const double maxScale = 3.0;

  static const double minScale = 0.2;

  static const double scaleAdjust = 0.05;

  static const double offsetAdjust = 15;

  Offset get offset => _offset;
  Offset _offset = Offset.zero;
  set offset(Offset value) => _update(() {
        _offset = value;
      });

  static const double _scaleDefault = 1;
  static const Offset _offsetDefault = Offset.zero;

  void reset() {
    scale = _scaleDefault;
    offset = _offsetDefault;
  }

  void zoomIn() {
    scale += scaleAdjust;
  }

  void zoomOut() {
    scale -= scaleAdjust;
  }

  void _update(void Function() action) {
    action();
    add(this);
  }

  Rect _getRectFromPoints(List<Offset> offsets) {
    if (offsets.length == 2) {
      return Rect.fromPoints(offsets.first, offsets.last);
    }
    final dxs = offsets.map((e) => e.dx).toList();
    final dys = offsets.map((e) => e.dy).toList();
    double left = _minFromList(dxs);
    double top = _minFromList(dys);
    double bottom = _maxFromList(dys);
    double right = _maxFromList(dxs);
    return Rect.fromLTRB(left, top, right, bottom);
  }

  double _minFromList(List<double> values) {
    double value = double.infinity;
    for (final item in values) {
      value = math.min(item, value);
    }
    return value;
  }

  double _maxFromList(List<double> values) {
    double value = -double.infinity;
    for (final item in values) {
      value = math.max(item, value);
    }
    return value;
  }
}
