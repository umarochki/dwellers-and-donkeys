import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../../src/classes/canvas_object.dart';
import '../../src/controllers/canvas.dart';

class GameScreen extends StatefulWidget {
  final Function sendMove;
  final Function sendDelete;
  const GameScreen(
      {Key key, @required this.sendMove, @required this.sendDelete})
      : super(key: key);

  @override
  GameScreenState createState() => GameScreenState();
}

class GameScreenState extends State<GameScreen> {
  dynamic _controller;

  @override
  void initState() {
    _controller = CanvasController(widget.sendMove);
    _controller.init();
    super.initState();
  }

  void recieveGameObjects(Map<String, dynamic> comingGameObjects) {
    removeAll();
    for (var gameObject in comingGameObjects.values) {
      addObject(gameObject['img'], gameObject['xy'], gameObject['id'],
          gameObject['wh']);
    }
    _controller.unselectAll();
  }

  void _dummyData() {
    _controller.addObject(
      CanvasObject(
        dx: 20,
        dy: 20,
        width: 100,
        height: 100,
        child: Container(child: Image.asset('assets/heroes/Knight.png')),
      ),
    );
  }

  void addObject(Widget img, List<dynamic> xy, dynamic id, List<dynamic> wh) {
    bool isMap = id == -725;
    double x, y;
    if (isMap) {
      x = 0;
      y = 0;
    } else {
      // debugPrint('$xy $wh');
      x = xy[0].toDouble() - wh[0].toDouble() / 2;
      y = xy[1].toDouble() - wh[1].toDouble() / 2;
    }
    _controller.addObject(CanvasObject(
        dx: x,
        dy: y,
        width: wh[0].toDouble(),
        height: wh[1].toDouble(),
        child: Container(child: img),
        id: id,
        unselectable: isMap));
  }

  void addObjectFromMap(Map<String, dynamic> gameObject) {
    addObject(gameObject['img'], gameObject['xy'], gameObject['id'],
        gameObject['wh']);
  }

  int findIndexById(dynamic id) {
    for (var i = _controller.objects.length - 1; i > -1; i--) {
      if (_controller.objects[i].id == id) return i;
    }
    return -1;
  }

  void updateObjectFromMap(Map<String, dynamic> gameObject) {
    int index = findIndexById(gameObject['id']);
    if (index != -1)
      _controller.updateObject(
          index,
          CanvasObject(
              dx: gameObject['xy'][0].toDouble() -
                  gameObject['wh'][0].toDouble() / 2,
              dy: gameObject['xy'][1].toDouble() -
                  gameObject['wh'][1].toDouble() / 2,
              width: gameObject['wh'][0].toDouble(),
              height: gameObject['wh'][1].toDouble(),
              child: Container(child: gameObject['img']),
              id: gameObject['id'],
              unselectable: false));
  }

  void deleteObjectById(dynamic id) {
    int index = findIndexById(id);
    if (index != -1) _controller.removeObject(index);
  }

  void removeAll() {
    _controller.removeAll();
  }

