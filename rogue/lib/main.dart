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
          title: new Text("Авторизован"),
        ),
        body: new Center(
          child: new Text(
            "Email: $_email, password: $_password",
            style: _sizeTextBlack,
          ),
        ));
  }
}
