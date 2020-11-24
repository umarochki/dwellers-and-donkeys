import GameMap from './components/GameMap';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const MAP_IMAGE_PATH = './map.png'
const BG_COLOR = 0x333333;

function App() {
  return (
    <div className="App">
      <GameMap 
        width={WIDTH} 
        height={HEIGHT} 
        mapImagePath={MAP_IMAGE_PATH}
        backgroundColor={BG_COLOR}
      />
    </div>
  );
}

export default App;
