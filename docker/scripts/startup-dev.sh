#!/usr/bin/env bash
set -e

echo "🔧 Starting development environment..."

# Run migrations
echo "📦 Running database migrations..."
npm run migration:run

# Run seeds
echo "🌱 Running database seeds..."
npm run seed:run

# Start application with hot reload
echo "✅ Starting application with hot reload..."
npm run start:dev
