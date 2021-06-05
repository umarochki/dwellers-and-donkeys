import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:rogue/conf.dart';
import 'package:flutter/foundation.dart';
import 'package:rogue/live.dart';
import 'package:http/http.dart' as http;
import 'package:rogue/newMap.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';
import 'dart:convert';
import 'dart:async';
import 'dart:io';

import 'package:path_provider/path_provider.dart';

import 'ui/home/screen.dart';

class GameBoard extends StatefulWidget {
  final WebSocketChannel channel;

  GameBoard({Key key, @required this.channel}) : super(key: key);

  @override
  _GameBoardState createState() => _GameBoardState();
}

class _GameBoardState extends State<GameBoard>
    with SingleTickerProviderStateMixin
// with AutomaticKeepAliveClientMixin
{
  final _sizeTextWhite = const TextStyle(fontSize: 20.0, color: Colors.white);
  final _bgc = const Color.fromRGBO(67, 83, 107, 1);
  final _color = const Color.fromRGBO(83, 102, 129, 1);
  final _lightGrey = const Color.fromRGBO(173, 185, 206, 1);
  final _chatScrollController = ScrollController();
  final _sendMessageController = TextEditingController();

  final GlobalKey<GameScreenState> _keyGameScreen = GlobalKey();

  String _invite_code = "invite_code_filler";

  List<dynamic> _chat = [];
  List<dynamic> _activeUsers = [];
  Map<String, dynamic> _gameObjects = {};
  List<dynamic> _maps = []; // list string
  String _currentMap = "Global";
  Map<String, dynamic> _hero = {};
  bool _isGm = false;
  bool isGm() => _isGm;

  bool _wsMustBeOn = true;

  WebSocketChannel _channel;

  String _dir;
  dynamic _initHeightDashboard;

  TabController _tabController;

  Map<String, dynamic> maps = {}; // все карты

  @override
  void initState() {
    super.initState();
    _channel = widget.channel;
    _tabController = new TabController(vsync: this, length: 3);
    prepareMaps();
    prepareTokens();
    prepareMarkers();
    listen();
    _tabController.animateTo(1);
    refresh();
  }

  void prepareTokens() async {
    if (_dir == null) {
      _dir = (await getApplicationDocumentsDirectory()).path;
    }
    for (var name in Config.listOfHeroesTokens) {
      var imageFile =
          await _downloadFile('${Config.url_heroes}$name', '$name', _dir);
    }
    debugPrint('tokens downloaded');
  }

  void prepareMarkers() async {
    if (_dir == null) {
      _dir = (await getApplicationDocumentsDirectory()).path;
    }
    for (var name in Config.listOfMarkers) {
      var imageFile =
          await _downloadFile('${Config.url_markers}$name', '$name', _dir);
    }
    debugPrint('markers downloaded');
  }

  Future<void> prepareMaps() async {
    List<dynamic> rsp = await getMaps(_invite_code);
    for (var map in rsp) {
      maps[map['hash']] = map;
      maps[map['hash']]['img'] =
          await _getImage(maps[map['hash']]['file'], _dir);
      String name = maps[map['hash']]['file']
          .substring(maps[map['hash']]['file'].lastIndexOf('/') + 1);
      File file = _getLocalImageFile('$name', _dir);
      var decodedImage = await decodeImageFromList(file.readAsBytesSync());
      maps[map['hash']]['wh'] = [decodedImage.width, decodedImage.height];
    }
    maps['Global'] = {};
    maps['Global']['name'] = 'global';
    maps['Global']['img'] = Image.asset('assets/WorldMap.png');
    maps['Global']['wh'] = [1920, 1080];
  }

  @override
  void deactivate() {
    _channel.sink.close();
    _wsMustBeOn = false;
    super.deactivate();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // @override
  // bool get wantKeepAlive => true;

  void connect() {
    _channel = IOWebSocketChannel.connect(
        'ws://207.154.226.69/ws/games/$_invite_code',
        headers: {'Cookie': headers['cookie']});
    listen();
    refresh();
  }

  void listen() {
    _channel.stream.listen(
      (dynamic message) {
        debugPrint('message $message');
        Map<String, dynamic> json = jsonDecode(message);

        // debugPrint('q: $json');
        if (json['type'] == 'refresh') {
          handleRefresh(json);
        }
        if (json['type'] == 'chat') {
          handleChat(json);
        }
        if (json['type'] == 'disconnect') {
          handleDisconnect();
        }
        if (json['type'] == 'connect') {
          handleConnect(json);
        }
        if (json['type'] == 'add') {
          handleAdd(json);
        }
        if (json['type'] == 'delete') {
          handleDelete(json);
        }
        if (json['type'] == 'map') {
          handleMap(json);
        }
        if (json['type'] == 'global_map') {
          handleGlobalMap(json);
        }
        if ((json['type'] == 'update') ||
            (json['type'] == 'update_and_start')) {
          handleUpdate(json);
        }
      },
      onDone: () {
        debugPrint('ws channel closed');

        if (this.mounted && _wsMustBeOn) connect();
        // TODO: не реконнектиться когда не надо (проверить что работает)
      },
      onError: (error) {
        debugPrint('ws error $error');
      },
    );
  }

  void refresh() {
    _channel.sink.add('{"type":"refresh"}');
    Timer(
      Duration(milliseconds: 50),
      () => {
        if (_chatScrollController.hasClients)
          _chatScrollController
              .jumpTo(_chatScrollController.position.maxScrollExtent)
      },
    );
  }

  void sendMessage(String message) {
    _channel.sink.add('{"type":"chat", "meta": "$message"}');
    Timer(
      Duration(milliseconds: 50),
      () => {
        if (_chatScrollController.hasClients)
          _chatScrollController
              .jumpTo(_chatScrollController.position.maxScrollExtent)
      },
    );
  }

  void sendMap(String message) {
    _channel.sink.add('{"type":"map", "meta": "$message"}');
  }

  void sendAdd(String sprite) {
    debugPrint(
        '{"type":"add", "meta": { "type": "none", "sprite" : "$sprite", "xy": [100.0, 100.0]}}');
    if (_currentMap == "Global")
      _channel.sink.add(
          '{"type":"add", "meta": { "type": "marker", "sprite" : "$sprite", "xy": [100.0, 100.0]}}');
    else
      _channel.sink.add(
          '{"type":"add", "meta": { "type": "none", "sprite" : "$sprite", "xy": [100.0, 100.0]}}');
  }

  void sendWorldMap() {
    _channel.sink.add('{"type":"global_map"}');
  }

  void sendMove(dynamic id, List<dynamic> xy) {
    if (id is String)
      _channel.sink
          .add('{"type":"update", "meta": { "id" : "$id" , "xy" : $xy}}');
    else
      _channel.sink
          .add('{"type":"update", "meta": { "id" : $id , "xy" : $xy}}');
  }

  void sendDelete(dynamic id) {
    _channel.sink.add('{"type":"delete", "meta": { "id" : "$id"}}');
  }

  void handleDisconnect() {
    _channel.sink.close(); // TODO: только если ты
    // if (this.mounted && _wsMustBeOn) connect();
  }

  void handleRefresh(Map<String, dynamic> json) {
    if (this.mounted)
      setState(() {
        _chat = json['meta']['chat'];
        _activeUsers = json['meta']['active_users'];
        _currentMap = json['meta']['map'];
        _gameObjects = json['meta']['game_objects'];
        rewriteTokens();
        _maps = json['meta']['maps'];
        _isGm = json['meta']['is_gm'];
        _hero = json['meta']['my_hero'];
      });

    // debugPrint('$_gameObjects');
  }

  void handleMap(Map<String, dynamic> json) {
    refresh(); // TODO : понять глубокую логику давать карту по имени и т.д.
  }

  void handleGlobalMap(Map<String, dynamic> json) {
    refresh(); // TODO : что вообще с бэком?
  }

  void rewriteTokens() async {
    for (var gameObject in _gameObjects.values) {
      gameObject['img'] = await _getImage(gameObject['sprite'], _dir);

      String name = gameObject['sprite']
          .substring(gameObject['sprite'].lastIndexOf('/') + 1);
      File file = _getLocalImageFile('$name', _dir);
      var decodedImage = await decodeImageFromList(file.readAsBytesSync());
      double divider = _currentMap == "Global" ? 3.25 : 10;
      gameObject['wh'] = [
        decodedImage.width / divider,
        decodedImage.height / divider
      ];
    }
    if (!maps.containsKey(_currentMap)) await prepareMaps();
    if (this.mounted)
      setState(() {
        _keyGameScreen.currentState.recieveGameObjects(_gameObjects);
        if (maps.containsKey(_currentMap))
          _keyGameScreen.currentState.addObject(
              maps[_currentMap]['img'], [0, 0], -725, maps[_currentMap]['wh']);
      });
  }

  void handleAdd(Map<String, dynamic> json) async {
    _gameObjects[json['meta']['id'].toString()] = json['meta'];
    _gameObjects[json['meta']['id'].toString()]['img'] = await _getImage(
        _gameObjects[json['meta']['id'].toString()]['sprite'], _dir);

    String name = _gameObjects[json['meta']['id'].toString()]['sprite']
        .substring(_gameObjects[json['meta']['id'].toString()]['sprite']
                .lastIndexOf('/') +
            1);
    File file = _getLocalImageFile('$name', _dir);
    var decodedImage = await decodeImageFromList(file.readAsBytesSync());
    double divider = _currentMap == "Global" ? 3.25 : 10;
    _gameObjects[json['meta']['id'].toString()]
        ['wh'] = [decodedImage.width / divider, decodedImage.height / divider];
    if (this.mounted)
      setState(() {
        _keyGameScreen.currentState
            .addObjectFromMap(_gameObjects[json['meta']['id'].toString()]);
      });
  }

  void handleDelete(Map<String, dynamic> json) async {
    _gameObjects.remove(json['meta']['id'].toString());
    if (this.mounted)
      setState(() {
        _keyGameScreen.currentState
            .deleteObjectById(json['meta']['id'].toString());
      });
  }

  void handleUpdate(Map<String, dynamic> json) async {
    _gameObjects[json['meta']['id'].toString()]['xy'] = json['meta']['xy'];
    if (this.mounted)
      setState(() {
        _keyGameScreen.currentState
            .updateObjectFromMap(_gameObjects[json['meta']['id'].toString()]);
      });
  }

  void handleConnect(Map<String, dynamic> json) {
    if (this.mounted)
      setState(() {
        _activeUsers.add(json['meta']);
      });
  }

  void handleChat(Map<String, dynamic> json) {
    if (this.mounted)
      setState(() {
        _chat.add(json['meta']);
      });
    Timer(
      Duration(milliseconds: 50),
      () => {
        if (_chatScrollController.hasClients)
          _chatScrollController
              .jumpTo(_chatScrollController.position.maxScrollExtent)
      },
    );
  }

  String getSumStr(Map<String, dynamic> dice) {
    String str = '';
    if (dice['d4'] > 0) {
      str += dice['d4'].toString() + 'd4+';
    }
    if (dice['d6'] > 0) {
      str += dice['d6'].toString() + 'd6+';
    }
    if (dice['d8'] > 0) {
      str += dice['d8'].toString() + 'd8+';
    }
    if (dice['d10'] > 0) {
      str += dice['d10'].toString() + 'd10+';
    }
    if (dice['d12'] > 0) {
      str += dice['d12'].toString() + 'd12+';
    }
    if (dice['d20'] > 0) {
      str += dice['d20'].toString() + 'd20+';
    }
    return str.substring(0, str.length - 1);
  }

  Future<Widget> _getImage(String url, String dir) async {
    if (_dir == null) {
      _dir = (await getApplicationDocumentsDirectory()).path;
    }
    String name = url.substring(url.lastIndexOf('/') + 1);
    if (await _hasToDownloadAssets('$name', _dir)) {
      var imageFile = await _downloadFile(url, '$name', _dir);
    }
    var file = _getLocalImageFile(name, _dir);
    return Image.file(file);
  }

  File _getLocalImageFile(String name, String dir) => File('$dir/$name');

  Future<bool> _hasToDownloadAssets(String name, String dir) async {
    var file = File('$dir/$name');
    return !(await file.exists());
  }

  Future<File> _downloadFile(String url, String filename, String dir) async {
    var req = await http.Client().get(Uri.parse(url));
    var file = File('$dir/$filename');
    return file.writeAsBytes(req.bodyBytes);
  }

  @override
  Widget build(BuildContext context) {
    _invite_code = ModalRoute.of(context).settings.arguments;

    return MaterialApp(
        home: DefaultTabController(
            length: 4,
            child: Scaffold(
                resizeToAvoidBottomInset: false,
                body: SafeArea(
                    child: Column(children: <Widget>[
                  Container(
                      height: MediaQuery.of(context).size.height / 1.5,
                      child: DefaultTabController(
                          length: 3,
                          child: Column(children: [
                            PreferredSize(
                                preferredSize: Size.fromHeight(50.0),
                                child: TabBar(
                                  controller: _tabController,
                                  labelColor: Colors.black,
                                  tabs: [
                                    Tab(
                                      text: 'Maps',
                                    ),
                                    Tab(
                                      text: 'Dashboard',
                                    ),
                                    Tab(
                                      text: 'Tokens',
                                    )
                                  ],
                                )),
                            Expanded(
                                child: TabBarView(
                              physics: NeverScrollableScrollPhysics(),
                              controller: _tabController,
                              children: [
                                Live(
                                    child: Container(
                                        child: ListView.builder(
                                            padding: const EdgeInsets.all(8),
                                            // itemCount: _maps.length,
                                            itemCount: _maps.length + 2,
                                            itemBuilder: (BuildContext context,
                                                int index) {
                                              if (index == 0)
                                                return Container(
                                                  margin: const EdgeInsets.all(
                                                      15.0),
                                                  padding:
                                                      const EdgeInsets.all(3.0),
                                                  decoration: BoxDecoration(
                                                      color: _color),
                                                  child: ListTile(
                                                    leading: CircleAvatar(
                                                      backgroundColor:
                                                          Colors.transparent,
                                                      backgroundImage: AssetImage(
                                                          'assets/WorldMap.png'),
                                                    ),
                                                    title: Text('World Map',
                                                        style: _sizeTextWhite),
                                                    trailing: _isGm
                                                        ? MaterialButton(
                                                            onPressed: () {
                                                              sendWorldMap();
                                                            },
                                                            color: Theme.of(
                                                                    context)
                                                                .accentColor,
                                                            height: 30.0,
                                                            minWidth: 40.0,
                                                            child: new Text(
                                                              "Go to",
                                                            ),
                                                          )
                                                        : null,
                                                    onTap: () {},
                                                  ),
                                                );
                                              if (index == _maps.length + 1) {
                                                if (_isGm)
                                                  return Container(
                                                    margin:
                                                        const EdgeInsets.all(
                                                            15.0),
                                                    padding:
                                                        const EdgeInsets.all(
                                                            3.0),
                                                    decoration: BoxDecoration(
                                                        color: _color),
                                                    child: ListTile(
                                                      // leading: CircleAvatar(
                                                      //   backgroundColor:
                                                      //       Colors.blueGrey,
                                                      // ),
                                                      title: Text('New Map',
                                                          style:
                                                              _sizeTextWhite),
                                                      trailing: MaterialButton(
                                                        onPressed: () async {
                                                          print(
                                                              'NewMapOpening');
                                                          if (_dir == null) {
                                                            _dir =
                                                                (await getApplicationDocumentsDirectory())
                                                                    .path;
                                                          }
                                                          Navigator.push(
                                                              context,
                                                              MaterialPageRoute(
                                                                  builder: (context) => NewMap(
                                                                      sendMap:
                                                                          sendMap,
                                                                      getLocalImageFile:
                                                                          _getLocalImageFile,
                                                                      dir:
                                                                          _dir)));
                                                        },
                                                        color: Theme.of(context)
                                                            .accentColor,
                                                        height: 30.0,
                                                        minWidth: 40.0,
                                                        child: new Text(
                                                          "Create",
                                                        ),
                                                      ),
                                                      onTap: () {},
                                                    ),
                                                  );
                                                else
                                                  return Center(
                                                      child: Text(
                                                          'Not allowed to create maps'));
                                              }

                                              if (maps.containsKey(
                                                  _maps[index - 1])) {
                                                String name = maps[
                                                            _maps[index - 1]]
                                                        ['file']
                                                    .substring(
                                                        maps[_maps[index - 1]]
                                                                    ['file']
                                                                .lastIndexOf(
                                                                    '/') +
                                                            1);
                                                return Container(
                                                  margin: const EdgeInsets.all(
                                                      15.0),
                                                  padding:
                                                      const EdgeInsets.all(3.0),
                                                  decoration: BoxDecoration(
                                                      color: _color),
                                                  child: ListTile(
                                                    leading: CircleAvatar(
                                                      backgroundColor:
                                                          Colors.transparent,
                                                      backgroundImage: FileImage(
                                                          _getLocalImageFile(
                                                              name, _dir)),
                                                    ),
                                                    title: Text(
                                                        '${maps[_maps[index - 1]]['name']}',
                                                        style: _sizeTextWhite),
                                                    trailing: _isGm
                                                        ? MaterialButton(
                                                            onPressed: () {
                                                              sendMap(maps[_maps[
                                                                      index -
                                                                          1]]
                                                                  ['hash']);
                                                            },
                                                            color: Theme.of(
                                                                    context)
                                                                .accentColor,
                                                            height: 30.0,
                                                            minWidth: 40.0,
                                                            child: new Text(
                                                              "Go to",
                                                            ),
                                                          )
                                                        : null,
                                                  ),
                                                );
                                              } else {
                                                return Container();
                                              }
                                            }))),
                                Live(
                                    child: Container(
                                        child: GameScreen(
                                            key: _keyGameScreen,
                                            sendMove: sendMove,
                                            sendDelete: sendDelete,
                                            isGm: isGm),
                                        color: Colors.greenAccent)),
                                !_isGm
                                    ? Live(child: Container()) // герои
                                    : Live(
                                        child: _currentMap == "Global"
                                            ? Container(
                                                padding: EdgeInsets.all(10),
                                                child: GridView.builder(
                                                    gridDelegate:
                                                        SliverGridDelegateWithFixedCrossAxisCount(
                                                            crossAxisCount: 3,
                                                            childAspectRatio: 1,
                                                            crossAxisSpacing:
                                                                10,
                                                            mainAxisSpacing:
                                                                10),
                                                    itemCount: Config
                                                        .listOfMarkers.length,
                                                    itemBuilder:
                                                        (BuildContext ctx,
                                                            index) {
                                                      return GestureDetector(
                                                          child: Container(
                                                            alignment: Alignment
                                                                .center,
                                                            child: Image.file(
                                                                _getLocalImageFile(
                                                                    Config.listOfMarkers[
                                                                        index],
                                                                    _dir)),
                                                            decoration: BoxDecoration(
                                                                color: Colors
                                                                    .amber,
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            15)),
                                                          ),
                                                          onTap: () {
                                                            debugPrint(
                                                                'here!!!');

                                                            sendAdd(Config
                                                                    .url_markers +
                                                                Config.listOfMarkers[
                                                                    index]);
                                                          });
                                                    }),
                                              )
                                            : Container(
                                                padding: EdgeInsets.all(10),
                                                child: GridView.builder(
                                                    gridDelegate:
                                                        SliverGridDelegateWithFixedCrossAxisCount(
                                                            crossAxisCount: 3,
                                                            childAspectRatio: 1,
                                                            crossAxisSpacing:
                                                                10,
                                                            mainAxisSpacing:
                                                                10),
                                                    itemCount: Config
                                                        .listOfHeroesTokens
                                                        .length,
                                                    itemBuilder:
                                                        (BuildContext ctx,
                                                            index) {
                                                      return GestureDetector(
                                                          child: Container(
                                                            alignment: Alignment
                                                                .center,
                                                            child: Image.file(
                                                                _getLocalImageFile(
                                                                    Config.listOfHeroesTokens[
                                                                        index],
                                                                    _dir)),
                                                            decoration: BoxDecoration(
                                                                color: Colors
                                                                    .amber,
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            15)),
                                                          ),
                                                          onTap: () {
                                                            debugPrint(
                                                                'here!!!');

                                                            sendAdd(Config
                                                                    .url_heroes +
                                                                Config.listOfHeroesTokens[
                                                                    index]);
                                                          });
                                                    }),
                                              ))
                              ],
                            ))
                          ]))),

                  // Divider(color: Colors.black),
                  PreferredSize(
                    preferredSize: Size.fromHeight(50.0),
                    child: TabBar(
                      labelColor: Colors.black,
                      tabs: [
                        Tab(
                          text: 'Players',
                        ),
                        Tab(
                          text: 'Chat',
                        ),
                        Tab(
                          text: 'Dices',
                        ),
                        Tab(
                          text: 'Info',
                        )
                      ],
                    ),
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        Live(
                            child: Container(
                          color: _bgc,
                          child: Center(
                              child: ListView.builder(
                                  padding: const EdgeInsets.all(8),
                                  itemCount: _activeUsers.length,
                                  itemBuilder:
                                      (BuildContext context, int index) {
                                    return Container(
                                      margin: const EdgeInsets.all(15.0),
                                      padding: const EdgeInsets.all(3.0),
                                      decoration: BoxDecoration(color: _color),
                                      child: ListTile(
                                        leading: CircleAvatar(
                                          backgroundColor: Colors.blueGrey,
                                        ),
                                        title: Text(
                                            '${_activeUsers[index]["username"]}',
                                            style: _sizeTextWhite),
                                        // subtitle: Text(
                                        //     '${_activeUsers[index]["username"]}',
                                        //     style: _sizeTextWhite),
                                        trailing: Icon(Icons.poll),
                                        onTap: () {
                                          print('Debug');
                                        },
                                      ),
                                    );
                                  })),
                        )),
                        Live(
                            child: Container(
                                color: _bgc,
                                child: Column(
                                  children: <Widget>[
                                    Container(
                                      child: ListView.builder(
                                          controller: _chatScrollController,
                                          padding: const EdgeInsets.all(8),
                                          itemCount: _chat.length,
                                          itemBuilder: (BuildContext context,
                                              int index) {
                                            if (_chat[index]['type'] ==
                                                'message') {
                                              return Text(
                                                '${_chat[index]['sender']} : ${_chat[index]['message']}',
                                                style: _sizeTextWhite,
                                              );
                                            } else if (_chat[index]['type'] ==
                                                'roll') {
                                              String sum = getSumStr(
                                                  _chat[index]['dice']);
                                              return Text(
                                                '${_chat[index]['sender']} : ' +
                                                    sum +
                                                    ' = ${_chat[index]['total']}',
                                                style: _sizeTextWhite,
                                              );
                                            } else {
                                              return Text('');
                                            }
                                          }),
                                      height: 96,
                                      padding: const EdgeInsets.all(6.0),
                                      color: _color,
                                    ),
                                    Row(
                                      children: <Widget>[
                                        SizedBox(
                                          width: 15,
                                        ),
                                        Expanded(
                                          child: TextField(
                                            controller: _sendMessageController,
                                            decoration: InputDecoration(
                                                hintText: "Write message...",
                                                hintStyle: TextStyle(
                                                    color: _lightGrey),
                                                border: InputBorder.none),
                                            style: TextStyle(color: _lightGrey),
                                          ),
                                        ),
                                        SizedBox(
                                          width: 15,
                                        ),
                                        FloatingActionButton(
                                          heroTag: "btn$_invite_code",
                                          onPressed: () {
                                            sendMessage(
                                                _sendMessageController.text);
                                            _sendMessageController.clear();
                                          },
                                          child: Icon(
                                            Icons.send,
                                            color: Colors.white,
                                            size: 18,
                                          ),
                                          backgroundColor: _color,
                                          elevation: 0,
                                        ),
                                      ],
                                    ),
                                  ],
                                ))),
                        Live(child: Dices(channel: _channel)),
                        Container(
                          color: _bgc,
                          child: Center(
                              child: new Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: <Widget>[
                                Text('Invite Code'),
                                Text(_invite_code),
                                new MaterialButton(
                                  onPressed: () {
                                    Clipboard.setData(
                                        new ClipboardData(text: _invite_code));
                                  },
                                  color: Theme.of(context).accentColor,
                                  height: 30.0,
                                  minWidth: 150.0,
                                  child: new Text(
                                    "COPY",
                                  ),
                                ),
                                new MaterialButton(
                                  onPressed: () {
                                    refresh();
                                  },
                                  color: Theme.of(context).accentColor,
                                  height: 30.0,
                                  minWidth: 150.0,
                                  child: new Text(
                                    "REFRESH",
                                  ),
                                )
                              ])),
                        )
                      ],
                    ),
                  ),
                ])))));
  }
}

