 # WZRD
### Гайд по подниманию с нуля:

#### 1) Запускаем все:
##### Дев:
```docker-compose up -d --build```
##### Продакшн:
```docker-compose -f docker-compose-prod.yml up -d --build```


#### 2) Залетаем в контейнер wzrd
```docker exec -it umr_wzrd bash```

#### 3) Делаем миграции
```python3  manage.py migrate```

#### 4) Создаем себе юзера напотестить
```python3  manage.py createsuperuser```, дальше по инструкции, регистрацию завезу попоже.

### API
Авторизация:
```
POST /api/v1/auth/login [Войти] Ждет поля: username, password

GET/POST /api/v1/auth/logout [Выйти]

GET/POST /api/v1/auth/quickstart [Быстрая регистрация]
POST /api/v1/auth/signup [Регистрация]

Ждет как минимум username, password.
Можно еще передать: first_name, last_name, email.

GET /api/v1/auth/me [Информация о текущем пользователе]

GET /api/v1/auth/reset-password [Восстановление пароля]
```
Что-то про игры:
```
GET /api/v1/games [Список всех видимых игр]
POST /api/v1/games [Создать игру] 
Ждет поля: name, description..

GET /api/v1/games/history [Список всех игр, где ты игрок]
GET /api/v1/games/gm [Список всех игр, где ты ГМ]
```

Медия:
```
POST /api/v1/media [Загрузить изображение]
Ждет: multipart-formdata (file: binary), 
а также поля: name, type

Ответ:
{
    "file": <link>
    "id": <int>
    "type": <str>
    "name": <str>
    "created": <int>
    "creator": <int>
}
```

Карты:
```
GET /api/v1/maps [Получить список карт (дефолтные + загруженные пользователем)]
Ответ:
[
    {
    "file": "http://localhost/media/tank/Bayport.png",
    "name": "Bayport",
    "id": "44371d0e7cae73c9081dc2b7ed70aab1"
    },
    {
    "file": "http://localhost/media/tank/Blackacre.png",
    "name": "Blackacre",
    "id": "363cceec56f7de119804457c21cce317"
    },
    ...
]
```
Персонажи:
```
GET /api/v1/heroes [Список игр]
POST /api/v1/heroes [Создать игру] 
Ждет поля: name, sex, race, (добавить description), (пока все, потом статов добавим)
```
Вебсокетная сессия:
```
/ws/games/GAME_ID [Зайти]
```
список действий:
```
Добавление объекта
Формат запроса:
{
    "type": "add",
    "meta": {
        "type": <character,marker>
        + любые поля
    }
}
Формат ответа:
Такой же, но среди параметров объекта появляется id.

Добавление героя
Формат запроса:
{
    "type": "add",
    "meta": {
        "type": "hero"
        "hero_id": <id базового персонажа, см. POST /heroes>
        + любые поля
    }
}
Формат ответа:
Такой же, но среди параметров объекта появляется id.

Обновление объекта:
Формат запроса:
{
    "type": "update",
    "meta": {
        "id": 5,
        "hp": 15,
        "xy": [3, -5]
    }
}
Формат ответа: такой же

Удаление объекта:
Формат запроса:
{
    "type": "delete",
    "meta": {
        "id": 5
    }
}
Формат ответа: такой же

Получить всю информацию о сессии:
Формат запроса:
{
    "type": "refresh"
}

Формат ответа:
{
    "type": "refresh",
    "meta": {
        "game_objects": {
            "1": {},
            "2": {},
            ...
        },
        "chat": [
            {
                "type": "message",
                "time": "2020-12-06 12:51:41.977600", (utc)
                "message": "MESSAGE",
                "sender": "testuser"
            }, 
            {
                "type": "roll",
                "time": '2020-12-06 12:51:41.977600', (utc)
                "dice": {
                    "d6": 2,
                    "d20": 1
                },
                "rolls": {
                    "d6": [3, 6],
                    "d20": [14]
                },
                "sender": "testuser"
            },
            ...  
        ],
        "active_users": [
            {"id": "1", "username": "sevenzik"},
            {"id": "2", "username": "darkenezy"},
            {"id": "3", "username": "kolasteu"},
            {"id": "4", "username": "aliyatt"},
        ]
    }
} 

Почистить доску:
Формат запроса:
{
    "type": "clear"
}

Формат ответа: такой же

Поменять карту:
Формат запроса:
{
    "type": "map",
    "meta": "Bayport"
}

Формат ответа:
{
    "type": "map",
    "meta": {
        "map": "Bayport",
        "game_objects": {}
    } 
}

Перейти на глобальную карту:
Формат запроса:
{
    "type": "global_map"
}

Формат ответа:
{
    "type": "global_map",
    "meta": {
        "map": "Global", (хардкодим на беке)
        "game_objects": {}
    } 
}

Сообщение в чат:
Формат запроса:
{
    "type": "chat",
    "meta": "MESSAGE"
} 

Формат ответа:
{
    "type": "chat":
    "meta": {
        "type": "message",
        "time": "2020-12-06T13:11:08Z",
        "message": "MESSAGE",
        "sender": "testuser"
    }
}

Бросок кубика(ов):
{
    "type": "roll",
    "meta": {
        "d6": 2,
        "d20": 1
    }
}

Формат ответа:
{
    "type": "chat",
    "meta": {
        "type": "roll",
        "time": "2020-12-06T13:11:08Z",
        "rolls": {
            "d6": [3, 6],
            "d20": [14]
        },
        "total": 24,
        "sender": "testuser"
    }
}

```
Рисование
```
type: draw_pencil_started
type: draw_pencil_moved
type: draw_pencil_stopped

type: draw_eraser_started
type: draw_eraser_moved
type: draw_eraser_stopped

type: draw_polygon_started
type: draw_polygon_middle
type: draw_polygon_stopped
type: draw_polygon_moved
```
список нотифаев от сервера:
```
Новый игрок подключился:
{
    "type": "connect",
    "meta": {
        "id": "1",
        "username": "zlodeyka"
    }
}

Игрок отключился:
{
    "type": "disconnect",
    "meta": "1"
}
```
