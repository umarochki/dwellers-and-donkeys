import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';
import 'package:rogue/classes.dart';
import 'package:web_socket_channel/io.dart';
import 'package:rogue/gameboard.dart';

class Menu extends StatefulWidget {
  @override
  _MenuState createState() => _MenuState();
}

class _MenuState extends State<Menu> {
  String _description;
  String _title;
  bool _isPrivate = false;
  String _inviteCode;
  final _color = const Color.fromRGBO(120, 136, 164, 1);
  final _bgc = const Color.fromRGBO(233, 238, 251, 1);
  final _titleTextStyle = const TextStyle(fontSize: 25.0, color: Colors.white);
  final _lowTitleTextStyle =
      const TextStyle(fontSize: 15.0, color: Colors.white);
  final _midWhiteTextStyle =
      const TextStyle(fontSize: 20.0, color: Colors.white);

  final _lowSizeTextWhite =
      const TextStyle(fontSize: 15.0, color: Color.fromRGBO(120, 136, 164, 1));
  final _sizeTextInput =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(173, 185, 206, 1));
  final _sizeTextPlaceholder =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(97, 116, 146, 1));
  final _sizeTextWhite =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(120, 136, 164, 1));

  final formKeyJoin = new GlobalKey<FormState>();
  final formKeyCreate = new GlobalKey<FormState>();

  List<Game> _gmGames = [];
  List<Game> _playerGames = [];
  List<Game> _publicGames = [];

  String _publicFilter = "";

  void hideKeyboard() {
    SystemChannels.textInput.invokeMethod('TextInput.hide');
  }

  void loadHistory() async {
    _gmGames = await getGmGames();
    _playerGames = await getPlayerGames();
    _publicGames = await getPublicGames();
    if (this.mounted)
      setState(() {
        _gmGames = _gmGames;

        _playerGames = _playerGames;
        _publicGames = _publicGames;
      });
  }

  @override
  Widget build(BuildContext context) {
    loadHistory();
    return new Scaffold(
        backgroundColor: _bgc,
        body: DefaultTabController(
          length: 4,
          child: Scaffold(
            appBar: AppBar(
              title: Text("Dwellers & Donkeys", style: _titleTextStyle),
              backgroundColor: Color.fromRGBO(33, 44, 61, 1),
              bottom: TabBar(
                tabs: [
                  Tab(text: 'Join'),
                  Tab(text: 'Create'),
                  Tab(text: 'History'),
                  Tab(text: 'Public'),
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
                                        // TODO: ?????????????????? ?????????????? ????????
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
                              new Container(
                                child: new CheckboxListTile(
                                  value: _isPrivate,
                                  onChanged: (val) {
                                    setState(() {
                                      _isPrivate = val;
                                    });
                                  },
                                  title: new Text(
                                    'Private Game',
                                    style: _sizeTextPlaceholder,
                                  ),
                                  controlAffinity:
                                      ListTileControlAffinity.leading,
                                  activeColor: _color,
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
                                          _title, _description, _isPrivate);
                                      debugPrint('$headers');
                                      debugPrint('rsp: $inviteCode');
                                      if ("OK" == "OK") {
                                        // TODO: ?????????????????? ??????????????
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
                Container(
                    color: Color.fromRGBO(33, 44, 61, 1),
                    child: ListView.builder(
                        padding: EdgeInsets.all(20),
                        itemCount: _gmGames.length + _playerGames.length + 3,
                        itemBuilder: (BuildContext context, int index) {
                          if (index == 0) {
                            return Container(); //?????????? ?? ?????????????? ???????? ??????
                            return TextField(
                              decoration: new InputDecoration(
                                  labelText: "Search...",
                                  labelStyle: _sizeTextPlaceholder),
                              obscureText: true,
                              style: _sizeTextInput,
                              onChanged: (text) {
                                debugPrint("Hello there");
                              },
                            );
                          } else if (index == 1) {
                            return Text('Created games (as Game Master):',
                                style: _lowTitleTextStyle);
                          } else if (index == _gmGames.length + 2) {
                            return Text('Game history (as Player):',
                                style: _lowTitleTextStyle);
                          } else if (index < _gmGames.length + 2) {
                            return ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Colors.blueGrey,
                              ),
                              title: Text('${_gmGames[index - 2].name}',
                                  style: _midWhiteTextStyle),
                              subtitle: Text(
                                  '${_gmGames[index - 2].description}',
                                  style: _lowSizeTextWhite),
                              trailing: MaterialButton(
                                onPressed: () async {
                                  Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) => GameBoard(
                                                  channel: IOWebSocketChannel
                                                      .connect(
                                                          'ws://207.154.226.69/ws/games/${_gmGames[index - 2].invitationCode}',
                                                          headers: {
                                                    'Cookie': headers['cookie']
                                                  })),
                                          settings: RouteSettings(
                                              arguments: _gmGames[index - 2]
                                                  .invitationCode)));
                                },
                                color: Theme.of(context).accentColor,
                                height: 30.0,
                                minWidth: 40.0,
                                child: new Text(
                                  "JOIN",
                                ),
                              ),
                            );
                          } else {
                            return ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Colors.blueGrey,
                                ),
                                title: Text(
                                    '${_playerGames[index - 3 - _gmGames.length].name}',
                                    style: _midWhiteTextStyle),
                                subtitle: Text(
                                    '${_playerGames[index - 3 - _gmGames.length].description}',
                                    style: _lowSizeTextWhite),
                                trailing: MaterialButton(
                                  onPressed: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => GameBoard(
                                                    channel: IOWebSocketChannel
                                                        .connect(
                                                            'ws://207.154.226.69/ws/games/${_playerGames[index - 3 - _gmGames.length].invitationCode}',
                                                            headers: {
                                                      'Cookie':
                                                          headers['cookie']
                                                    })),
                                            settings: RouteSettings(
                                                arguments: _playerGames[index -
                                                        3 -
                                                        _gmGames.length]
                                                    .invitationCode)));
                                  },
                                  color: Theme.of(context).accentColor,
                                  height: 30.0,
                                  minWidth: 40.0,
                                  child: new Text(
                                    "JOIN",
                                  ),
                                ));
                          }
                        })),
                Container(
                    color: Color.fromRGBO(33, 44, 61, 1),
                    child: ListView.builder(
                        padding: EdgeInsets.all(20),
                        itemCount: _publicGames.length + 2,
                        itemBuilder: (BuildContext context, int index) {
                          if (index == 0) {
                            return Container(
                                child: TextField(
                              decoration: InputDecoration(
                                  border: InputBorder.none,
                                  hintText: "Search...",
                                  hintStyle: _sizeTextInput),
                              style: _sizeTextInput,
                              onChanged: (text) {
                                debugPrint("Hello there");
                                setState(() {
                                  _publicFilter = text;
                                });
                              },
                            ));
                          } else if (index == 1) {
                            return Text('Public games:',
                                style: _lowTitleTextStyle);
                          }
                          if (_publicGames[index - 2]
                                  .description
                                  .contains(_publicFilter) ||
                              _publicGames[index - 2]
                                  .name
                                  .contains(_publicFilter))
                            return ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Colors.blueGrey,
                              ),
                              title: Text('${_publicGames[index - 2].name}',
                                  style: _midWhiteTextStyle),
                              subtitle: Text(
                                  '${_publicGames[index - 2].description}',
                                  style: _lowSizeTextWhite),
                              trailing: MaterialButton(
                                onPressed: () async {
                                  Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) => GameBoard(
                                                  channel: IOWebSocketChannel
                                                      .connect(
                                                          'ws://207.154.226.69/ws/games/${_publicGames[index - 2].invitationCode}',
                                                          headers: {
                                                    'Cookie': headers['cookie']
                                                  })),
                                          settings: RouteSettings(
                                              arguments: _gmGames[index - 2]
                                                  .invitationCode)));
                                },
                                color: Theme.of(context).accentColor,
                                height: 30.0,
                                minWidth: 40.0,
                                child: new Text(
                                  "JOIN",
                                ),
                              ),
                            );
                          else
                            return Container();
                        }))
              ],
            ),
          ),
        ));
  }
}
