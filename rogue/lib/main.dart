import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';
import 'dart:convert';
import 'dart:async';

import 'ui/home/screen.dart';

void main() => runApp(
      new MyApp(),
    );

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    imageCache.clear();
    return new MaterialApp(home: HomeScreen());
  }
}

class HomeScreen extends StatelessWidget {
  String _email;
  String _login;
  String _password;
  final formKeyLogin = new GlobalKey<FormState>();
  final formKeyRegister = new GlobalKey<FormState>();
  final _sizeTextInput =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(173, 185, 206, 1));
  final _sizeTextPlaceholder =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(97, 116, 146, 1));
  final _sizeTextWhite =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(120, 136, 164, 1));
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: Color.fromRGBO(33, 44, 61, 1),
        body: DefaultTabController(
          length: 3,
          child: Scaffold(
            appBar: AppBar(
              backgroundColor: Color.fromRGBO(33, 44, 61, 1),
              bottom: TabBar(
                tabs: [
                  Tab(text: 'LOGIN'),
                  Tab(text: 'REGISTER'),
                  Tab(text: 'GUEST'),
                ],
              ),
            ),
            body: TabBarView(
              children: [
                // first: login, second: register, third: guest
                Container(
                    color: Color.fromRGBO(33, 44, 61, 1),
                    child: Center(
                      child: new Form(
                          key: formKeyLogin,
                          child: new Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              new Container(
                                child: new TextFormField(
                                  decoration: new InputDecoration(
                                      labelText: "Login",
                                      labelStyle: _sizeTextPlaceholder),
                                  keyboardType: TextInputType.emailAddress,
                                  style: _sizeTextInput,
                                  onSaved: (val) => _login = val,
                                  // validator: (val) =>
                                  //     !val.contains("@") ? 'Not a valid email.' : null,
                                ),
                                width: 300.0,
                              ),
                              new Container(
                                child: new TextFormField(
                                  decoration: new InputDecoration(
                                      labelText: "Password",
                                      labelStyle: _sizeTextPlaceholder),
                                  obscureText: true,
                                  style: _sizeTextInput,
                                  onSaved: (val) => _password = val,
                                ),
                                width: 300.0,
                                padding: new EdgeInsets.only(top: 10.0),
                              ),
                              new Padding(
                                padding: new EdgeInsets.only(top: 25.0),
                                child: new MaterialButton(
                                  onPressed: () async {
                                    final form = formKeyLogin.currentState;
                                    if (form.validate()) {
                                      form.save();
                                      hideKeyboard();
                                      String cookie =
                                          await login(_login, _password);
                                      // debugPrint('$headers');
                                      // debugPrint('rsp: $cookie');
                                      if (cookie != "Bad credentials") {
                                        Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (context) => Menu()));
                                      } else {
                                        showDialog<void>(
                                          context: context,
                                          builder: (BuildContext context) {
                                            return AlertDialog(
                                              title: Text('Bad credentials'),
                                              content: const Text(
                                                  'Check your login and password and try again'),
                                              actions: <Widget>[
                                                FlatButton(
                                                  child: Text('Ok'),
                                                  onPressed: () {
                                                    Navigator.of(context).pop();
                                                  },
                                                ),
                                              ],
                                            );
                                          },
                                        );
                                      }
                                    }
                                  },
                                  color: Color.fromRGBO(29, 39, 54, 1),
                                  height: 50.0,
                                  minWidth: 300.0,
                                  child: new Text(
                                    "Sign in",
                                    style: _sizeTextWhite,
                                  ),
                                ),
                              )
                            ],
                          )),
                    )),
                Container(
                    color: Color.fromRGBO(33, 44, 61, 1),
                    child: Center(
                      child: new Form(
                          key: formKeyRegister,
                          child: new Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              new Container(
                                child: new TextFormField(
                                  decoration: new InputDecoration(
                                      labelText: "Login",
                                      labelStyle: _sizeTextPlaceholder),
                                  keyboardType: TextInputType.emailAddress,
                                  style: _sizeTextInput,
                                  onSaved: (val) => _login = val,
                                ),
                                width: 300.0,
                              ),
                              new Container(
                                child: new TextFormField(
                                  decoration: new InputDecoration(
                                      labelText: "Password",
                                      labelStyle: _sizeTextPlaceholder),
                                  obscureText: true,
                                  style: _sizeTextInput,
                                  onSaved: (val) => _password = val,
                                ),
                                width: 300.0,
                                padding: new EdgeInsets.only(top: 10.0),
                              ),
                              new Padding(
                                padding: new EdgeInsets.only(top: 25.0),
                                child: new MaterialButton(
                                  onPressed: () async {
                                    final form = formKeyRegister.currentState;
                                    if (form.validate()) {
                                      form.save();
                                      hideKeyboard();
                                      String rsp =
                                          await signup(_login, _password);
                                      debugPrint('$headers');
                                      debugPrint('rsp: $rsp');
                                      if (rsp == "OK") {
                                        Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (context) => Menu()));
                                      } else {
                                        Map<String, dynamic> json =
                                            jsonDecode(rsp);
                                        showDialog<void>(
                                          context: context,
                                          builder: (BuildContext context) {
                                            return AlertDialog(
                                              title: Text('Error'),
                                              content: Text(
                                                  'Error on server. Try another login.'),
                                              actions: <Widget>[
                                                FlatButton(
                                                  child: Text('Ok'),
                                                  onPressed: () {
                                                    Navigator.of(context).pop();
                                                  },
                                                ),
                                              ],
                                            );
                                          },
                                        );
                                      }
                                    }
                                  },
                                  color: Color.fromRGBO(29, 39, 54, 1),
                                  height: 50.0,
                                  minWidth: 300.0,
                                  child: new Text(
                                    "Sign up",
                                    style: _sizeTextWhite,
                                  ),
                                ),
                              )
                            ],
                          )),
                    )),
                Container(
                    color: Color.fromRGBO(33, 44, 61, 1),
                    child: Center(
                        child: new MaterialButton(
                      onPressed: () async {
                        String cookie = await quickstart();
                        if (cookie != "Bad credentials") {
                          Navigator.push(context,
                              MaterialPageRoute(builder: (context) => Menu()));
                        }
                      },
                      color: Color.fromRGBO(29, 39, 54, 1),
                      height: 50.0,
                      minWidth: 300.0,
                      child: new Text(
                        "Sign in as guest",
                        style: _sizeTextWhite,
                      ),
                    ))),
              ],
            ),
          ),
        ));
  }

  void hideKeyboard() {
    SystemChannels.textInput.invokeMethod('TextInput.hide');
  }
}

