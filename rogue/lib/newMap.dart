import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:rogue/conf.dart';

class NewMap extends StatefulWidget {
  final Function sendMap;
  final Function getLocalImageFile;
  final String dir;
  const NewMap(
      {Key key,
      @required this.sendMap,
      @required this.getLocalImageFile,
      @required this.dir})
      : super(key: key);

  @override
  _NewMap createState() => _NewMap();
}

class _NewMap extends State<NewMap> {
  final _titleTextStyle = const TextStyle(fontSize: 25.0, color: Colors.white);

  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
            appBar: AppBar(
              title: Text("Choose new map", style: _titleTextStyle),
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
                    itemCount: Config.listOfMaps.length,
                    itemBuilder: (BuildContext ctx, index) {
                      debugPrint(Config.listOfMaps[index]['name']);
                      return GestureDetector(
                          child: Container(
                            alignment: Alignment.center,
                            child: Image.file(widget.getLocalImageFile(
                                '${Config.listOfMaps[index]['name']}.png',
                                widget.dir)),
                            decoration: BoxDecoration(
                                color: Colors.amber,
                                borderRadius: BorderRadius.circular(15)),
                          ),
                          onTap: () {
                            debugPrint(
                                'here!!! ${Config.listOfMaps[index]['hash']}');

                            widget.sendMap(Config.listOfMaps[index]['hash']);
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
