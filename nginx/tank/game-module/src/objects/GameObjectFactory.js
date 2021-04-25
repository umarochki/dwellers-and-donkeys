import GameObject from './GameObject';
import Character from './Character';
import Marker from './Marker';

export default class GameObjectFactory {
  constructor(options) {
    switch (options.type) {
      case 'marker':
        return new Marker(options)
        break;

      default:
        return new Character(options)
        break;
    }
  }
}