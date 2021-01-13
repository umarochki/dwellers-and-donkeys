import GameObject from './GameObject';
import Character from './Character';
import LocationMarker from './LocationMarker';

export default class GameObjectFactory {
  constructor(options) {
    switch (options.type) {
      case 'character':
        return new Character(options)
        break;

      case 'location-marker':
        return new LocationMarker(options)
        break;

      default:
        return new GameObject(options)
        break;
    }
  }
}