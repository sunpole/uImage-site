import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(html, /Делаем создание картин по номерам проще/);
  assert.match(app, /Делаем создание картин по номерам проще/);
  assert.doesNotMatch(`${html}\n${app}`, /удобнее/i);
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

test("new patch notes include an approved bilingual image", async () => {
  const release = JSON.parse(await readFile(new URL("content/releases/v0.2.26.json", root), "utf8"));
  assert.ok(release.comparisons.length >= 1);
  for (const comparison of release.comparisons) {
    assert.ok(comparison.raster.alt.ru);
    assert.ok(comparison.raster.alt.en);
    await access(new URL(`public/${comparison.raster.src.slice(2)}`, root));
    await access(new URL(`public/${comparison.vector.color.slice(2)}`, root));
    await access(new URL(`public/${comparison.vector.outline.slice(2)}`, root));
  }
});

test("latest patch provides two accessible raster-to-vector comparisons", async () => {
  const [release, app] = await Promise.all([
    readFile(new URL("content/releases/v0.2.26.json", root), "utf8").then(JSON.parse),
    readFile(new URL("public/app.mjs", root), "utf8"),
  ]);
  assert.equal(release.comparisons.length, 2);
  assert.deepEqual(release.replacesScreenshotsFor, ["v0.2.25"]);
  assert.match(app, /range\.type = "range"/);
  assert.match(app, /aria-pressed/);
  assert.match(app, /comparison\.vector\.outline/);
});

test("comparison notes stay honest about screen colors and real paints", async () => {
  const release = JSON.parse(await readFile(new URL("content/releases/v0.2.26.json", root), "utf8"));
  assert.match(release.ru.next, /реальн.*краск/i);
  assert.match(release.en.next, /real paints/i);
});
