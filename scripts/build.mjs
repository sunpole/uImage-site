import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const contentDirectory = join(root, "content", "releases");
const outputDirectory = join(root, "dist");
const files = (await readdir(contentDirectory)).filter(file => file.endsWith(".json"));
const releases = await Promise.all(files.map(async file => JSON.parse(await readFile(join(contentDirectory, file), "utf8"))));

releases.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(join(root, "public"), outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, "releases.json"), `${JSON.stringify({ releases }, null, 2)}\n`);
await writeFile(join(outputDirectory, ".nojekyll"), "");
await cp(join(outputDirectory, "index.html"), join(outputDirectory, "404.html"));

console.log(`Built public site with ${releases.length} patch note(s).`);
