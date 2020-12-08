# WZRD
### Гайд по подниманию с нуля:

#### 1) Запускаем все:
```docker-compose up --build -d```

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
```
Что-то про игры:
```
GET /api/v1/games [Список игр]
POST /api/v1/games [Создать игру] 
Ждет поля: name, description.. уточни у меня когда будешь делать
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
        "max_hp": 20,
        "current_hp": 20,
        "sprite": "ork.svg",
        "xy": [3, -5],
        ...
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
                "total": 24,
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
        "dice": {
            "d6": 2,
            "d20": 1
        },
        "total": 24,
        "sender": "testuser"
    }
}

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
