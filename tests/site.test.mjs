import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);

test("site offers a visible Russian and English switch", async () => {
  const html = await readFile(new URL("public/index.html", root), "utf8");
  assert.match(html, /data-language="ru"/);
  assert.match(html, /data-language="en"/);
});

test("site uses a natural Russian product headline", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("public/index.html", root), "utf8"),
    readFile(new URL("public/app.mjs", root), "utf8"),
  ]);
  assert.match(html, /Картины по номерам — проще и удобнее/);
  assert.match(app, /Картины по номерам — проще и удобнее/);
  assert.doesNotMatch(`${html}\n${app}`, /Делаем картины по номерам удобнее/);
});

test("public files do not reference the private engine repository", async () => {
  const files = ["public/index.html", "public/app.mjs", "public/styles.css"];
  for (const file of files) {
    const source = await readFile(new URL(file, root), "utf8");
    assert.doesNotMatch(source, /packages\/engine|uImage\/releases|private engine source/i);
  }
});

test("patch notes use short user-facing fields", async () => {
  const release = JSON.parse(await readFile(new URL("content/releases/v0.2.0.json", root), "utf8"));
  assert.ok(release.ru.changes.length <= 4);
  assert.ok(release.en.changes.length <= 4);
  assert.ok(release.ru.summary.length <= 180);
  assert.ok(release.en.summary.length <= 180);
});
