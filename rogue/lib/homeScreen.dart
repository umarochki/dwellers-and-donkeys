import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:rogue/menu.dart';

class HomeScreen extends StatelessWidget {
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
