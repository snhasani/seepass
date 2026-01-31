import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedPath = path.join(
    process.cwd(),
    'packages/data-gen/out/pattern_records_seed.json'
  );

  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found: ${seedPath}. Run pnpm gen:patterns first.`);
  }

  const records = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  console.log(`Seeding ${records.length} PatternRecords...`);

  const data = records.map((r: any) => ({
    scenario: r.scenario,
    entityType: r.entityType,
    entityKey: r.entityKey,
    windowStart: new Date(r.windowStart),
    windowEnd: new Date(r.windowEnd),
    score: r.score,
    record: r.record,
  }));

  await prisma.patternRecord.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`✓ Seeded ${records.length} records`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
