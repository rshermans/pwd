import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const STATE_PATH = path.join(ROOT, "docs", "data", "state.json");
const SCHEMA_PATH = path.join(ROOT, "docs", "data", "state.schema.json");

function fail(message) {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function validateState(state) {
  assert(isPlainObject(state), "state must be an object");

  assert("tasks" in state, "missing required field: tasks");
  assert("kpis" in state, "missing required field: kpis");
  assert("evidence" in state, "missing required field: evidence");

  assert(isPlainObject(state.tasks), "tasks must be an object");
  for (const [key, value] of Object.entries(state.tasks)) {
    assert(typeof value === "boolean", `tasks.${key} must be boolean`);
  }

  assert(isPlainObject(state.kpis), "kpis must be an object");
  for (const [key, value] of Object.entries(state.kpis)) {
    assert(typeof value === "number" && Number.isFinite(value), `kpis.${key} must be a finite number`);
  }

  assert(Array.isArray(state.evidence), "evidence must be an array");
  for (const [idx, item] of state.evidence.entries()) {
    assert(isPlainObject(item), `evidence[${idx}] must be an object`);
    assert(typeof item.date === "string", `evidence[${idx}].date must be a string`);
    assert(/^\d{2}\/\d{2}(?:\/\d{4})?$/.test(item.date), `evidence[${idx}].date must match DD/MM or DD/MM/YYYY`);
    assert(typeof item.text === "string" && item.text.trim().length > 0, `evidence[${idx}].text must be a non-empty string`);
    const allowed = new Set(["date", "text"]);
    for (const key of Object.keys(item)) {
      assert(allowed.has(key), `evidence[${idx}] has unsupported key: ${key}`);
    }
  }

  for (const [key, value] of Object.entries(state)) {
    if (["tasks", "kpis", "evidence"].includes(key)) continue;
    if (/^open_[a-zA-Z0-9_-]+$/.test(key)) {
      assert(typeof value === "boolean", `${key} must be boolean`);
      continue;
    }
    fail(`unsupported top-level key: ${key}`);
  }
}

async function main() {
  // Keep schema file as explicit artifact for tooling and documentation.
  await fs.readFile(SCHEMA_PATH, "utf8");
  const rawState = await fs.readFile(STATE_PATH, "utf8");
  const state = JSON.parse(rawState);
  validateState(state);
  console.log("State validation passed.");
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
