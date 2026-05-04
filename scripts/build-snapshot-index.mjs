import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SNAPSHOT_DIR = path.join(ROOT, "docs", "data", "snapshots");
const OUT_FILE = path.join(SNAPSHOT_DIR, "index.json");

function toUtcIso(dateLike) {
  return new Date(dateLike).toISOString();
}

async function main() {
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
  const files = await fs.readdir(SNAPSHOT_DIR);

  const snapshots = files
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort()
    .map((name) => {
      const date = name.replace(".json", "");
      return {
        date,
        file: name,
        createdAt: toUtcIso(`${date}T00:00:00.000Z`)
      };
    });

  await fs.writeFile(OUT_FILE, `${JSON.stringify({ snapshots }, null, 2)}\n`, "utf8");
  console.log(`Snapshot index updated with ${snapshots.length} entries.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
