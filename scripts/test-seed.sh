#!/bin/bash
set -e

echo "Generating patterns..."
pnpm gen:patterns

echo "Running migrations..."
pnpm db:migrate

echo "Seeding database..."
pnpm db:seed

echo "Validating seed..."
if [ -z "$DATABASE_URL" ]; then
  echo "⚠ DATABASE_URL not set, skipping SQL validation"
else
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
fi

echo "✓ Seed validation complete"
