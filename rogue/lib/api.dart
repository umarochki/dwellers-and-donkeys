import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:rogue/classes.dart';
import 'package:rogue/conf.dart';
import 'dart:convert';

Map<String, String> headers = {
  'Content-Type': 'application/json; charset=UTF-8',
};

void clean_headers() {
  headers = {
    'Content-Type': 'application/json; charset=UTF-8',
  };
}

Future<List<dynamic>> getMaps(String session) async {
  final response = await http.get(
    Config.url + '/maps?game_id=$session',
    headers: headers,
  );
  updateCookie(response);
  if (response.statusCode == 200) {
    List<dynamic> mapList = json.decode(response.body);
    return mapList;
  } else {
    return [];
  }
}

Future<List<dynamic>> getHeroes() async {
  final response = await http.get(
    Config.url + '/heroes',
    headers: headers,
  );
  updateCookie(response);
  if (response.statusCode == 200) {
    List<dynamic> mapList = json.decode(response.body);
    return mapList;
  } else {
    return [];
  }
}

Future<String> createHero(String name, String sprite, String race,
    String description, String sex) async {
  final response = await http.post(
    Config.url + '/heroes',
    headers: headers,
    body: jsonEncode(<String, String>{
      'name': name,
      'sprite': sprite,
      'race': race,
      'description': description,
      'sex': sex
    }),
  );
  updateCookie(response);
  if (response.statusCode == 201) {
    return response.body;
  } else {
    return response.body;
  }
}

Future<String> login(String username, String password) async {
  clean_headers();
  final response = await http.post(
    Config.url + '/auth/login',
    headers: headers,
    body: jsonEncode(
        <String, String>{'username': username, 'password': password}),
  );
  updateCookie(response);
  if (response.statusCode == 200) {
    String cookie = response.headers['set-cookie'];
    cookie = cookie.substring(
        cookie.indexOf('auth_token=') + 11, cookie.indexOf(';'));
    debugPrint(cookie);
    return cookie;
  } else {
    return "Bad credentials";
  }
}

Future<String> signup(String username, String password) async {
  clean_headers();
  final response = await http.post(
    Config.url + '/auth/signup',
    headers: headers,
    body: jsonEncode(
        <String, String>{'username': username, 'password': password}),
  );
  updateCookie(response);
  if (response.statusCode == 201) {
    String cookie = response.headers['set-cookie'];
    cookie = cookie.substring(
        cookie.indexOf('auth_token=') + 11, cookie.indexOf(';'));
    debugPrint(cookie);
    return "OK";
  } else {
    return response.body;
  }
}

Future<String> quickstart() async {
  final response = await http.post(
    Config.url + '/auth/quickstart',
    headers: headers,
  );
  updateCookie(response);
  if (response.statusCode == 201) {
    String cookie = response.headers['set-cookie'];
    cookie = cookie.substring(
        cookie.indexOf('auth_token=') + 11, cookie.indexOf(';'));
    debugPrint(cookie);
    return cookie;
  } else {
    return "Bad credentials";
  }
}

Future<String> createGame(
    String name, String description, bool isPrivate) async {
  final response = await http.post(
    Config.url + '/games',
    headers: headers,
    body: jsonEncode(<String, dynamic>{
      'name': name,
      'description': description,
      'is_private': isPrivate
    }),
  );

  updateCookie(response);
  if (response.statusCode == 201) {
    debugPrint(response.headers['set-cookie']);
    debugPrint(response.body);
    return jsonDecode(response.body)['invitation_code'];
  } else {
    return response.body;
  }
}

Future<List<Game>> getGmGames() async {
  final response = await http.get(
    Config.url + '/games/gm',
    headers: headers,
  );
  updateCookie(response);
  if (response.statusCode == 200) {
    List<dynamic> gameList = json.decode(response.body);
    List<Game> gameListRsp = gameList
        .map((item) => new Game(
            item['name'], item['description'], item['invitation_code']))
        .toList();
    return gameListRsp;
  } else {
    return [];
  }
}

Future<List<Game>> getPlayerGames() async {
  final response = await http.get(
    Config.url + '/games/history',
    headers: headers,
  );
  updateCookie(response);
  if (response.statusCode == 200) {
    List<dynamic> gameList = json.decode(response.body);
    List<Game> gameListRsp = gameList
        .map((item) => new Game(
            item['name'], item['description'], item['invitation_code']))
        .toList();
    return gameListRsp;
  } else {
    return [];
  }
}

Future<List<Game>> getPublicGames() async {
  final response = await http.get(
    Config.url + '/games',
    headers: headers,
  );
  updateCookie(response);
  if (response.statusCode == 200) {
    List<dynamic> gameList = json.decode(response.body);
    List<Game> gameListRsp = gameList
        .map((item) => new Game(
            item['name'], item['description'], item['invitation_code']))
        .toList();
    return gameListRsp;
  } else {
    return [];
  }
}

void updateCookie(http.Response response) {
  String rawCookie = response.headers['set-cookie'];
  if (rawCookie != null) {
    int index = rawCookie.indexOf(';');
    headers['cookie'] =
        (index == -1) ? rawCookie : rawCookie.substring(0, index);
  }
}
