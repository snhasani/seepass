# Step 2: Database Schema & Seeding

## Objective
Create Prisma schema for PatternRecord table and seed script that loads generated JSON into Postgres.

## Prisma Schema

Location: `packages/database/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model PatternRecord {
  id          String   @id @default(uuid())
  scenario    String
  entityType  String   @map("entity_type")
  entityKey   String   @map("entity_key")
  windowStart DateTime @map("window_start") @db.Date
  windowEnd   DateTime @map("window_end") @db.Date
  score       Float
  record      Json
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("pattern_records")
  @@index([entityType, windowEnd])
  @@index([scenario])
  @@index([entityKey])
  @@index([windowStart, windowEnd])
}
```

## Migration

```bash
pnpm db:migrate
# or
npx prisma migrate dev --name init_pattern_records
```

## Seed Script

Location: `packages/database/prisma/seed.ts`

```typescript
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
```

## Package Structure

Create `packages/database/` package:

```
packages/database/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    index.ts          # Export prisma client + types
  package.json
  tsconfig.json
```

## Package.json Scripts

Add to `packages/database/package.json`:

```json
{
  "scripts": {
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "npx prisma migrate reset",
    "db:studio": "npx prisma studio",
    "db:generate": "npx prisma generate"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Add to root `package.json`:

```json
{
  "scripts": {
    "db:migrate": "pnpm --filter @repo/database db:migrate",
    "db:seed": "pnpm --filter @repo/database db:seed",
    "db:reset": "pnpm --filter @repo/database db:reset",
    "db:studio": "pnpm --filter @repo/database db:studio"
  }
}
```

## Seeding Rules

1. **Do NOT transform record JSON** - LLM consumes it as-is
2. **Set createdAt = now()** on insert (handled by Prisma default)
3. **Use createMany** for bulk insert (faster than individual creates)
4. **Skip duplicates** if re-running seed (based on scenario+entityKey+windowStart)

## Validation After Seeding

```bash
# Count records
psql $DATABASE_URL -c "SELECT COUNT(*) FROM pattern_records;"

# Check score distribution
psql $DATABASE_URL -c "SELECT scenario, COUNT(*), AVG(score), MAX(score) FROM pattern_records GROUP BY scenario ORDER BY AVG(score) DESC;"

# Verify JSON structure
psql $DATABASE_URL -c "SELECT scenario, jsonb_typeof(record->'signals') FROM pattern_records LIMIT 5;"
```

## Test Script

Create `scripts/test-seed.sh`:

```bash
#!/bin/bash
set -e

echo "Generating patterns..."
pnpm gen:patterns

echo "Running migrations..."
pnpm db:migrate

echo "Seeding database..."
pnpm db:seed

echo "Validating seed..."
psql $DATABASE_URL <<EOF
SELECT 
  scenario,
  COUNT(*) as count,
  ROUND(AVG(score)::numeric, 2) as avg_score,
  ROUND(MAX(score)::numeric, 2) as max_score
FROM pattern_records
GROUP BY scenario
ORDER BY avg_score DESC;
EOF

echo "✓ Seed validation complete"
```

## Dependencies

- `@prisma/client` - Prisma client
- `prisma` - Prisma CLI
- `tsx` - TypeScript execution (for seed script)

## Notes

- PatternRecord table maps 1:1 to generated JSON structure
- `record` column stores full JSONB (LLM-ready)
- Indexes support common query patterns (priorities by date, timeline by entity)
- No Priority table needed (computed on read from PatternRecord)
- Prisma client exported from `@repo/database` package for reuse across apps
- Apps import: `import { prisma } from '@repo/database'`
