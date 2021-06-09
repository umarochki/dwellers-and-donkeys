import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';
import 'package:rogue/conf.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';
import 'package:rogue/gameboard.dart';

class AddLocation extends StatefulWidget {
  final Function sendUpdate;
  final Function mapsOfSession;
  final Function maps;
  final Function getLocalImageFile;
  final Function dir;
  final Function selectedId;
  const AddLocation(
      {Key key,
      @required this.sendUpdate,
      @required this.mapsOfSession,
      @required this.maps,
      @required this.selectedId,
      @required this.getLocalImageFile,
      @required this.dir})
      : super(key: key);

  @override
  _AddLocation createState() => _AddLocation();
}

class _AddLocation extends State<AddLocation> {
  final _titleTextStyle = const TextStyle(fontSize: 25.0, color: Colors.white);

  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
            appBar: AppBar(
              title: Text("Choose map for marker", style: _titleTextStyle),
              backgroundColor: Color.fromRGBO(33, 44, 61, 1),
            ),
            body: Column(children: [
              Container(
                constraints: BoxConstraints(
                    minHeight: 100,
                    minWidth: double.infinity,
                    maxHeight: MediaQuery.of(context).size.height - 150),
                padding: EdgeInsets.all(10),
                child: GridView.builder(
                    scrollDirection: Axis.vertical,
                    shrinkWrap: true,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 16 / 9,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10),
                    itemCount: widget.mapsOfSession().length,
                    itemBuilder: (BuildContext ctx, index) {
                      if (!widget
                          .maps()
                          .containsKey(widget.mapsOfSession()[index])) {
                        return null;
                      }
                      String name = widget
                          .maps()[widget.mapsOfSession()[index]]['file']
                          .substring(widget
                                  .maps()[widget.mapsOfSession()[index]]['file']
                                  .lastIndexOf('/') +
                              1);

                      return GestureDetector(
                          child: Container(
                            alignment: Alignment.center,
                            child: Image.file(widget.getLocalImageFile(
                                '$name', widget.dir())),
                            // child: Image.asset('assets/cat.jpg'),
                            decoration: BoxDecoration(
                                color: Colors.amber,
                                borderRadius: BorderRadius.circular(15)),
                          ),
                          onTap: () {
                            widget.sendUpdate(
                                widget.selectedId(),
                                widget.maps()[widget.mapsOfSession()[index]]
                                    ['hash']);
                            Navigator.pop(context);
                          });
                    }),
              ),
              Container(
                  constraints: BoxConstraints(
                      minHeight: 50, minWidth: 200, maxHeight: 100),
                  child: MaterialButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    color: Theme.of(context).accentColor,
                    height: 30.0,
                    minWidth: 40.0,
                    child: new Text(
                      "Back",
                    ),
                  )),
            ])));
  }
}
