#!/usr/bin/env bash
# Update Museum API service in the stack
# Usage: ./update-stack.sh [service-name]
# Example: ./update-stack.sh api

set -e

STACK_NAME="museum"
SERVICE_NAME="${1:-api}"
FULL_SERVICE_NAME="${STACK_NAME}_${SERVICE_NAME}"

echo "🔄 Updating service: $FULL_SERVICE_NAME"

# Check if service exists
if ! docker service ls | grep -q "$FULL_SERVICE_NAME"; then
    echo "❌ Service '$FULL_SERVICE_NAME' not found."
    echo "Available services:"
    docker stack services "$STACK_NAME"
    exit 1
fi

# Update the service (force pull new image)
docker service update --image davys/museum-api:latest --force "$FULL_SERVICE_NAME"

echo ""
echo "✅ Service update initiated!"
echo ""
echo "📊 Service status:"
docker service ps "$FULL_SERVICE_NAME" --no-trunc

echo ""
echo "💡 Follow logs with: docker service logs ${FULL_SERVICE_NAME} -f"
