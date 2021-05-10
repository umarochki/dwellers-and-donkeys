import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:rogue/conf.dart';
import 'dart:convert';

Map<String, String> headers = {
  'Content-Type': 'application/json; charset=UTF-8',
};

Future<String> login(String username, String password) async {
  final response = await http.post(
    // Uri.https(Config.url, 'api/v1/auth/login'),
    Config.url + '/auth/login',
    // headers: <String, String>{
    //   'Content-Type': 'application/json; charset=UTF-8',
    // },
    headers: headers,
    body: jsonEncode(
        <String, String>{'username': username, 'password': password}),
  );
  updateCookie(response);
  if (response.statusCode == 200) {
    // debugPrint(response.headers['set-cookie']);
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

Future<String> createGame(String name, String description) async {
  final response = await http.post(
    Config.url + '/games',
    headers: headers,
    body:
        jsonEncode(<String, String>{'name': name, 'description': description}),
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

void updateCookie(http.Response response) {
  String rawCookie = response.headers['set-cookie'];
  if (rawCookie != null) {
    int index = rawCookie.indexOf(';');
    headers['cookie'] =
        (index == -1) ? rawCookie : rawCookie.substring(0, index);
  }
}
