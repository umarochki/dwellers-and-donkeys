import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rogue/api.dart';
import 'package:flutter/foundation.dart';
import 'package:rogue/classes.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';
import 'dart:convert';
import 'dart:async';
import 'package:rogue/homeScreen.dart';

import 'ui/home/screen.dart';

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
