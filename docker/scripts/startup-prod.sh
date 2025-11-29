#!/usr/bin/env bash
set -e

echo "🚀 Starting production environment..."

# Run migrations
echo "📦 Running database migrations..."
npm run migration:run

# Run seeds
echo "🌱 Running database seeds..."
npm run seed:run

# Start application
echo "✅ Starting application..."
npm run start:prod
