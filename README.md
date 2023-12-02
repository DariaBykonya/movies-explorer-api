# movies-explorer

### :clipboard: *Описание*
В репозитории представлена бэкенд часть для сервера по поиску фильмов.

### :gear: *Функционал*
API на стороне сервера работает на сервере Express.js. В приложении предусмотрена регистрация и вход в профиль пользователя. Пользователям предоставляется возможность сохранять фильмы в свой аккаунт и удалять их. Они также могут редактировать свой профиль. При перезагрузке страницы происходит автоматический вход пользователя.

### :computer: *Технологический стек*
- Backend: Express.js, MongoDB
- Authentication: JWT
- Deployment: Nginx on Yandex Cloud

### :arrow_forward: *Установка и запуск проекта*
1. Клонировать репозиторий:  `git clone https://github.com/DariaBykonya/movies-explorer-api.git`
2. Установить зависимости: `npm install`
3. Запустить сервер: `npm run start` / Запустить сервер с hot-reload: `npm run dev`
