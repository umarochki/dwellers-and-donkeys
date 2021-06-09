import 'package:flutter/material.dart';
import 'package:rogue/homeScreen.dart';

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
