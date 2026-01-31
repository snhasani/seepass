# PatternRecord Data Generator

Generates deterministic fake aggregate PatternRecords for seeding the pattern engine database.

## Usage

```bash
pnpm gen:patterns
```

Outputs: `packages/data-gen/out/pattern_records_seed.json`

## Configuration

- `SEED` (env var): RNG seed for reproducibility (default: 42)

## Test

```bash
pnpm test
```

Validates the generated JSON file.
