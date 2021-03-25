import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';

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
  final formKey = new GlobalKey<FormState>();
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
      body: new Center(
        child: new Form(
            key: formKey,
            child: new Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                new Container(
                  child: new TextFormField(
                    decoration: new InputDecoration(
                        labelText: "Login", labelStyle: _sizeTextPlaceholder),
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
                      final form = formKey.currentState;
                      if (form.validate()) {
                        form.save();
                        hideKeyboard();
                        String cookie = await login(_login, _password);
                        debugPrint('rsp: $cookie');
                        if (cookie != "Bad credentials") {
                          debugPrint('lol');
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      Menu(_login, _password)));
                        } else {
                          debugPrint('kek');
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
      ),
    );
  }

  void hideKeyboard() {
    SystemChannels.textInput.invokeMethod('TextInput.hide');
  }
}

class Menu extends StatelessWidget {
  String _login;
  String _password;
  final _color = const Color.fromRGBO(120, 136, 164, 1);
  final _bgc = const Color.fromRGBO(233, 238, 251, 1);
  final _titleTextStyle = const TextStyle(fontSize: 25.0, color: Colors.black);

  Menu(String login, String password) {
    _login = login;
    _password = password;
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      // appBar: new AppBar(
      //   backgroundColor: _color,
      //   title: new Text("Dwellers & Donkeys"),
      //   actions: <Widget>[
      //     IconButton(
      //       icon: Icon(
      //         Icons.account_box,
      //         color: Colors.white,
      //       ),
      //       tooltip: 'Аккаунт',
      //       onPressed: null,
      //     ),
      //   ],
      // ),

      backgroundColor: _bgc,
      body: new Center(
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            new Padding(
                padding: new EdgeInsets.only(top: 25.0),
                child: new Text("Dwellers & Donkeys", style: _titleTextStyle)),
            new Padding(
              padding: new EdgeInsets.only(top: 25.0),
              child: new MaterialButton(
                onPressed: () {},
                color: _color,
                height: 50.0,
                minWidth: 150.0,
                child: new Text("CREATE GAME",
                    style: TextStyle(fontSize: 15.0, color: Colors.white)),
              ),
            ),
            new Padding(
              padding: new EdgeInsets.only(top: 25.0),
              child: new MaterialButton(
                onPressed: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => GameBoard()));
                },
                color: _bgc,
                height: 50.0,
                minWidth: 150.0,
                child: new Text("JOIN",
                    style: TextStyle(fontSize: 15.0, color: _color)),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class GameBoard extends StatelessWidget {
  final _sizeTextWhite = const TextStyle(fontSize: 20.0, color: Colors.white);
  final _bgc = const Color.fromRGBO(67, 83, 107, 1);
  final _color = const Color.fromRGBO(83, 102, 129, 1);
  final _light_grey = const Color.fromRGBO(173, 185, 206, 1);

  String _invite_code = "invite_code_filler";

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: DefaultTabController(
            length: 4,
            child: Scaffold(
                body: SafeArea(
                    child: Column(children: <Widget>[
              Container(
                color: Colors.greenAccent,
                height: MediaQuery.of(context).size.height / 1.5,
              ),
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
                          child: new ListView(children: <Widget>[
                        new Container(
                          margin: const EdgeInsets.all(15.0),
                          padding: const EdgeInsets.all(3.0),
                          decoration: BoxDecoration(color: _color),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.blueGrey,
                            ),
                            title: Text('Player 1', style: _sizeTextWhite),
                            subtitle: Text('Cool Name', style: _sizeTextWhite),
                            trailing: Icon(Icons.poll),
                            onTap: () {
                              print('Debug');
                            },
                          ),
                        ),
                        new Container(
                          margin: const EdgeInsets.all(15.0),
                          padding: const EdgeInsets.all(3.0),
                          decoration: BoxDecoration(color: _color),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.blueGrey,
                            ),
                            title: Text('Player 2', style: _sizeTextWhite),
                            subtitle:
                                Text('Cooler Name', style: _sizeTextWhite),
                            trailing: Icon(Icons.poll),
                            onTap: () {
                              print('Debug');
                            },
                          ),
                        )
                      ])),
                    ),
                    Container(
                        color: _bgc,
                        child: Column(
                          children: <Widget>[
                            new Container(
                              child: new ListView(children: <Widget>[
                                Text('Player 2 : tmp question',
                                    style: _sizeTextWhite),
                                Text('Player 1 : tmp answer',
                                    style: _sizeTextWhite),
                                Text('Player 2 : tmp question',
                                    style: _sizeTextWhite),
                                Text('Player 1 : tmp answer',
                                    style: _sizeTextWhite),
                                Text('Player 2 : tmp question',
                                    style: _sizeTextWhite),
                                Text('Player 1 : tmp answer',
                                    style: _sizeTextWhite),
                                Text('Player 2 : tmp question',
                                    style: _sizeTextWhite),
                                Text('Player 1 : tmp answer',
                                    style: _sizeTextWhite),
                              ]),
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
                                    decoration: InputDecoration(
                                        hintText: "Write message...",
                                        hintStyle:
                                            TextStyle(color: _light_grey),
                                        border: InputBorder.none),
                                    style: TextStyle(color: _light_grey),
                                  ),
                                ),
                                SizedBox(
                                  width: 15,
                                ),
                                FloatingActionButton(
                                  onPressed: () {},
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
                    Container(
                        child: Column(
                      children: [
                        Container(
                          child: ListView(
                            children: [
                              MaterialButton(
                                onPressed: () {},
                                child: Image.asset('assets/dices/d4.png'),
                              ),
                              MaterialButton(
                                onPressed: () {},
                                child: Image.asset('assets/dices/d6.png'),
                              ),
                              MaterialButton(
                                onPressed: () {},
                                child: Image.asset('assets/dices/d8.png'),
                              ),
                              MaterialButton(
                                onPressed: () {},
                                child: Image.asset('assets/dices/d10.png'),
                              ),
                              MaterialButton(
                                onPressed: () {},
                                child: Image.asset('assets/dices/d12.png'),
                              ),
                              MaterialButton(
                                onPressed: () {},
                                child: Image.asset('assets/dices/d20.png'),
                              ),
                            ],
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.all(4),
                          ),
                          color: _light_grey,
                          height: 118.5,
                        ),
                        Container(
                          height: 50,
                          color: _color,
                        )
                      ],
                    )),
                    Container(
                      color: _bgc,
                      child: Center(
                          child: new Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                            Text('Invite Code'),
                            Text(''),
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
                            )
                          ])),
                    )
                  ],
                ),
              ),
            ])))));
  }
}
