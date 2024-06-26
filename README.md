# Инструкция по установке и запуску проекта

- Фронтенд: https://github.com/RT-Vinsent/diplom_frontend
- Бекенд: [Текущий репозиторий](https://github.com/RT-Vinsent/diplom_backend)

- Тестовый сайт https://rtvini.ru
- Даныне для админки:
   - Логин: `roman@roman.com`
   - Пароль: `roman`

---

## Содержание
1. [Требования](#требования)
2. [Установка PostgreSQL](#установка-postgresql)
3. [Установка сервера](#установка-сервера)
4. [Установка фронтенда](#установка-фронтенда)
5. [Скрипты package.json](#скрипты-packagejson)
6. [Структура проекта](#структура-проекта)
7. [Техническое задание](#техническое-задание-по-дипломному-проекту)

---

## Рекомендуемые Требования
- Node.js версии 18.18.0 или выше
- npm версии 9.8.1 или выше
- PostgreSQL версии 16.x или выше

---

## Установка PostgreSQL и создание базы данных

1. Установите PostgreSQL:
    ```sh
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    ```

2. Перейдите под пользователя PostgreSQL:
    ```sh
    sudo -i -u postgres
    ```

3. Создайте пользователя и базу данных:
    ```sh
    psql -c "CREATE USER cinema WITH PASSWORD 'root';"
    psql -c "CREATE DATABASE cinema OWNER cinema;"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE cinema TO cinema;"
    ```

4. Выйдите из пользователя PostgreSQL:
    ```sh
    exit
    ```

Теперь база данных доступна по строке подключения `postgres://cinema:root@localhost:5432/cinema`.

---

## Установка сервера

1. Клонируйте репозиторий:
    ```sh
    git clone https://github.com/RT-Vinsent/diplom_backend.git
    cd diplom_backend
    ```

2. Создайте файл `.env` в корне проекта и добавьте следующие переменные окружения:
    ```env
    DATABASE_URL=postgres://<пользователь>:<пароль>@localhost:5432/<название_базы_данных>
    JWT_SECRET=<секретный_ключ>
    ```

3. Установите зависимости:
    ```sh
    npm install
    ```

4. Запустите миграции для создания и заполнения базы данных:
    ```sh
    npm run migrate
    ```

5. Запустите сервер:
    ```sh
    npm start
    ```

---

## Установка фронтенда

1. Клонируйте репозиторий:
    ```sh
    git clone https://github.com/RT-Vinsent/diplom_frontend.git
    cd diplom_frontend
    ```

2. Создайте файл `.env` в корне проекта и добавьте следующие переменные окружения:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

3. Установите зависимости:
    ```sh
    npm install
    ```

4. Запустите приложение:
    ```sh
    npm start
    ```

Теперь сервер будет доступен по адресу `http://localhost:5000`, а фронтенд - по адресу `http://localhost:3000`.

---

## Скрипты package.json

### Сервер
- `npm start`: Запуск сервера.
- `npm run dev`: Запуск сервера в режиме разработки.
- `npm run migrate`: Запуск тестовых миграций базы данных.
- `npm run migrate:up`: Обычный запуск миграций базы данных.
- `npm run migrate:down`: Обычный откат миграций базы данных.
- `npm run reset-db`: Сброс базы данных и удаление всех данных.

### Фронтенд
- `npm start`: Запуск приложения в режиме разработки.
- `npm run build`: Сборка проекта для продакшн.
- `npm test`: Запуск тестов.

---

## Структура проекта

<details>
  <summary>Сервер</summary>

```
PATH:.
│   .env
│   .gitignore
│   db.js
│   index.js
│   package-lock.json
│   package.json
│   pg-migrate.config.js
│   resetDb.js
│   runMigrations.js
│   
├───middleware
│       auth.js
│       
├───migrations
│       1717738472803_create-tables.js
│       1717738479853_populate-tables.js
│       
├───node_modules
│                   
└───routes
        auth.js
        halls.js
        movies.js
        seats.js
        session.js
```

</details>

<details>
  <summary>Фронтенд</summary>

```
PATH:.
│   .env
│   .gitignore
│   package-lock.json
│   package.json
│   README.md
│   tree_output.txt
│   tree_output2.txt
│   tsconfig.json
│               
├───node_modules
│           
├───public
│   │   favicon.ico
│   │   index.html
│   │   logo192.png
│   │   logo512.png
│   │   manifest.json
│   │   robots.txt
│   │   
│   └───i
│           background.jpg
│           background2.jpg
│           border-bottom.png
│           border-top.png
│           green-pattern.png
│           hint.png
│           poster1.jpg
│           poster2.jpg
│           poster3.jpg
│           qr-code.png
│           screen.png
│           switch.png
│           trash-sprite.png
│           
└───src
    │   App.css
    │   App.test.tsx
    │   App.tsx
    │   index.css
    │   index.tsx
    │   mockData.ts
    │   react-app-env.d.ts
    │   reportWebVitals.ts
    │   setupTests.ts
    │   
    ├───components
    │   ├───Admin
    │   │   │   ConfigureHalls.tsx
    │   │   │   ConfigurePrices.tsx
    │   │   │   ManageHalls.tsx
    │   │   │   OpenSales.tsx
    │   │   │   
    │   │   ├───ConfStepWrapper
    │   │   │       ConfStepWrapper.css
    │   │   │       ConfStepWrapper.tsx
    │   │   │       
    │   │   ├───HallSelector
    │   │   │       HallSelector.css
    │   │   │       HallSelector.tsx
    │   │   │       
    │   │   ├───MovieModal
    │   │   │       MovieModal.css
    │   │   │       MovieModal.tsx
    │   │   │       
    │   │   └───SessionGrid
    │   │       │   SessionGrid.css
    │   │       │   SessionGrid.tsx
    │   │       │   
    │   │       ├───MovieList
    │   │       │       MovieList.css
    │   │       │       MovieList.tsx
    │   │       │       
    │   │       └───SessionList
    │   │               Session.css
    │   │               Session.tsx
    │   │               SessionList.tsx
    │   │               
    │   ├───Button
    │   │       Button.css
    │   │       Button.tsx
    │   │       
    │   ├───Calendar
    │   │       Calendar.css
    │   │       Calendar.tsx
    │   │       
    │   ├───Footer
    │   │       Footer.css
    │   │       Footer.tsx
    │   │       
    │   ├───Header
    │   │       AdminHeader.tsx
    │   │       Header.css
    │   │       Header.tsx
    │   │       
    │   ├───Modal
    │   │       Modal.css
    │   │       Modal.tsx
    │   │       
    │   ├───Movie
    │   │       Movie.css
    │   │       Movie.tsx
    │   │       
    │   ├───MovieList
    │   │       MovieList.css
    │   │       MovieList.tsx
    │   │       
    │   ├───Nav
    │   │       Nav.css
    │   │       Nav.tsx
    │   │       
    │   ├───Placeholder
    │   │       Placeholder.css
    │   │       Placeholder.tsx
    │   │       
    │   └───ProtectedRoute
    │           ProtectedRoute.tsx
    │           
    ├───contexts
    │       AuthContext.tsx
    │       HallsContext.tsx
    │       
    ├───hooks
    │       useMovies.ts
    │       useSessionData.ts
    │       
    ├───module
    │       cookies.ts
    │       formatDate.ts
    │       formatSeats.ts
    │       
    ├───pages
    │   ├───Admin
    │   │       Admin.css
    │   │       Admin.tsx
    │   │       
    │   ├───HallPage
    │   │       HallPage.css
    │   │       HallPage.tsx
    │   │       
    │   ├───HomePage
    │   │       HomePage.css
    │   │       HomePage.tsx
    │   │       
    │   ├───Login
    │   │       Login.css
    │   │       Login.tsx
    │   │       
    │   ├───NotFoundPage
    │   │       NotFoundPage.css
    │   │       NotFoundPage.tsx
    │   │       
    │   ├───PaymentPage
    │   │       PaymentPage.css
    │   │       PaymentPage.tsx
    │   │       
    │   └───TicketPage
    │           TicketPage.css
    │           TicketPage.tsx
    │           
    └───style
            normalize.css
```

</details>

---

## Техническое задание по Дипломному проекту
<details>
  <summary>ТЗ</summary>

# Дипломный проект по профессии «Веб-разработчик»

Дипломный проект представляет собой создание сайта для бронирования онлайн билетов в кинотеатр и разработка информационной системы для администрирования залов, сеансов и предварительного бронирования билетов.

### Студенту даются компоненты системы
* [Вёрстка](https://github.com/netology-code/fs-2-diplom/blob/master/sources/layouts.zip).

## Задачи
* Разработать сайт бронирования билетов онлайн.
* Разработать административную часть сайта.

## Сущности

1. **Кинозал**. Помещение, в котором демонстрируются фильмы. Режим работы определяется расписанием на день. Зал — прямоугольное помещение, состоит из N х M различных зрительских мест.
2. **Зрительское место**. Место в кинозале. Есть два вида: VIP и обычное. 
3. **Фильм**. Информация о фильме заполняется администратором. Фильм связан с сеансом в кинозале.
4. **Сеанс**. Временной промежуток, во время которого в кинозале будет показываться фильм. На сеанс могут быть забронированы билеты.
5. **Билет**. QR-код c уникальным кодом бронирования, в котором обязательно указаны место, ряд, сеанс. Билет действителен строго на свой сеанс. Для генерации QR-кода можно использовать [сервис](http://phpqrcode.sourceforge.net/). 

## Роли пользователей системы
* Администратор — авторизованный пользователь.
* Гость — неавторизованный посетитель сайта.

### Возможности администратора
* Создание или редактирование залов.
* Создание или редактирование списка фильмов.
* Настройка цен.
* Создание или редактирование расписания сеансов фильмов.

### Возможности гостя
* Просмотр расписания.
* Просмотр списка фильмов.
* Выбор места в кинозале.
* Бронирование билета на конкретную дату.

## Важные моменты
* Должна присутствовать валидация входных данных на стороне сервера.
* Пароль должен храниться в захешированном виде и при аутентификации должна быть проверка хеша пользователя.

## Этапы разработки
1. Продумайте архитектуру будущего веб-приложения. Выберите вариант реализации: SPA+API, Laravel App или Base PHP.
Вы можете базироваться на основе фреймворков (Laravel, Yii2), использовать свободные библиотеки для сборки собственного приложения либо написать всё самостоятельно.
2. Проанализируйте задание, составьте план. Когда определитесь, что и как хотите делать, вы можете обсудить план с дипломным руководителем.
3. Разработайте административную и пользовательскую часть веб-приложения.

### Что в итоге должно получиться
В результате работы должен получиться git-репозиторий, содержащий в себе необходимые файлы проекта и файл ReadMe. В нём должна быть инструкция, как запустить ваш проект, технические особенности: версия php, процедура миграции базы данных и другое.

### Частые вопросы
> Что значит кнопка «Открыть продажу билетов»?

По умолчанию зал создаётся неактивным. После нажатия на эту кнопку зал становится доступным гостям. Надпись на кнопке меянется на «Приостановить продажу билетов».

> Должна ли быть регистрация из административной части сайта?

Регистрация из административной части сайта не является обязательной. Вы можете добавить эту функциональность по своему усмотрению или можете заносить в базу данных пользователей вручную при помощи миграций.

> Где брать модальные окна?

Файлы с припиской `_popup` — те самые модальные окна в папке «Вёрстка».

## Как задавать вопросы руководителю по дипломной работе

1. Если у вас возник вопрос, попробуйте сначала самостоятельно найти ответ в интернете. Навык поиска информации пригодится вам в любой профессиональной деятельности. Если ответ не нашёлся, можно уточнить у руководителя по дипломной работе.
2. Если у вас набирается несколько вопросов, присылайте их в виде нумерованного списка. Так дипломному руководителю будет проще отвечать на каждый из них.
3. Для лучшего понимания контекста прикрепите к вопросу скриншоты и стрелкой укажите, что именно вызывает вопрос. Программу для создания скриншотов можно скачать [по ссылке](https://app.prntscr.com/ru/).
4. По возможности задавайте вопросы в комментариях к коду.
5. Формулируйте свои вопросы чётко, дополняя их деталями. На сообщения «Ничего не работает», «Всё сломалось» дипломный руководитель не сможет дать комментарии без дополнительных уточнений. Это затянет процесс получения ответа. 
6. Постарайтесь набраться терпения в ожидании ответа на свои вопросы. Дипломные руководители Нетологии – практикующие разработчики, поэтому они не всегда могут отвечать моментально. Зато их практика даёт возможность делиться с вами не только теорией, но и ценным прикладным опытом.  

Рекомендации по работе над дипломом:

1. Не откладывайте надолго начало работы над дипломом. В таком случае у вас останется больше времени на получение рекомендаций от руководителя и доработку диплома.
2. Разбейте работу над дипломом на части и выполняйте их поочерёдно. Вы будете успевать учитывать комментарии от руководителя и не терять мотивацию на полпути. 

</details>
