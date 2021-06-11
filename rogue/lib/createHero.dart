import 'package:flutter/material.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';
import 'package:rogue/conf.dart';

class CreateHero extends StatefulWidget {
  final Function updateHeroes;
  CreateHero({Key key, @required this.updateHeroes}) : super(key: key);

  @override
  CreateHeroState createState() => CreateHeroState();
}

class CreateHeroState extends State<CreateHero> {
  String _name;
  String _sprite;
  String _race;
  String _desc;
  String _sex;
  final formKeyCreateHero = new GlobalKey<FormState>();
  final _sizeTextInput =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(173, 185, 206, 1));
  final _sizeTextPlaceholder =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(97, 116, 146, 1));
  final _sizeTextWhite =
      const TextStyle(fontSize: 20.0, color: Color.fromRGBO(120, 136, 164, 1));

  @override
  Widget build(BuildContext context) {
    List<String> listOfAppearances =
        (new List<String>.from(Config.listOfHeroesTokens))
            .map((x) => x.substring(0, x.length - 4))
            .toList();

    return Scaffold(
        body: Container(
            color: Color.fromRGBO(33, 44, 61, 1),
            child: Center(
                child: Form(
              child: new SingleChildScrollView(
                  key: formKeyCreateHero,
                  child: new Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      new Container(
                        child: new TextFormField(
                          decoration: new InputDecoration(
                              labelText: "Name",
                              labelStyle: _sizeTextPlaceholder),
                          style: _sizeTextInput,
                          onChanged: (val) => _name = val,
                        ),
                        width: 300.0,
                      ),
                      Container(
                        padding: new EdgeInsets.only(top: 10.0),
                        width: 300.0,
                        child: DropdownButton<String>(
                          value: _sprite,
                          style: _sizeTextInput,
                          items: listOfAppearances
                              .map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          }).toList(),
                          hint: Text(
                            "Appearance",
                            style: _sizeTextPlaceholder,
                          ),
                          onChanged: (String value) {
                            setState(() {
                              _sprite = value;
                            });
                          },
                        ),
                      ),
                      new Container(
                        child: new TextFormField(
                          decoration: new InputDecoration(
                              labelText: "Race",
                              labelStyle: _sizeTextPlaceholder),
                          style: _sizeTextInput,
                          onChanged: (val) => _race = val,
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
                          onChanged: (val) => _desc = val,
                        ),
                        width: 300.0,
                        padding: new EdgeInsets.only(top: 10.0),
                      ),
                      Container(
                        width: 300.0,
                        padding: new EdgeInsets.only(top: 10.0),
                        child: DropdownButton<String>(
                          value: _sex,
                          //elevation: 5,
                          style: _sizeTextInput,

                          items: <String>[
                            'Male',
                            'Female',
                            'Other',
                            'Trebuchet',
                          ].map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          }).toList(),
                          hint: Text(
                            "Sex",
                            style: _sizeTextPlaceholder,
                          ),
                          onChanged: (String value) {
                            setState(() {
                              _sex = value;
                            });
                          },
                        ),
                      ),
                      new Padding(
                        padding: new EdgeInsets.only(top: 25.0),
                        child: new MaterialButton(
                          onPressed: () async {
                            String sprite =
                                Config.url_heroes + _sprite + '.png';

                            String rsp = await createHero(
                                _name, sprite, _race, _desc, _sex);
                            debugPrint('$rsp');
                            widget.updateHeroes();
                            Navigator.pop(context);
                            // }
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
            ))));
  }
}