class Menu extends StatelessWidget {
  String _description;
  String _title;
  String _inviteCode;
  final _color = const Color.fromRGBO(120, 136, 164, 1);
  final _bgc = const Color.fromRGBO(233, 238, 251, 1);
  final _titleTextStyle = const TextStyle(fontSize: 25.0, color: Colors.white);
  final _sizeTextInput =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(173, 185, 206, 1));
  final _sizeTextPlaceholder =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(97, 116, 146, 1));
  final _sizeTextWhite =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(120, 136, 164, 1));

  final formKeyJoin = new GlobalKey<FormState>();
  final formKeyCreate = new GlobalKey<FormState>();

  void hideKeyboard() {
    SystemChannels.textInput.invokeMethod('TextInput.hide');
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: _bgc,
        body: DefaultTabController(
          length: 2,
          child: Scaffold(
            appBar: AppBar(
              title: Text("Dwellers & Donkeys", style: _titleTextStyle),
              backgroundColor: Color.fromRGBO(33, 44, 61, 1),
              bottom: TabBar(
                tabs: [
                  Tab(text: 'JOIN GAME'),
                  Tab(text: 'CREATE GAME'),
                ],
              ),
            ),
            body: TabBarView(
              children: [
                Container(
                    color: Color.fromRGBO(33, 44, 61, 1),
                    child: Center(
                      child: new Form(
                          key: formKeyJoin,
                          child: new Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              new Container(
                                child: new TextFormField(
                                  decoration: new InputDecoration(
                                      labelText: "Invite code",
                                      labelStyle: _sizeTextPlaceholder),
                                  keyboardType: TextInputType.emailAddress,
                                  style: _sizeTextInput,
                                  onSaved: (val) => _inviteCode = val,
                                ),
                                width: 300.0,
                              ),
                              new Padding(
                                padding: new EdgeInsets.only(top: 25.0),
                                child: new MaterialButton(
                                  onPressed: () async {
                                    final form = formKeyJoin.currentState;
                                    if (form.validate()) {
                                      form.save();
                                      hideKeyboard();
                                      if ("OK" == "OK") {
                                        // TODO: проверять наличие игры
                                        Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (context) => GameBoard(
                                                        channel: IOWebSocketChannel
                                                            .connect(
                                                                'ws://207.154.226.69/ws/games/$_inviteCode',
                                                                headers: {
                                                          'Cookie':
                                                              headers['cookie']
                                                        })),
                                                settings: RouteSettings(
                                                    arguments: _inviteCode)));
                                      }
                                    }
                                  },
                                  color: Color.fromRGBO(29, 39, 54, 1),
                                  height: 50.0,
                                  minWidth: 300.0,
                                  child: new Text(
                                    "JOIN GAME",
                                    style: _sizeTextWhite,
                                  ),
                                ),
                              )
                            ],
                          )),
                    )),
                Container(
                    color: Color.fromRGBO(33, 44, 61, 1),
                    child: Center(
                      child: new Form(
                          key: formKeyCreate,
                          child: new Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              new Container(
                                child: new TextFormField(
                                  decoration: new InputDecoration(
                                      labelText: "Title",
                                      labelStyle: _sizeTextPlaceholder),
                                  style: _sizeTextInput,
                                  onSaved: (val) => _title = val,
                                ),
                                width: 300.0,
                              ),
                              new Container(
                                child: new TextFormField(
                                  decoration: new InputDecoration(
                                      labelText: "Description",
                                      labelStyle: _sizeTextPlaceholder),
                                  style: _sizeTextInput,
                                  onSaved: (val) => _description = val,
                                ),
                                width: 300.0,
                                padding: new EdgeInsets.only(top: 10.0),
                              ),
                              new Padding(
                                padding: new EdgeInsets.only(top: 25.0),
                                child: new MaterialButton(
                                  onPressed: () async {
                                    final form = formKeyCreate.currentState;
                                    if (form.validate()) {
                                      form.save();
                                      hideKeyboard();
                                      String inviteCode = await createGame(
                                          _title, _description);
                                      debugPrint('$headers');
                                      debugPrint('rsp: $inviteCode');
                                      if ("OK" == "OK") {
                                        // TODO: проверять респонс
                                        Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (context) => GameBoard(
                                                        channel: IOWebSocketChannel
                                                            .connect(
                                                                'ws://207.154.226.69/ws/games/$inviteCode',
                                                                headers: {
                                                          'Cookie':
                                                              headers['cookie']
                                                        })),
                                                settings: RouteSettings(
                                                    arguments: inviteCode)));
                                      }
                                    }
                                  },
                                  color: Color.fromRGBO(29, 39, 54, 1),
                                  height: 50.0,
                                  minWidth: 300.0,
                                  child: new Text(
                                    "CREATE GAME",
                                    style: _sizeTextWhite,
                                  ),
                                ),
                              )
                            ],
                          )),
                    )),
              ],
            ),
          ),
        ));
  }
}

