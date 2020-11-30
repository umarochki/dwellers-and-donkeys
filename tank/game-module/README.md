# Game Module (D&D Map)

Based on Pixi.JS

### Класс GameBoard:
Игровое поле.
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
    * addObject(meta, callback) - Добавление объекта на поле. Callback опционально
    * updateObjectPosition(meta, callback) - Изменение координат объекта. Callback опционально
    * switchGrid() - Включение/выключение сетки (потом сделаю удобнее)

### Класс GameObject:
Игровой объект.
* Конструктор:
   * @param {object} [options] - The optional game object parameters.
   * @param {string} [src] - Object image source.
   * @param {number} [width] - Object width.
   * @param {number} [height] - Object height.
   * @param {number[]} [xy] - Object init coordinates: [x, y].
   * @returns {GameObject}

### Класс EventManager:
Объект, отвечающий за оповещение при изменениях на игровом поле.
* Конструктор:
    * @returns {EventManager}

* Mетоды:
    * subscribe(eventType, listener) - Подписаться на события определенного типа
    * unsubscribe(eventType, listener) - Отписаться от события
    * notify(eventType, data) - Триггер на событие

### Пример использования на Реакт-компоненте:
```
import Gameboard from './gameboard/Gameboard';

function App() {

  const divRef = React.useRef()    // Ссылка на родителя холста
  const boardRef = React.useRef()  // Ссылка на игровое поле
  
  React.useEffect(() => {
    
    const gameboard = new Gameboard({
      parent: divRef.current,
      // Нужно указать ширину/длину, иначе отчего-то хендлеры не робят
      width: divRef.current.clientWidth, 
      height: divRef.current.clientHeight,
      transparent: true
      //backgroundColor: 0xfff000
      // TODO: isGameMaster: {boolean} 

    })

    gameboard.eventManager.subscribe('map', (e) => console.log('Map has been changed!\n', e))
    gameboard.eventManager.subscribe('add', (e) => console.log('New object!\n', e))
    gameboard.eventManager.subscribe('update', (e) => console.log('Update!\n', e))

    // Картинки беру у клиента из точки входа
    var assets = [{ name: 'grid', path: './locations/{grid.png}' }]

    // Грузим холст и статики (пока так)
    gameboard.preload(assets, () => {
        // Устанавливаем мапу
        gameboard.setMap('./locations/{map.png}', () => {
            // Сохраняем ссылку
            boardRef.current = gameboard

            gameboard.addObject({ sprite: './boy-smart.png', xy: [0, 0] }, () => {
                gameboard.updateObjectPosition({ id: 0, xy: [439, 256] })
            })
        })
    })

  }, [])

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