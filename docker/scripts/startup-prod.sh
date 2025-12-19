#!/usr/bin/env bash
set -e

echo "Starting production environment..."

echo "Running database migrations..."
npm run migration:run:dist

# Uncomment if/when you want automatic seeding
# echo "Running database seeds..."
npm run seed:run

echo "Starting application..."
npm run start:prod