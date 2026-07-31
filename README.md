# ATM БТК — PWA демо (конкурс)

Демонстрационный клиент выездных бригад: **только mock-данные**, без API Белтелеком.

## Локально

```bash
cd atm-pwa
npm install
npm run dev       # http://localhost:5173/#/login
npm run build
npm run preview   # проверка как в production
```

Логин: любой (например `demo`), пароль не проверяется.

## GitHub Pages

1. Залейте репозиторий на GitHub (корень монорепо `ATM` или только `atm-pwa`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Workflow: [`.github/workflows/deploy-pwa.yml`](../.github/workflows/deploy-pwa.yml).
4. Если site = `https://USER.github.io/REPO/`, задайте repository Variable `VITE_BASE` = `/REPO/` (со слэшами). Для `./` + HashRouter часто достаточно дефолта.
5. После push откройте URL Pages, например `https://USER.github.io/REPO/#/login`.

## Сценарий демо (паритет с ATM БТК)

1. Вход → «Войти» (любой логин).
2. Входящие: toolbar, фильтр извещений, бейджи Новая / Отчёт / Отписано / Отчёт послан.
3. Карточка: дата, период, ФИО, адрес, damage, tel-ссылки; карты (модалка Яндекс/Google); звонок / модалка контактов.
4. Отчёт: черновик, счётчик 506, зона аварии, «Послать» → snackbar «Отчёт послан»; на закрытой — нельзя.
5. Детали: Сервисы / носитель / История / Первичка / Вторичка; Wi‑Fi; график измерений.
6. Закрытые: `isClosed` или отчёт за сегодня.
7. Настройки: офлайн-баннер, уведомления (in-app + системные), звук/вибрация, выход.
8. Остров нижней навигации на всех экранах после входа (под модалками).

Stitch UI — следующий этап (`design/STITCH-PROMPTS.md`).

