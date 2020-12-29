import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() => runApp(
      new MyApp(),
    );

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(home: HomeScreen());
  }
}

class HomeScreen extends StatelessWidget {
  String _email;
  String _password;
  final formKey = new GlobalKey<FormState>();
  final _sizeTextBlack = const TextStyle(fontSize: 20.0, color: Colors.black);
  final _sizeTextWhite = const TextStyle(fontSize: 20.0, color: Colors.white);
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      body: new Center(
        child: new Form(
            key: formKey,
            child: new Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                new Container(
                  child: new TextFormField(
                    decoration: new InputDecoration(labelText: "Email"),
                    keyboardType: TextInputType.emailAddress,
                    style: _sizeTextBlack,
                    onSaved: (val) => _email = val,
                    validator: (val) =>
                        !val.contains("@") ? 'Not a valid email.' : null,
                  ),
                  width: 300.0,
                ),
                new Container(
                  child: new TextFormField(
                    decoration: new InputDecoration(labelText: "Password"),
                    obscureText: true,
                    style: _sizeTextBlack,
                    onSaved: (val) => _password = val,
                  ),
                  width: 300.0,
                  padding: new EdgeInsets.only(top: 10.0),
                ),
                new Padding(
                  padding: new EdgeInsets.only(top: 25.0),
                  child: new MaterialButton(
                    onPressed: () {
                      final form = formKey.currentState;
                      if (form.validate()) {
                        form.save();
                        hideKeyboard();
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    SecondScreen(_email, _password)));
                      }
                    },
                    color: Theme.of(context).accentColor,
                    height: 50.0,
                    minWidth: 150.0,
                    child: new Text(
                      "LOGIN",
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

class SecondScreen extends StatelessWidget {
  String _email;
  String _password;
  final _sizeTextBlack = const TextStyle(fontSize: 20.0, color: Colors.black);

  SecondScreen(String email, String password) {
    _email = email;
    _password = password;
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text("Dwellers & Donkeys"),
        actions: <Widget>[
          IconButton(
            icon: Icon(
              Icons.account_box,
              color: Colors.white,
            ),
            tooltip: 'Аккаунт',
            onPressed: null,
          ),
        ],
      ),
      body: new Center(
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            new Padding(
                padding: new EdgeInsets.only(top: 25.0),
                child: new Text("Dwellers & Donkeys")),
            new Padding(
              padding: new EdgeInsets.only(top: 25.0),
              child: new MaterialButton(
                onPressed: () {},
                color: Theme.of(context).accentColor,
                height: 50.0,
                minWidth: 150.0,
                child: new Text("Создать партию"),
              ),
            ),
            new Padding(
              padding: new EdgeInsets.only(top: 25.0),
              child: new MaterialButton(
                onPressed: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => GameBoard()));
                },
                color: Theme.of(context).accentColor,
                height: 50.0,
                minWidth: 150.0,
                child: new Text("Присоединиться"),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class GameBoard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: DefaultTabController(
            length: 3,
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
                      text: 'Info',
                    )
                  ],
                ),
              ),
              Expanded(
                child: TabBarView(
                  children: [
                    Container(
                      color: Colors.deepOrange,
                      child: Center(child: Text('Players')),
                    ),
                    Container(
                      color: Colors.red,
                      child: Center(child: Text('Chat')),
                    ),
                    Container(
                      color: Colors.yellowAccent,
                      child: Center(child: Text('Info')),
                    )
                  ],
                ),
              ),
            ])))));
  }
}
