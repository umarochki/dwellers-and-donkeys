import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:rogue/menu.dart';

class CreateHero extends StatelessWidget {
  String _email;
  String _login;
  String _password;
  final formKeyCreateHero = new GlobalKey<FormState>();
  final _sizeTextInput =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(173, 185, 206, 1));
  final _sizeTextPlaceholder =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(97, 116, 146, 1));
  final _sizeTextWhite =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(120, 136, 164, 1));
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        body: Container(
            color: Color.fromRGBO(33, 44, 61, 1),
            child: Center(
              child: new Form(
                  key: formKeyCreateHero,
                  child: new Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      new Container(
                        child: new TextFormField(
                          decoration: new InputDecoration(
                              labelText: "Name",
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
                              labelText: "Appearance",
                              labelStyle: _sizeTextPlaceholder),
                          style: _sizeTextInput,
                          onSaved: (val) => _password = val,
                        ),
                        width: 300.0,
                        padding: new EdgeInsets.only(top: 10.0),
                      ),
                      new Container(
                        child: new TextFormField(
                          decoration: new InputDecoration(
                              labelText: "Race",
                              labelStyle: _sizeTextPlaceholder),
                          style: _sizeTextInput,
                          onSaved: (val) => _password = val,
                        ),
                        width: 300.0,
                        padding: new EdgeInsets.only(top: 10.0),
                      ),
                      new Container(
                        child: new TextFormField(
                          decoration: new InputDecoration(
                              labelText: "Description",
                              labelStyle: _sizeTextPlaceholder),
                          style: _sizeTextInput,
                          onSaved: (val) => _password = val,
                        ),
                        width: 300.0,
                        padding: new EdgeInsets.only(top: 10.0),
                      ),
                      new Container(
                        child: new TextFormField(
                          decoration: new InputDecoration(
                              labelText: "Sex",
                              labelStyle: _sizeTextPlaceholder),
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
                            final form = formKeyCreateHero.currentState;
                            if (form.validate()) {
                              form.save();
                              // TODO: api
                              Navigator.pop(context);
                            }
                          },
                          color: Color.fromRGBO(29, 39, 54, 1),
                          height: 50.0,
                          minWidth: 300.0,
                          child: new Text(
                            "Create hero",
                            style: _sizeTextWhite,
                          ),
                        ),
                      )
                    ],
                  )),
            )));
  }
}
