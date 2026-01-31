#!/bin/bash
set -e

echo "Stopping PostgreSQL database..."
docker-compose down

echo "✓ Database stopped"
