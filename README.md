# 2048 — веб-игра с регистрацией и профилем

Добро пожаловать в **2048** — классическую головоломку, реализованную как современное SPA.  
Проект написан на **React + TypeScript** с использованием **Vite**, стилизации через **TailwindCSS + shadcn ui**, валидации форм через **react-hook-form + zod**, и управлением состоянием через **Redux Toolkit**.

---

## ✨ Функционал

- 🔑 **Регистрация и авторизация** (валидация на live input, blur, submit)
- 👤 **Профиль** с возможностью изменять данные о себе  
- 🏠 **Главная страница**  
- 🎮 **Игра 2048**
- 🏆 **Лидерборд** с лучшими игроками  
- 💬 **Форум** с темами и комментариями  

---

## 🛠️ Технологии

- **React 18 + TypeScript**
- **Vite** — быстрая сборка и dev-сервер
- **Redux Toolkit** — глобальное состояние
- **react-hook-form + zod** — формы и строгая валидация
- **TailwindCSS + shadcn ui** — стилизация и UI-компоненты
- **Jest + Testing Library** — тестирование
- **ESLint + Prettier** — кодстайл

---

## 📂 Структура

```bash
packages/client
├── public              # статические ресурсы
├── src
│   ├── api             # запросы к API
│   ├── assets          # картинки, иконки
│   ├── components      # переиспользуемые компоненты (UI)
│   ├── constants       # константы проекта
│   ├── hooks           # кастомные хуки
│   ├── layouts         # общие шаблоны страниц
│   ├── lib             # утилиты/хелперы
│   ├── pages           # страницы (SignIn, SignUp, Game, Leaderboard, Forum…)
│   ├── store           # Redux store, slices
│   ├── types           # общие TS-типы
│   └── utils           # функции
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── components.json
├── index.html
├── jest.config.js
├── nginx.conf
└── package.json
```

---

## 🚀 Запуск

### Требования
- Node.js **>=18**
- npm / yarn / pnpm

### Установка
```bash
cd packages/client
npm install
```

### Запуск dev-сервера
```bash
npm run dev
```

### Сборка
```bash
npm run build
```

### Предпросмотр production-сборки
```bash
npm run preview
```

### Тесты
```bash
npm run test
```

---

## 🌐 Основные роуты

- `/` — главная
- `/sign-in` — авторизация
- `/sign-up` — регистрация
- `/profile` — профиль
- `/game` — сама игра 2048
- `/leaderboard` — таблица лидеров
- `/forum` — список тем
- `/forum/:id` — топик