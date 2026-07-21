# ZNAC Frontend

[English version](README.md)

React frontend для ZNAC, персонального сайта, который объединяет портфолио, блог, проекты, фотогалерею и административную панель.

Сайт: https://znac.org

## Связанные Репозитории

- Инфраструктура и деплой: https://github.com/AlinaZolotavina/znac-project
- Backend API: https://github.com/AlinaZolotavina/znac-api

## Ответственность

- Рендерить публичный сайт, блог, проекты и фотогалерею.
- Предоставлять authenticated administration screens.
- Взаимодействовать с Express API через централизованный request layer.
- Обрабатывать protected routes, формы, модальные окна, поиск, фильтры и upload UI.
- Обрабатывать contact form flow через shared API utilities.
- Запускать frontend CI и триггерить production-деплой после успешных проверок.

## Возможности

- Список постов блога, поиск, фильтрация по теме, страницы деталей, создание, редактирование и удаление.
- Список проектов, фильтрация, создание, редактирование и удаление.
- Фотогалерея с поиском, hashtags, load more, preview modal, upload и delete flows.
- Authentication, logout, profile, password recovery и protected routes.
- Contact form.
- Responsive layout.

## Архитектура

```text
React application
  |
  v
Feature modules
  |-- auth
  |-- blog
  |-- gallery
  |-- projects
  |-- profile
  |
  v
Shared layer
  |-- API clients
  |-- request helpers
  |-- validation helpers
  |-- reusable UI patterns
  |-- contact form API flow
  |
  v
Express API through /api
```

Production architecture:

```text
Browser
  |
  v
Nginx container from znac-project
  |-- serves React build
  |-- proxies /api/* to znac-api
```

## Структура Репозитория

```text
znac/
  .github/workflows/ci.yml
  public/
  src/
    app/
    features/
      auth/
      blog/
      gallery/
      profile/
      projects/
      contact/  # только тесты contact; реализация идет через shared/blog flow
    shared/
    test/
```

## Окружение

Локальные переменные окружения хранятся в `.env` files.

Важная переменная:

```text
REACT_APP_API_URL
```

Для production Docker builds `znac-project/nginx/Dockerfile` передает:

```text
REACT_APP_API_URL=/api
```

## Разработка

Установить зависимости:

```bash
npm install
```

Запустить local development server:

```bash
npm start
```

Собрать production bundle:

```bash
npm run build
```

## Тестирование

Запустить тесты:

```bash
npm test
```

Запустить тесты один раз в CI-style режиме:

```bash
npm test -- --watchAll=false
```

## Docker

У frontend нет отдельного standalone production Dockerfile.

В production React build создается внутри `znac-project/nginx/Dockerfile`, затем раздается через Nginx.

Запустить полный production-like stack из `znac-project`:

```bash
docker compose up -d --build
```

## CI/CD

GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

На push или pull request в `main` CI выполняет:

```text
npm ci
npm test -- --watchAll=false
npm run build
```

После успешного push в `main` workflow триггерит production-деплой в `znac-project`.

Deploy flow:

```text
Push to znac/main
  |
  v
Frontend CI
  |
  v
Trigger znac-project Deploy
  |
  v
AWS Lightsail docker compose up -d --build
```

GitHub secret, необходимый в этом репозитории:

```text
ZNAC_PROJECT_DEPLOY_TOKEN
```

## Дизайн

- Custom UI/UX design.
- Responsive layouts.
- Reusable modal system.
- Consistent visual identity across public and admin screens.

Design references:

- Photo Gallery: https://www.figma.com/design/9Ope6gJMSxNlTgW2xmiadI/ZNAC-Photo-Gallery?node-id=0-1&t=LaVz5AllRF0P5ARz-1
- Blog and Portfolio: https://www.figma.com/design/nr7iR1eT478g28M8Mrc6BX/BLOG?node-id=0-1&t=F0lEJgBEDi8ssd8K-1

## Будущие Улучшения

- Миграция на TypeScript.
- Миграция с Create React App на Vite.
- Улучшение accessibility.
- Оптимизация performance.
- Расширение component и integration test coverage.
