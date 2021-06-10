# Game Module (D&D Map)

Based on Pixi.JS

### Объект класса GameBoard:
*  **Конструктор**:
   * @param {object} [options] - Объект, содержащий параметры.
   * @param {number} [options.width=800] - Ширина PIXI холста.
   * @param {number} [options.height=600] - Высота PIXI холста.
   * @param {HTMLCanvasElement} [options.view] - HTML-объект холста, который будет взят за основу для PIXI.
   * @param {boolean} [options.transparent=false] - Будет ли приложение иметь прозрачный фон.
   * @param {number} [options.backgroundColor=0x000000] - Цвет заднего плата приложения.
   * @param {Window|HTMLElement} [options.resizeTo] - HTML-элемент, под размер которого будет подстраиваться приложения автоматически.
   * @param {boolean} [options.isGameMaster] - Является ли игрок, запускающий приложение, мастером игры.
   * @returns {Gameboard}

### API:
* **Gameboard**
    * init(assets: { name: string, url: string }[], callback?: () => any) - Инициализация компонентов холста, предзагрузка спрайтов.

* **DragAndDrop**
    * reset() - Пересоздание обработчиков событий на перетаскиваемые объекты.

* **DrawingSystem**
    * set(mode: 'pencil' | 'eraser' | 'none') - Активация режима рисования.
    * style(options: { color?: number, boldness?: number }) - Установка цвета и толщины инструмента.
    * clear() - Очистка холста от рисунков.
    * pencilDown(id: number, boldness?: number, color?: number) - Нажатие на холст для рисунка карандашом.
    * pencilMove(id: number, point: [number, number][]) - Движение карандашом.
    * pencilUp(id: number) - Поднятие карандаша.
    * eraserDown(id: number) - Нажатие на холст ластиком.
    * eraserMove(id: number) - Движение ластиком.
    * eraserUp(id: number) - Поднятие ластика.
    * polygonStartClick(id: number, boldness?: number, color?: number) - Установка начальной верщины полигона.
    * polygonMiddleClick(id: number) - Установка промежуточной вершины полигона.
    * polygonEndClick(id: number) - Установка конечной вершины полигона.
    * polygonMove(id: number) - Движение грани во время рисования полигона.

* **EventManager**
    * add(eventType: string, listener: (any) => void, limit: boolean = false, accumulate: string[] = []) - Добавить подписку на событие.
        * eventType - имя события;
        * listener - функция обратного вызова;
        * limit - ограничение на частоту отправляемых оповещений (60 FPS);
        * accumulate - параметры, которые будут аккумулироваться (например: [xy] - каждые 60 кадров в секунду будет отправляться оповещение, где в объекте будет массив значений xy за все пропущенные оповещения);
    * delete(eventType: string, listener: (any) => void) - Удалить подписку на событие.

* **GameObjectManager**
    * add(options: ObjectOptions, callback?: () => any) - Добавить объект на холст.
    * delete(options: { id: number }, callback?: () => any) - Удалить объект с холста.
    * update(options: { id: number, xy?: [number, number], wh?: [number, number] }, callback?: () => any) - Обновить данные объекта на холсте.
    * refresh(options: { game_objects: { [key: number]: ObjectOptions }}, callback?: () => any) - Добавить несколько объектов на холст.
    * clear(callback?: () => any) - Очистить холст.

* **MapSystem**
    * get width() - Геттер ширины карты.
    * get height() - Геттер высоты карты.
    * set(options, callback?: () => any) - Обновить карту.
    * reset() - Удалить карту.
    * switchGrid() : boolean - Включить/выключить размечающую сетку на карте.

* **VisibilityRegion**
    * set(mode: 'none' | 'draw') - Активировать режим рисования препятствий.
    * clear() - Очистить холст от препятствий.
    * getRegion(options: { position: [number, number] }) - Построить полигон видимости относительно заданной координаты.
    * hide() - Скрыть полигон видимости.

* **Gamemode**
    * me(id) - Установить объект игрока (в режиме игрока).
    * set(mode: boolean) - Установить режим карты.

