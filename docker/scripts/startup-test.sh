#!/usr/bin/env bash
set -e

echo "🧪 Starting test environment..."

# Run migrations
echo "📦 Running database migrations..."
npm run migration:run

# Optionally run seeds for test data
# npm run seed:run

# Start application in background
echo "🚀 Starting application..."
npm run start:prod > /tmp/app.log 2>&1 &

# Wait for app to be ready
/scripts/wait-for-it.sh localhost:3000 -t 60

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run E2E tests
echo "🧪 Running E2E tests..."
npm run test:e2e -- --runInBand

echo "✅ Tests completed!"
