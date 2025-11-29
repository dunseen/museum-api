#!/usr/bin/env bash
# Deploy Museum API Stack to Docker Swarm
# Usage: ./deploy-stack.sh

set -e

STACK_NAME="museum"
COMPOSE_FILE="docker/compose/docker-stack.prod.yml"

echo "🚀 Deploying Museum Stack..."

# Check if swarm is initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "⚠️  Docker Swarm is not initialized."
    echo "Initializing Docker Swarm..."
    docker swarm init
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with required environment variables."
    exit 1
fi

# Export all environment variables from .env file
echo "📦 Loading environment variables..."
export $(grep -v '^#' .env | xargs)

# Deploy the stack
echo "🚀 Deploying stack: $STACK_NAME"
docker stack deploy -c "$COMPOSE_FILE" "$STACK_NAME"

echo ""
echo "✅ Stack deployed successfully!"
echo ""
echo "📊 Stack services:"
docker stack services "$STACK_NAME"

echo ""
echo "💡 Useful commands:"
echo "  - View services:    docker stack services $STACK_NAME"
echo "  - View tasks:       docker stack ps $STACK_NAME"
echo "  - View logs:        docker service logs ${STACK_NAME}_api -f"
echo "  - Remove stack:     docker stack rm $STACK_NAME"
