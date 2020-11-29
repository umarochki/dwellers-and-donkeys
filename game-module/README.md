# Game Module (D&D Map)

Based on Pixi.JS

### Объект GameBoard:
*  Конструктор:
   * @param {object} [options] - The optional gameboard parameters.
   * @param {number} [options.width=800] - Width of PIXI application.
   * @param {number} [options.height=600] - Height of PIXI application.
   * @param {HTMLCanvasElement} [options.view] - The canvas to use as a view, optional.
   * @param {boolean} [options.transparent=false] - If the render view is transparent.
   * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area.
   * @param {string} [options.spritesheet] - Path to the spritesheet file that PIXI's loader should load.
   * @param {Window|HTMLElement} [options.resizeTo] - Element to automatically resize stage to.
   * @returns {Gameboard}

* Ключевые методы:
    * preload(callback) - Предзагрузка игровго поля
    * setMap(path, callback) - Установка мапы
    * switchGrid() - Включение/выключение сетки (потом сделаю удобнее)
    

### Пример использования на Реакт-компоненте:
```
import Gameboard from './gameboard/Board';

function App() {

  const divRef = React.useRef();    // Ссылка на родителя холста
  const boardRef = React.useRef();  // Ссылка на игровое поле
  
  React.useEffect(() => {
    
    const gameboard = new Gameboard({ 
      parent: divRef.current,
      width: {number}, 
      height: {number},
      transparent: true,
   // backgroundColor: {string}
   // resizeTo: {HTMLElement}
   // TODO: isGameMaster: {boolean}, 

    });

    // Грузим холст и статики (пока так)
    gameboard.preload(() => {
      // Устанавливаем мапу
      gameboard.setMap(MAP_IMAGE_PATH, () => {
        // Сохраняем ссылку
        boardRef.current = gameboard;
      });
    });

  }, []);

  return (
    <div className="App draggable" style={{backgroundColor: '#444'}}>
      <img src='./boy-smart.png' alt='img-1' draggable="true" style={{width: '80px'}}/> 
      <img src='./boy-strong.png' alt='img-2' draggable="true" style={{width: '80px'}}/> 
      <img src='./dragon.png' alt='img-3' draggable="true" style={{width: '80px'}}/> 
      <button onClick={ () => boardRef.current.switchGrid() }>Сетка</button>
      <div ref={divRef}></div>
    </div>
  );
};
```