class GameBoard extends StatefulWidget {
  final WebSocketChannel channel;

  GameBoard({Key key, @required this.channel}) : super(key: key);

  @override
  _GameBoardState createState() => _GameBoardState();
}

class _GameBoardState extends State<GameBoard>
// with AutomaticKeepAliveClientMixin
{
  final _sizeTextWhite = const TextStyle(fontSize: 20.0, color: Colors.white);
  final _bgc = const Color.fromRGBO(67, 83, 107, 1);
  final _color = const Color.fromRGBO(83, 102, 129, 1);
  final _lightGrey = const Color.fromRGBO(173, 185, 206, 1);
  final _chatScrollController = ScrollController();
  final _sendMessageController = TextEditingController();

  String _invite_code = "invite_code_filler";
  List<dynamic> _chat = [];
  List<dynamic> _activeUsers = [];
  WebSocketChannel _channel;

  @override
  void initState() {
    super.initState();
    _channel = widget.channel;
    listen();
    refresh();
  }

  @override
  void dispose() {
    _channel.sink.close();
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
      },
      onDone: () {
        debugPrint('ws channel closed');
        connect(); // TODO: не реконнектиться когда не надо
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
      () => _chatScrollController
          .jumpTo(_chatScrollController.position.maxScrollExtent),
    );
  }

  void sendMessage(String message) {
    _channel.sink.add('{"type":"chat", "meta": "$message"}');
    Timer(
      Duration(milliseconds: 50),
      () => _chatScrollController
          .jumpTo(_chatScrollController.position.maxScrollExtent),
    );
  }

  void handleDisconnect() {
    _channel.sink.close();
    connect();
  }

  void handleRefresh(Map<String, dynamic> json) {
    setState(() {
      _chat = json['meta']['chat'];
      _activeUsers = json['meta']['active_users'];
    });
  }

  void handleConnect(Map<String, dynamic> json) {
    setState(() {
      _activeUsers.add(json['meta']);
    });
  }

  void handleChat(Map<String, dynamic> json) {
    setState(() {
      _chat.add(json['meta']);
    });
    Timer(
      Duration(milliseconds: 50),
      () => _chatScrollController
          .jumpTo(_chatScrollController.position.maxScrollExtent),
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

  @override
  Widget build(BuildContext context) {
    _invite_code = ModalRoute.of(context).settings.arguments;

    return MaterialApp(
        home: DefaultTabController(
            length: 4,
            child: Scaffold(
                body: SafeArea(
                    child: Column(children: <Widget>[
              Container(
                child: GameScreen(),
                color: Colors.greenAccent,
                height: MediaQuery.of(context).size.height / 1.5,
              ),
              Divider(color: Colors.black),
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
                    Container(
                      color: _bgc,
                      child: Center(
                          child: ListView.builder(
                              padding: const EdgeInsets.all(8),
                              itemCount: _activeUsers.length,
                              itemBuilder: (BuildContext context, int index) {
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
                    ),
                    Container(
                        color: _bgc,
                        child: Column(
                          children: <Widget>[
                            Container(
                              child: ListView.builder(
                                  controller: _chatScrollController,
                                  padding: const EdgeInsets.all(8),
                                  itemCount: _chat.length,
                                  itemBuilder:
                                      (BuildContext context, int index) {
                                    if (_chat[index]['type'] == 'message') {
                                      return Text(
                                        '${_chat[index]['sender']} : ${_chat[index]['message']}',
                                        style: _sizeTextWhite,
                                      );
                                    } else if (_chat[index]['type'] == 'roll') {
                                      String sum =
                                          getSumStr(_chat[index]['dice']);
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
                                        hintStyle: TextStyle(color: _lightGrey),
                                        border: InputBorder.none),
                                    style: TextStyle(color: _lightGrey),
                                  ),
                                ),
                                SizedBox(
                                  width: 15,
                                ),
                                FloatingActionButton(
                                  onPressed: () {
                                    sendMessage(_sendMessageController.text);
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
                        )),
                    Dices(channel: _channel),
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
