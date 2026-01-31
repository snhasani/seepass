# Step 3: Next.js API Routes

## Objective
Implement Next.js API routes to serve PatternRecords with filtering, sorting, and optional LLM explanation.

## Location
`apps/web/app/api/`

## Routes

### 1. GET /api/priorities

List PatternRecords sorted by score (descending). Computes priorities on-the-fly from PatternRecord table.

**Query Parameters:**
- `from` (required): `YYYY-MM-DD` - filter by windowEnd >= from
- `to` (required): `YYYY-MM-DD` - filter by windowEnd <= to
- `entityType` (required): `"surface"` (for now)
- `scenario` (optional): filter by scenario name
- `entityKey` (optional): filter by surface route

**Response:**
```typescript
{
  data: PatternRecord[];
  meta: {
    count: number;
    from: string;
    to: string;
    entityType: string;
  };
}
```

**Implementation:**
```typescript
// apps/web/app/api/priorities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const entityType = searchParams.get('entityType');
  const scenario = searchParams.get('scenario');
  const entityKey = searchParams.get('entityKey');

  if (!from || !to || !entityType) {
    return NextResponse.json(
      { error: 'Missing required params: from, to, entityType' },
      { status: 400 }
    );
  }

  const where: any = {
    entityType,
    windowEnd: {
      gte: new Date(from),
      lte: new Date(to),
    },
  };

  if (scenario) where.scenario = scenario;
  if (entityKey) where.entityKey = entityKey;

  const records = await prisma.patternRecord.findMany({
    where,
    orderBy: { score: 'desc' },
  });

  return NextResponse.json({
    data: records,
    meta: {
      count: records.length,
      from,
      to,
      entityType,
    },
  });
}
```

---

### 2. GET /api/pattern-records/:id

Fetch single PatternRecord by ID.

**Response:**
```typescript
PatternRecord | { error: string }
```

**Implementation:**
```typescript
// apps/web/app/api/pattern-records/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const record = await prisma.patternRecord.findUnique({
    where: { id: params.id },
  });

  if (!record) {
    return NextResponse.json(
      { error: 'PatternRecord not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(record);
}
```

---

### 3. GET /api/pattern-records?entityKey=...

Timeline view: all records for a specific entityKey, sorted by windowStart.

**Query Parameters:**
- `entityKey` (required): surface route like `/checkout`

**Response:**
```typescript
{
  data: PatternRecord[];
  meta: {
    entityKey: string;
    count: number;
  };
}
```

**Implementation:**
```typescript
// apps/web/app/api/pattern-records/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const entityKey = searchParams.get('entityKey');

  if (!entityKey) {
    return NextResponse.json(
      { error: 'Missing required param: entityKey' },
      { status: 400 }
    );
  }

  const records = await prisma.patternRecord.findMany({
    where: { entityKey },
    orderBy: { windowStart: 'asc' },
  });

  return NextResponse.json({
    data: records,
    meta: {
      entityKey,
      count: records.length,
    },
  });
}
```

---

### 4. POST /api/explain (Optional)

LLM endpoint that explains a PatternRecord.

**Request Body:**
```typescript
{
  patternRecordId: string;
}
```

**Response:**
```typescript
{
  summary: string;
  causes: string[];
  actions: string[];
  validate: string[];
  confidence: number; // 0-1
}
```

**Implementation:**
```typescript
// apps/web/app/api/explain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { patternRecordId } = await request.json();

  if (!patternRecordId) {
    return NextResponse.json(
      { error: 'Missing patternRecordId' },
      { status: 400 }
    );
  }

  const record = await prisma.patternRecord.findUnique({
    where: { id: patternRecordId },
  });

  if (!record) {
    return NextResponse.json(
      { error: 'PatternRecord not found' },
      { status: 404 }
    );
  }

  // LLM call (implement with OpenAI/Anthropic/etc)
  const explanation = await explainPatternRecord(record.record);

  return NextResponse.json(explanation);
}

async function explainPatternRecord(record: any) {
  // TODO: Implement LLM call
  // Use record.signals, record.top_error_signatures, record.hypotheses_hints
  return {
    summary: 'Placeholder',
    causes: [],
    actions: [],
    validate: [],
    confidence: 0.5,
  };
}
```

---

## Prisma Client Setup

Create `apps/web/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Test Scripts (curl)

Create `scripts/test-api.sh`:

```bash
#!/bin/bash
set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "Testing /api/priorities..."
curl -s "$BASE_URL/api/priorities?from=2026-01-20&to=2026-01-31&entityType=surface" | jq '.meta, .data[0] | {scenario, entityKey, score}'

echo -e "\nTesting /api/priorities with filters..."
curl -s "$BASE_URL/api/priorities?from=2026-01-20&to=2026-01-31&entityType=surface&scenario=checkout_payment_timeout" | jq '.meta, .data | length'

echo -e "\nTesting /api/pattern-records (timeline)..."
ID=$(curl -s "$BASE_URL/api/priorities?from=2026-01-20&to=2026-01-31&entityType=surface" | jq -r '.data[0].id')
curl -s "$BASE_URL/api/pattern-records/$ID" | jq '{scenario, entityKey, score, signals: .record.signals}'

echo -e "\nTesting /api/pattern-records?entityKey=/checkout..."
curl -s "$BASE_URL/api/pattern-records?entityKey=/checkout" | jq '.meta, .data | length'

echo -e "\n✓ API tests complete"
```

---

## Error Handling

All routes should:
- Return 400 for missing/invalid params
- Return 404 for not found
- Return 500 with error message for server errors
- Log errors server-side

---

## Demo Flow

1. `GET /api/priorities?from=2026-01-20&to=2026-01-31&entityType=surface`
   - Returns top priority: `checkout_payment_timeout` on `/checkout`
2. `GET /api/pattern-records/{id}` (from step 1)
   - Returns full record with signals, signatures, topics, release correlation
3. `POST /api/explain` (optional)
   - Returns LLM-generated explanation

---

## Notes

- Priority table skipped (computed on read)
- All filtering/sorting done in Prisma queries
- JSONB `record` column returned as-is (no transformation)
- Indexes support efficient queries by date range and entity
