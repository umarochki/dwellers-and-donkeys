<h1 align="center">Dwellers & Donkeys</h1>

<div align="center">

Веб-приложения для игры в Dungeons & Dragons

![Preview](https://raw.githubusercontent.com/umarochki/dwellers-and-donkeys/main/.github/images/tabletop.png)

Так мы выглядим на больших экранах.

![Preview](https://raw.githubusercontent.com/umarochki/dwellers-and-donkeys/main/.github/images/tabletop-mini.png)

Так мы выглядим на экранах поменьше.

[Здесь должна быть мобильная версия]

</div>

### Краткое описание

Приложение предполагается использовать как инструмент в процессе игры в D&D. А точнее, он дает возможность проводить игру без использования других физических средств таких, как карта, кубики, бумага и т. д. и при этом позволять полноценно влиться в игру.


Вся информация об игре: местоположение персонажей, предметов, описание всех характеристик, история действий и бросков кубиков доступна через панель приложения на веб-странице или в мобильном приложении. Пользователю необходимо иметь представление лишь об основных правилах игры, чтобы начать пользоваться. Сам интерфейс приложения интуитивно понятен и требует минимальное время на знакомство.


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


### Файловая структура:
* nginx/tank - Frontend
* nginx/tank/game-module - Game Module (map for Frontend)
* rogue - Mobile App
* wzrd - Backend
