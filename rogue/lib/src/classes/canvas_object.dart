import 'dart:ui';

class CanvasObject<T> {
  final double dx;
  final double dy;
  final double width;
  final double height;
  final T child;
  final dynamic id;
  final bool unselectable;

  CanvasObject(
      {this.dx = 0,
      this.dy = 0,
      this.width = 100,
      this.height = 100,
      this.child,
      this.id,
      this.unselectable});

  CanvasObject<T> copyWith(
      {double dx,
      double dy,
      double width,
      double height,
      T child,
      dynamic id,
      bool unselectable}) {
    return CanvasObject<T>(
      dx: dx ?? this.dx,
      dy: dy ?? this.dy,
      width: width ?? this.width,
      height: height ?? this.height,
      child: child ?? this.child,
      id: id ?? this.id,
      unselectable: unselectable ?? this.unselectable,
    );
  }

  Size get size => Size(width, height);
  Offset get offset => Offset(dx, dy);
  Rect get rect => offset & size;
}
