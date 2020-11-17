import './App.css';
import GameMap from './GameMap';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

function App() {
  return (
    <div className="App">
      <GameMap width={WIDTH} height={HEIGHT} />
    </div>
  );
}

export default App;
