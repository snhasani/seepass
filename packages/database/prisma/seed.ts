import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedPath = path.resolve(
    __dirname,
    '../../data-gen/out/pattern_records_seed.json'
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
