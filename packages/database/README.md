# Database Package

Shared Prisma schema and client for the monorepo.

## Usage

```typescript
import { prisma, PatternRecord } from '@repo/database';

const records = await prisma.patternRecord.findMany();
```

## Scripts

- `pnpm db:migrate` - Run migrations
- `pnpm db:seed` - Seed database
- `pnpm db:reset` - Reset database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:generate` - Generate Prisma Client

## Setup

1. Set `DATABASE_URL` in your `.env` file
2. Run `pnpm db:migrate` to create tables
3. Run `pnpm db:seed` to load seed data
