import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { generatePatternRecords } from "./generate";
import { validateAll } from "./validate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = join(__dirname, "..", "out", "pattern_records_seed.json");

function main() {
  console.log("Generating PatternRecords...");
  console.log(`Seed: ${process.env.SEED || "42"}`);

  const records = generatePatternRecords(new Date("2025-11-01"));

  console.log(`Generated ${records.length} records`);

  const validation = validateAll(records);
  if (!validation.valid) {
    console.error("Validation failed:");
    validation.errors.forEach(({ index, errors }) => {
      console.error(`  Record ${index}:`, errors);
    });
    process.exit(1);
  }

  console.log("✓ All records validated");

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(records, null, 2), "utf-8");

  console.log(`✓ Written to ${outputPath}`);

  const scenarios = new Set(records.map((r) => r.scenario));
  console.log(`\nScenarios generated: ${scenarios.size}`);
  scenarios.forEach((s) => {
    const count = records.filter((r) => r.scenario === s).length;
    console.log(`  ${s}: ${count} records`);
  });

  const topScore = records.reduce((max, r) => (r.score > max.score ? r : max), records[0]);
  console.log(`\nTop score: ${topScore.score} (${topScore.scenario} on ${topScore.entityKey})`);
}

main();
