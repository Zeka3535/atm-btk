# ATM БТК — Design System

Мобильное PWA для монтажников Белтелеком (конкурсный демо-прототип).

## Brand
- Product name: **ATM БТК**
- Company: Белтелеком
- Tone: спокойный, корпоративный, полевой инструмент — не consumer-fintech

## Colors
- Primary: `#663479`
- Accent: `#33CEE1`
- Background: `#F5F3F7`
- Surface / cards: `#FFFFFF`
- Text primary: `#1E1A34`
- Text muted: `#6B6580`
- Success / closed address: `#2E7D32`
- Badge «Новая»: `#1976D2`
- Badge «Отписано»: `#EF6C00`
- Danger / report accents: soft red only if needed

## Typography
- Font: Manrope (or system sans close to Manrope)
- Titles: bold, ~20–22px
- Body: 14–15px
- Captions: 12–13px

## Shape
- Cards: 16–20px radius
- Buttons: pill (full round) for primary CTA
- Bottom nav island: floating pill with round icon buttons
- Toolbar: purple full-bleed, soft bottom radius 16px

## Components
- Purple top toolbar (list titles or back + «Назад»)
- Task cards: address, date/period, FIO, damage, bold text, footer (map / phone / chips / report)
- Bottom island: Inbox + Closed (icons only, badge when inactive)
- Modals: full-screen dimmed backdrop, bottom sheet card
- Custom selects (not native OS dropdowns)
- Toasts: dark pill under toolbar

## Screens (same project, linked prototype)
1. Login → Tasks (Inbox)
2. Inbox ↔ Closed via bottom island
3. Inbox/Closed → Task Detail (tap card)
4. Inbox → Settings (gear)
5. Detail / Settings → back

## Rules
- Light theme only
- Russian UI labels
- No emoji icons — vector glyphs
- Portrait mobile 390×844
- Keep structure close to existing ATM БТК PWA; polish spacing, hierarchy, shadows, contrast
