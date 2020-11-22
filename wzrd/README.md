# WZRD
### Гайд по подниманию с нуля:

#### 1) Запускаем все:
```docker-compose up --build -d```

#### 2) Залетаем в контейнер wzrd
```docker exec -it wzrd bash```

#### 3) Делаем миграции
```./manage.py migrate```

#### 4) Создаем себе юзера напотестить
```./manage.py createsuperuser```, дальше по инструкции, регистрацию завезу попоже.

### API
Авторизация:
```
GET /api/v1/auth/login тут пока дурацкий шаблон, потом на твое переделаем
POST /api/v1/auth/login - ждет поля: username, password
```
Что-то про игры:
```
GET /api/v1/games - список игр
POST /api/v1/games - ждет поля: name, description.. уточни у меня когда будешь делать
```
Вебсокетная сессия:
```
/ws/games/GAME_ID
```
