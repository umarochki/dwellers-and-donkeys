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
POST /api/v1/auth/login [Войти] дет поля: username, password

GET/POST /api/v1/auth/logout [Выйти]

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
/ws/games/GAME_ID
```
