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

### Добавить патчноут

```bash
npm run new:patch -- v0.3.0 2026-08-01
```

Команда создаст `content/releases/v0.3.0.json`. Заполните короткий заголовок, описание, до четырёх изменений и следующий шаг на русском и английском.

Для каждого нового патчноута добавьте утверждённый визуальный материал. Обычное изображение указывается в `screenshots`; статическое сравнение разрешённых входов и результатов — в `comparisons`. Новые файлы хранятся в `public/screenshots/v0.3.0/`, снабжаются двуязычными описаниями и проверяются командой `npm run check`. После этого:

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

### Add a patch note

```bash
npm run new:patch -- v0.3.0 2026-08-01
```

Edit the generated `content/releases/v0.3.0.json`: use a short title, a plain summary, up to four changes, and one next step in both languages.

For every new patch note, add approved visual media. Use `screenshots` for a regular image or `comparisons` for a static comparison of approved inputs and outputs. Store new files in `public/screenshots/v0.3.0/`, add bilingual alt text, and validate them with `npm run check`. Then run:

```bash
npm run check
git add .
git commit -m "Publish v0.3.0 patch notes"
git push origin main
```

GitHub Pages updates automatically. Never publish private code, private links, secrets, exact commercial calculations, or unverified promises here.

## Publishing the repository

The one-time publishing command is documented in [`scripts/publish_repo.sh`](scripts/publish_repo.sh).