  @override
  void dispose() {
    _controller.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<CanvasController>(
        stream: _controller.stream,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Scaffold(
              backgroundColor: Color.fromRGBO(33, 44, 61, 1),
              appBar: AppBar(backgroundColor: Color.fromRGBO(33, 44, 61, 1)),
              body: Center(child: CircularProgressIndicator()),
            );
          }
          final instance = snapshot.data;
          return Scaffold(
            floatingActionButton: FloatingActionButton(
                backgroundColor: Colors.red,
                child: Icon(Icons.delete),
                onPressed: () {
                  if (_controller.selectedObjectsIndices.length > 0) {
                    widget.sendDelete(_controller
                        .objects[_controller.selectedObjectsIndices[0]].id);
                    _controller
                        .removeObject(_controller.selectedObjectsIndices[0]);
                    _controller.unselectAll();
                  }
                }),
            backgroundColor: Color.fromRGBO(245, 245, 220, 1),
            // appBar: AppBar(
            //   backgroundColor: Color.fromRGBO(33, 44, 61, 1),
            //   actions: [
            //     // FocusScope(
            //     //   canRequestFocus: false,
            //     //   child: IconButton(
            //     //     tooltip: 'Selection',
            //     //     icon: Icon(Icons.select_all),
            //     //     color: instance.shiftPressed
            //     //         ? Theme.of(context).accentColor
            //     //         : null,
            //     //     onPressed: _controller.shiftSelect,
            //     //   ),
            //     // ),
            //     // FocusScope(
            //     //   canRequestFocus: false,
            //     //   child: IconButton(
            //     //     tooltip: 'Meta Key',
            //     //     color: instance.metaPressed
            //     //         ? Theme.of(context).accentColor
            //     //         : null,
            //     //     icon: Icon(Icons.category),
            //     //     onPressed: _controller.metaSelect,
            //     //   ),
            //     // ),
            //     FocusScope(
            //       canRequestFocus: false,
            //       child: IconButton(
            //         tooltip: 'Zoom In',
            //         icon: Icon(Icons.zoom_in),
            //         onPressed: _controller.zoomIn,
            //       ),
            //     ),
            //     FocusScope(
            //       canRequestFocus: false,
            //       child: IconButton(
            //         tooltip: 'Zoom Out',
            //         icon: Icon(Icons.zoom_out),
            //         onPressed: _controller.zoomOut,
            //       ),
            //     ),
            //     FocusScope(
            //       canRequestFocus: false,
            //       child: IconButton(
            //         tooltip: 'Reset the Scale and Offset',
            //         icon: Icon(Icons.restore),
            //         onPressed: _controller.reset,
            //       ),
            //     ),
            //   ],
            // ),
            body: Container(
                // decoration: BoxDecoration(
                //     image: DecorationImage(
                //   image: AssetImage("assets/cat.jpg"),
                //   fit: BoxFit.cover,
                // )),
                child: Listener(
              behavior: HitTestBehavior.opaque,
              onPointerSignal: (details) {
                if (details is PointerScrollEvent) {
                  GestureBinding.instance.pointerSignalResolver
                      .register(details, (event) {
                    if (event is PointerScrollEvent) {
                      if (_controller.shiftPressed) {
                        double zoomDelta = (-event.scrollDelta.dy / 300);
                        _controller.scale = _controller.scale + zoomDelta;
                      } else {
                        _controller.offset =
                            _controller.offset - event.scrollDelta;
                      }
                    }
                  });
                }
              },
              onPointerMove: (details) {
                _controller.updateTouch(
                  details.pointer,
                  details.localPosition,
                  details.position,
                );
              },
              onPointerDown: (details) {
                _controller.addTouch(
                  details.pointer,
                  details.localPosition,
                  details.position,
                );
              },
              onPointerUp: (details) {
                _controller.removeTouch(details.pointer);
              },
              onPointerCancel: (details) {
                _controller.removeTouch(details.pointer);
              },
              child: RawKeyboardListener(
                autofocus: true,
                focusNode: _controller.focusNode,
                onKey: (key) => _controller.rawKeyEvent(context, key),
                child: SizedBox.expand(
                  child: Stack(
                    children: [
                      for (var i = instance.objects.length - 1; i > -1; i--)
                        Positioned.fromRect(
                          rect: instance.objects[i].rect.adjusted(
                            _controller.offset,
                            _controller.scale,
                          ),
                          child: Container(
                            decoration: BoxDecoration(
                                border: Border.all(
                              color: instance.isObjectSelected(i)
                                  ? Colors.grey
                                  : Colors.transparent,
                            )),
                            child: GestureDetector(
                              onTapDown: (_) {
                                return _controller.selectObject(i);
                              },
                              child: FittedBox(
                                fit: BoxFit.fill,
                                child: SizedBox.fromSize(
                                  size: instance.objects[i].size,
                                  child: instance.objects[i].child,
                                ),
                              ),
                            ),
                          ),
                        ),
                      if (instance?.marquee != null)
                        Positioned.fromRect(
                          rect: instance.marquee.rect
                              .adjusted(instance.offset, instance.scale),
                          child: Container(
                            color: Colors.blueAccent.withOpacity(0.3),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            )),
          );
        });
  }
}

extension RectUtils on Rect {
  Rect adjusted(Offset offset, double scale) {
    final left = (this.left + offset.dx) * scale;
    final top = (this.top + offset.dy) * scale;
    final width = this.width * scale;
    final height = this.height * scale;
    return Rect.fromLTWH(left, top, width, height);
  }
}
