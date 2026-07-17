# uImage public site

[Русский](#русский) · [English](#english)

[![Открыть сайт uImage](https://img.shields.io/badge/Website-Open_uImage-ff765d?style=for-the-badge&logo=githubpages&logoColor=white)](https://sunpole.github.io/uImage-site/?lang=ru)
[![Репозиторий сайта](https://img.shields.io/badge/GitHub-uImage--site-24292f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sunpole/uImage-site)

## Русский

Публичный сайт и короткие пользовательские патчноуты uImage. Закрытый движок, исследования красок и внутренняя документация в этот репозиторий не переносятся.

Для локальной проверки нужен Node.js 22.x. На Mac и Windows используются одинаковые команды:

```bash
node --version
npm run check
npm run preview
```

Техническая заметка: локальный сервер нормализует путь к `dist`, чтобы одинаково работать с разделителями путей Windows и macOS/Linux.

### Добавить патчноут

```bash
npm run new:patch -- v0.3.0 2026-08-01
```

Команда создаст `content/releases/v0.3.0.json`. Заполните короткий заголовок, описание, до четырёх изменений и следующий шаг на русском и английском.

Для каждого нового патчноута начиная с v0.2.28 добавьте ровно два сравнения со шторкой в `comparisons`: яхту и горы. Каждое сравнение содержит разрешённый растр, текущий цветной вектор и чёрно-белый вариант с контурами и номерами. Отдельные `screenshots` правило не выполняют. Новые файлы хранятся в `public/screenshots/vX.Y.Z/`, снабжаются двуязычными описаниями и проверяются командой `npm run check`. После этого:

```bash
npm run check
git add .
git commit -m "Publish v0.3.0 patch notes"
git push origin main
```

GitHub Pages обновится автоматически. Патчноут не должен содержать внутренний код, закрытые ссылки, секреты, точные коммерческие расчёты или неподтверждённые обещания.

## English

Public uImage website and short user-facing patch notes. The private engine, paint research, and internal documentation do not belong in this repository.

Local checks require Node.js 22.x. macOS and Windows use the same commands:

```bash
node --version
npm run check
npm run preview
```

Technical note: the local server normalizes the `dist` path so Windows and macOS/Linux path separators are handled consistently.

### Add a patch note

```bash
npm run new:patch -- v0.3.0 2026-08-01
```

Edit the generated `content/releases/v0.3.0.json`: use a short title, a plain summary, up to four changes, and one next step in both languages.

For every new patch note from v0.2.28 onward, add exactly two curtain comparisons under `comparisons`: yacht and mountain. Each comparison contains the approved raster, the current color vector, and a black-and-white outline-and-number mode. Standalone `screenshots` do not satisfy the rule. Store new files in `public/screenshots/vX.Y.Z/`, add bilingual alt text, and validate them with `npm run check`. Then run:

```bash
npm run check
git add .
git commit -m "Publish v0.3.0 patch notes"
git push origin main
```

GitHub Pages updates automatically. Never publish private code, private links, secrets, exact commercial calculations, or unverified promises here.

## Publishing the repository

The one-time publishing command is documented in [`scripts/publish_repo.sh`](scripts/publish_repo.sh).
