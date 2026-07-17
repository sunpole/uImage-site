import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const [version, suppliedDate] = process.argv.slice(2);
if (!/^v\d+\.\d+\.\d+$/.test(version ?? "")) {
  throw new Error("Usage: npm run new:patch -- v0.3.0 [YYYY-MM-DD]");
}

const date = suppliedDate ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Date must use YYYY-MM-DD.");

const root = fileURLToPath(new URL("..", import.meta.url));
const directory = join(root, "content", "releases");
const target = join(directory, `${version}.json`);
await mkdir(directory, { recursive: true });
try {
  await access(target);
  throw new Error(`${version} already exists.`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const template = {
  version,
  date,
  ru: {
    title: "Короткий заголовок",
    summary: "Одним предложением: что стало лучше для пользователя.",
    changes: ["Первое заметное изменение."],
    next: "Что планируем улучшить дальше."
  },
  en: {
    title: "Short title",
    summary: "One sentence explaining what improved for the user.",
    changes: ["First visible change."],
    next: "What we plan to improve next."
  },
  screenshots: [
    {
      src: `./screenshots/${version}/approved-image.svg`,
      alt: {
        ru: "Короткое описание утверждённого изображения",
        en: "Short description of the approved image"
      }
    }
  ]
};

await writeFile(target, `${JSON.stringify(template, null, 2)}\n`);
console.log(`Created ${target}`);
