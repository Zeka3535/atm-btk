# Stitch: ATM BTK PWA Contest

**Проект:** https://stitch.withgoogle.com/projects/786355720389804835

## Что сделано

### Экраны заявки (вкладки)
- DetailServices — Сервисы  
- DetailHuawei — Huawei xPON  
- DetailHistory — История  
- DetailSecondary — Вторичка  
- DetailDslam — DSLAM  

### Модалки
- ModalReport, ModalContacts, ModalMaps, ModalWifi  

### Оболочка
- Login, Inbox, Closed, Settings  

Актуальные id: `design/stitch-nav-map.json` (берите экраны с суффиксом **Interactive**).

## Как переключаться в прототипе

1. Открой проект.  
2. В списке экранов выбирай **последние «… (Interactive)»** (их много черновиков — смотри дату/порядок или id из `stitch-nav-map.json`).  
3. Режим **Preview / Prototype** → клики:

| Действие | Переход |
|----------|---------|
| Войти | Inbox |
| ⚙ | Settings |
| Карточка заявки | DetailServices |
| Остров Inbox ↔ Closed | списки |
| Назад | Inbox |
| Вкладки Сервисы / Huawei / История / Вторичка | соответствующие экраны |
| Отчёт / телефон / карта / Wi‑Fi | модалки |
| Отмена / фон модалки | DetailServices |
| Послать отчёт | Inbox |

## Замечание

Stitch при каждом `edit` создаёт **новую** копию экрана. Связи прошивались пакетами; если какой-то клик ведёт «в никуда», открой экран из `stitch-nav-map.json` или напиши — подожму одну финальную связку.
