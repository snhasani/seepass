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