### Основные события:
* clicked
* object/add
* object/added
* object/deleted
* object/updated/before
* object/updated
* object/updated/after
* object/clicked
* object/selected
* object/unselected
* map/set/after
* draw/pencil/started
* draw/pencil/moved
* draw/pencil/stopped  
* draw/eraser/started
* draw/eraser/moved
* draw/eraser/stopped 
* draw/polygon/click/started
* draw/polygon/click/middle
* draw/polygon/click/stopped 
* draw/polygon/moved 
* region/hided
* region/cleared
* region/showed



### Пример использования на Реакт-компоненте:
```
import Gameboard from './gameboard/Gameboard';

function App() {

  const divRef = React.useRef()    // Ссылка на родителя холста
  const boardRef = React.useRef()  // Ссылка на игровое поле
  
  React.useEffect(() => {
    
    const gameboard = new Gameboard({
      parent: divRef.current,
      transparent: true,
      isGameMaster: true,
      resizeTo: divRef.current
    })

    boardRef.current = gameboard
    const assets = [{ name: 'grid', url: './grid64-1px.png' }, { name: 'grid', url: './grid32-1px.png' }]

    gameboard.init(assets, () => {
      gameboard.eventManager.add('object/add',          (data: any) => gameboard.gameObjectManager.add({ ...data, id: Math.floor(Math.random() * Math.floor(1000)) }))
      
      gameboard.eventManager.add('map/set/after',             (data: any) => console.log('Map set!', data))
      gameboard.eventManager.add('map/grid',            (data: any) => console.log('Grid!', data.enabled))
      gameboard.eventManager.add('object/deleted',       (data: any) => console.log('Deleted!', data.id))
      gameboard.eventManager.add('object/updated',       (data: any) => console.log('Update!', data), true, ['xy'])
      gameboard.eventManager.add('object/updated/before', (data: any) => console.log('Update start!', data.id))
      gameboard.eventManager.add('object/updated/after',   (data: any) => console.log('Update end!', data.id))
      gameboard.eventManager.add('object/clicked',      (data: any) => console.log('Clicked!', data.id))
      gameboard.eventManager.add('object/selected',     (data: any) => console.log('Selected!', data.id))
      gameboard.eventManager.add('draw/pencil/started',   (data: any) => gameboard.drawing.pencilDown(10))
      gameboard.eventManager.add('draw/pencil/moved',    (data: any) => { console.log(data.xy); gameboard.drawing.pencilMove(10, data.xy) }, true, ['xy'])
      gameboard.eventManager.add('draw/pencil/stopped',    (data: any) => gameboard.drawing.pencilUp(10))
      gameboard.eventManager.add('region/hided',   (data: any) => console.log('Region hided!'))
      gameboard.eventManager.add('region/cleared',    (data: any) => console.log('Region cleared!'))
      gameboard.eventManager.add('region/showed',    (data: any) => console.log('Region showed for: ', data), true)

      gameboard.map.set({ sprite: './map.png' })

  }, [])

  return (
    <div className="App draggable" style={{backgroundColor: '#444'}}>
      <div className='group'>
          <button className='button' onClick={ () => boardRef.current.map.switchGrid() }>Сетка</button>
          <button className='button' onClick={ () => { boardRef.current.drawing.set('pencil'); } }>Рисовать</button>
          <button className='button' onClick={ () => { boardRef.current.drawing.set('eraser'); } }>Стирать</button>
          <button className='button' onClick={ () => { boardRef.current.drawing.set('polygon'); } }>Фигуры</button>
          <button className='button' onClick={ () => { boardRef.current.drawing.clear(); } }>Удалить рисунок</button>
          '-----'
          <button className='button' onClick={ () => { boardRef.current.visibilityRegion.set('draw'); } }>Полигоны</button>
          <button className='button' onClick={ () => { boardRef.current.visibilityRegion.clear(); } }>Удалить полигоны</button>
          '-----'
          <button className='button' onClick={ () => { boardRef.current.map.set({ sprite: `./undertale.jpg`}); } }>Карта 1</button>
          <button className='button' onClick={ () => { boardRef.current.map.set({ sprite: `./map.png`}); } }>Карта 2</button>

        </div>
      <div ref={divRef}></div>
    </div>
  );
};
```