class Dices extends StatefulWidget {
  final WebSocketChannel channel;

  Dices({Key key, @required this.channel}) : super(key: key);

  @override
  _DicesState createState() => _DicesState();
}

class _DicesState extends State<Dices> {
  Map<int, int> _dices = {4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0};

  final _color = const Color.fromRGBO(83, 102, 129, 1);
  final _lightGrey = const Color.fromRGBO(173, 185, 206, 1);

  @override
  Widget build(BuildContext context) {
    return Container(
        child: Column(
      children: [
        Container(
          child: ListView(
            children: [
              MaterialButton(
                onPressed: () {
                  _addDice(4);
                },
                child: Image.asset('assets/dices/d4.png'),
              ),
              MaterialButton(
                onPressed: () {
                  _addDice(6);
                },
                child: Image.asset('assets/dices/d6.png'),
              ),
              MaterialButton(
                onPressed: () {
                  _addDice(8);
                },
                child: Image.asset('assets/dices/d8.png'),
              ),
              MaterialButton(
                onPressed: () {
                  _addDice(10);
                },
                child: Image.asset('assets/dices/d10.png'),
              ),
              MaterialButton(
                onPressed: () {
                  _addDice(12);
                },
                child: Image.asset('assets/dices/d12.png'),
              ),
              MaterialButton(
                onPressed: () {
                  _addDice(20);
                },
                child: Image.asset('assets/dices/d20.png'),
              ),
            ],
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.all(4),
          ),
          color: _lightGrey,
          height: 102.5,
        ),
        Expanded(
            child: Container(
                color: _color,
                child: Row(
                  children: <Widget>[
                    SizedBox(
                      width: 5,
                    ),
                    Expanded(
                        child: Container(
                      height: 50,
                      color: _color,
                      child: Container(
                          padding: const EdgeInsets.all(5),
                          // color: Colors.yellow,
                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            children: [
                              if (_dices[4] > 0)
                                MaterialButton(
                                  minWidth: 40,
                                  onPressed: () {
                                    _zeroDice(4);
                                  },
                                  color: _lightGrey,
                                  child: Text(_dices[4].toString() + "d4"),
                                ),
                              if (_dices[4] > 0) SizedBox(width: 10),
                              if (_dices[6] > 0)
                                MaterialButton(
                                  minWidth: 40,
                                  onPressed: () {
                                    _zeroDice(6);
                                  },
                                  color: _lightGrey,
                                  child: Text(_dices[6].toString() + "d6"),
                                ),
                              if (_dices[6] > 0) SizedBox(width: 10),
                              if (_dices[8] > 0)
                                MaterialButton(
                                  minWidth: 40,
                                  onPressed: () {
                                    _zeroDice(8);
                                  },
                                  color: _lightGrey,
                                  child: Text(_dices[8].toString() + "d8"),
                                ),
                              if (_dices[8] > 0) SizedBox(width: 10),
                              if (_dices[10] > 0)
                                MaterialButton(
                                  minWidth: 40,
                                  onPressed: () {
                                    _zeroDice(10);
                                  },
                                  color: _lightGrey,
                                  child: Text(_dices[10].toString() + "d10"),
                                ),
                              if (_dices[10] > 0) SizedBox(width: 10),
                              if (_dices[12] > 0)
                                MaterialButton(
                                  minWidth: 40,
                                  onPressed: () {
                                    _zeroDice(12);
                                  },
                                  color: _lightGrey,
                                  child: Text(_dices[12].toString() + "d12"),
                                ),
                              if (_dices[12] > 0) SizedBox(width: 10),
                              if (_dices[20] > 0)
                                MaterialButton(
                                  minWidth: 40,
                                  onPressed: () {
                                    _zeroDice(20);
                                  },
                                  color: _lightGrey,
                                  child: Text(_dices[20].toString() + "d20"),
                                ),
                            ],
                          )),
                    )),
                    SizedBox(
                      width: 5,
                    ),
                    FloatingActionButton(
                      onPressed: () {
                        roll();
                      },
                      child: Icon(
                        Icons.casino,
                        color: Colors.white,
                        size: 18,
                      ),
                      backgroundColor: _lightGrey,
                      elevation: 0,
                    ),
                  ],
                ))),
      ],
    ));
  }

  void roll() {
    if (_dices[4] +
            _dices[6] +
            _dices[8] +
            _dices[10] +
            _dices[12] +
            _dices[20] ==
        0) return;
    setState(() {
      String request = '{"type":"roll", "meta": {';
      _dices.keys.forEach((element) {
        request += '"d$element": ${_dices[element]},';
      });
      request = request.substring(0, request.length - 1);
      request += '}}';
      debugPrint(request);
      widget.channel.sink.add(request);
      _dices = {4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0};
    });
  }

  void _addDice(int dice) {
    setState(() {
      _dices[dice] += 1;
    });
  }

  void _zeroDice(int dice) {
    setState(() {
      _dices[dice] = 0;
    });
  }
}
