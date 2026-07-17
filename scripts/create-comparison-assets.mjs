import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDirectory = join(root, "public");

const comparisons = [
  ["yacht", "Yacht vector outline with numbers"],
  ["mountain", "Mountain vector outline with numbers"],
];

for (const [name, title] of comparisons) {
  const sourcePath = join(publicDirectory, "screenshots", "v0.2.20", `${name}-vector.svg`);
  const outputPath = join(publicDirectory, "screenshots", "v0.2.26", `${name}-outline.svg`);
  const source = await readFile(sourcePath, "utf8");
  const fillsMatch = source.match(/<g id="fills">([\s\S]*?)<\/g>/);
  if (!fillsMatch) throw new Error(`${sourcePath}: fills layer not found.`);

  const whiteFills = fillsMatch[0].replaceAll(/ fill="#[0-9a-f]{6}"/gi, " fill=\"#fff\"");
  const outline = source
    .replace("<title>uImage paint-by-numbers prototype</title>", `<title>${title}</title>`)
    .replace(fillsMatch[0], whiteFills);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, outline, "utf8");
  console.log(`Created ${outputPath}`);
}
