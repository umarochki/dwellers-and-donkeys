import GameObject from './GameObject';
import containsPoint from '../utils/containsPoint';

export default class Hero extends GameObject {

  constructor(options) {
    super(options);

    this.visionRegion = options.visionRegion;

    this.sprite.scale.set(0.1);   // TEMP
    this.sprite.containsPoint = containsPoint;

  }

  onSelect() {
    super.onSelect();
    this.visionRegion.getRegion([this.x, this.y]);
  }

  offSelect() {
    super.offSelect();
    this.visionRegion.clear();
  }

  onDragMove(e) {
    super.onDragMove(e);
    if (this.selected) this.visionRegion.getRegion([this.x, this.y]);
  }
}