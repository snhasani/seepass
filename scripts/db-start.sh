#!/bin/bash
set -e

echo "Starting PostgreSQL database..."
docker-compose up -d postgres

echo "Waiting for database to be ready..."
sleep 3

echo "✓ Database is running on localhost:5432"
echo "  DATABASE_URL=postgresql://seepass:seepass@localhost:5432/seepass?schema=public"
