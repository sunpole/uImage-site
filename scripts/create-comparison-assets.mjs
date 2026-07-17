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

for (const version of ["v0.2.28", "v0.2.29", "v0.2.30", "v0.2.31"]) {
  for (const [name, title] of comparisons) {
    const colorPath = join(publicDirectory, "screenshots", version, `${name}-vector.svg`);
    const outlinePath = join(publicDirectory, "screenshots", version, `${name}-outline.svg`);
    const source = await readFile(colorPath, "utf8");
    const publicSource = source
      .replace(/  <metadata>[\s\S]*?<\/metadata>/, `  <metadata>Static uImage ${version} comparison at the 160 px quality stage</metadata>`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title} at the 160 px quality stage</title>`);
    const fillsMatch = publicSource.match(/<g id="fills">([\s\S]*?)<\/g>/);
    if (!fillsMatch) throw new Error(`${colorPath}: fills layer not found.`);

    const whiteFills = fillsMatch[0].replaceAll(/ fill="#[0-9a-f]{6}"/gi, " fill=\"#fff\"");
    const outline = publicSource.replace(fillsMatch[0], whiteFills);

    await writeFile(colorPath, publicSource, "utf8");
    await writeFile(outlinePath, outline, "utf8");
    console.log(`Prepared ${colorPath} and ${outlinePath}`);
  }
}
