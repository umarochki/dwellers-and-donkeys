import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:rogue/conf.dart';
import 'dart:convert';

Future<String> login(String username, String password) async {
  final response = await http.post(
    // Uri.https(Config.url, 'api/v1/auth/login'),
    Config.url + '/auth/login',
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(
        <String, String>{'username': username, 'password': password}),
  );
  if (response.statusCode == 200) {
    debugPrint(response.headers['set-cookie']);
    String cookie = response.headers['set-cookie'];
    cookie = cookie.substring(
        cookie.indexOf('auth_token=') + 11, cookie.indexOf(';'));
    return cookie;
  } else {
    return "Bad credentials";
  }
}
