# ATM БТК — PWA демо

Демонстрационный клиент выездных бригад: **только mock-данные**, без API Белтелеком.  
Визуал BTK + Stitch, логика из ATM.

**Pages:** https://zeka3535.github.io/atm-btk/#/login

## Локально

```bash
npm install
npm run dev       # http://localhost:5173/#/login
npm run build
npm run preview
```

Логин: любой (например `demo`), пароль не проверяется.

## GitHub Pages

После push в `main` / `design-system` workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) собирает и публикует сайт.

- Source: **GitHub Actions**
- Для project site обычно хватает `base: './'` + HashRouter
- При необходимости задайте Variable `VITE_BASE` = `/atm-btk/`

## Сценарий демо

1. Вход → любой логин.
2. Входящие / закрытые, карточки, отчёт, карты, контакты, Wi‑Fi.
3. Детали: сервисы, носитель, история, вторичка.
4. Настройки: офлайн, уведомления, выход.
