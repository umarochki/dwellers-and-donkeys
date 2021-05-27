import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

class Live extends StatefulWidget {
  final Widget child;
  Live({Key key, @required this.child}) : super(key: key);

  @override
  LiveState createState() => LiveState();
}

class LiveState extends State<Live> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return widget.child;
  }
}
