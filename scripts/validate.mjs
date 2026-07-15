import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const contentDirectory = join(root, "content", "releases");
const publicDirectory = join(root, "public");
const files = (await readdir(contentDirectory)).filter(file => file.endsWith(".json"));

if (!files.length) throw new Error("At least one patch note is required.");

const versions = new Set();
for (const file of files) {
  const release = JSON.parse(await readFile(join(contentDirectory, file), "utf8"));
  if (!/^v\d+\.\d+\.\d+$/.test(release.version)) throw new Error(`${file}: invalid version.`);
  if (file !== `${release.version}.json`) throw new Error(`${file}: filename must match version.`);
  if (versions.has(release.version)) throw new Error(`${file}: duplicate version.`);
  versions.add(release.version);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(release.date)) throw new Error(`${file}: invalid date.`);

  for (const language of ["ru", "en"]) {
    const content = release[language];
    if (!content) throw new Error(`${file}: missing ${language}.`);
    if (!content.title || content.title.length > 80) throw new Error(`${file}: ${language} title must be 1–80 characters.`);
    if (!content.summary || content.summary.length > 180) throw new Error(`${file}: ${language} summary must be 1–180 characters.`);
    if (!Array.isArray(content.changes) || content.changes.length < 1 || content.changes.length > 4) {
      throw new Error(`${file}: ${language} must contain 1–4 changes.`);
    }
    if (content.changes.some(item => !item || item.length > 160)) throw new Error(`${file}: ${language} changes must be 1–160 characters.`);
    if (!content.next || content.next.length > 160) throw new Error(`${file}: ${language} next step must be 1–160 characters.`);
  }

  if (!Array.isArray(release.screenshots)) throw new Error(`${file}: screenshots must be an array.`);
  for (const screenshot of release.screenshots) {
    if (!screenshot.src?.startsWith("./screenshots/")) throw new Error(`${file}: screenshot must use ./screenshots/.`);
    if (!screenshot.alt?.ru || !screenshot.alt?.en) throw new Error(`${file}: screenshot alt text is required in both languages.`);
    await access(join(publicDirectory, screenshot.src.slice(2)));
  }
}

console.log(`Validated ${files.length} public patch note(s).`);
