## Запуск
1) git clone https://github.com/MlronGaskov/shift-lab-task.git
2) cd ./shift-lab-task/shift-task
3) npm install
4) npm run dev
## Технологии
**react**<br>
**axios** для асинхронных запросов к бэкенду<br>
**react-query** для формирования POST запросов<br>
**react-router-dom** для маршрутизации (на будущее, когда будет больше страниц)
## Структура проекта
```
/shift-task
│
├── /src
│   ├── /app                         # логика приложения
|   │   ├── /api/requests.tsx        # функции взаимодействия с бэкендом
|   │   ├── /routes                  # маршруты
|   |   │   ├── /auth/login.tsx      # страница авторизации
|   |   │   └── /index.tsx           # настройка маршрутов приложения
|   │   └── /index.tsx               # точка входа для приложения
│   ├── /styles/auth/login.css       # стили страницы login
│   ├── /index.css                   # стили всего приложения
│   └── /main.tsx                    # запускает приложение
└── /index.html                      # основной HTML-файл
```