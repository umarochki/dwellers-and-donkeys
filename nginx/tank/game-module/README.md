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
    * addObject(data, callback) - Добавление объекта на поле.
    * deleteObject(data, callback) - Удаление объекта на поле.
    * updateObjectPosition(data, callback) - Изменение координат объекта. 
    * updateObjectOverlap(data, callback) - Вынесение объекта поверх остальных.
    * clear(callback) - Очистить игровое поле.
    * refresh(data, callback) - Обновить содержимое на игровом поле. 
    * resetDraggedDOMListeners() - Пересоздать обработчики событий на перетаскиваемые объекты.
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

    gameboard.eventManager.subscribe('map', (data) => gameboard.setMap({ sprite: data.sprite }))
    gameboard.eventManager.subscribe('add', (data) => gameboard.addObject({ ...data, id: Math.floor(Math.random() * Math.floor(100))}));
    gameboard.eventManager.subscribe('update_and_start', (data) => { gameboard.updateObjectOverlap(data) });
    gameboard.eventManager.subscribe('update', (data) => console.log('Update!\n', data));
    gameboard.eventManager.subscribe('update_and_save', (data) => console.log('Update save!\n', data));
    gameboard.eventManager.subscribe('set-location', (data) => console.log('Set location!\n', data));
    gameboard.eventManager.subscribe('set-stats', (data) => console.log('Set stats!\n', data));
    gameboard.eventManager.subscribe('grid', (data) => console.log('Grid!\n', data));

    // Картинки беру у клиента из точки входа
    var assets = [{ name: 'grid', path: './locations/{grid.png}' }]

    // Предзагрузка всех используемых спрайтов
    heroes.forEach((hero: string) => 
        assets.push({ name: hero, path: `heroes/${hero}.png` }))

    markersList.forEach((marker: string) => 
        assets.push({ name: marker, path: `markers/${marker}.png` }))

    mapsList.forEach((location: string) => 
        assets.push({ name: location, path: `locations/${location}.png` }))

    // Грузим холст и статики (пока так)
    gameboard.preload(assets, () => {
        // Устанавливаем мапу
        gameboard.addObject({ sprite: './boy-smart.png', xy: [0, 0] }, () => {
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