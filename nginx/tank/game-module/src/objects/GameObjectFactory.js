import GameObject from './GameObject';
import Hero from './Hero';
import Marker from './Marker';

export default class GameObjectFactory {
  constructor(options) {
    
    switch (options.type) {
      
      case 'marker':
        return new Marker(options)
        break;

      case 'hero':
        return new Hero(options)
        break;

      default:
        return new Hero(options)
        break;
    }
  }
}