#!/bin/bash
set -e

echo "Showing PostgreSQL logs..."
docker-compose logs -f postgres
