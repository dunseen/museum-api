#!/usr/bin/env bash
# Remove Museum API Stack from Docker Swarm
# Usage: ./remove-stack.sh

set -e

STACK_NAME="museum"

echo "🗑️  Removing Museum Stack..."

# Check if stack exists
if ! docker stack ls | grep -q "$STACK_NAME"; then
    echo "⚠️  Stack '$STACK_NAME' not found."
    exit 0
fi

# Remove the stack
docker stack rm "$STACK_NAME"

echo ""
echo "⏳ Waiting for stack to be removed..."
sleep 10

echo "✅ Stack removed successfully!"

# Optional: Leave swarm if no other stacks
if [ $(docker stack ls --format "{{.Name}}" | wc -l) -eq 0 ]; then
    echo ""
    read -p "No other stacks found. Leave Docker Swarm? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker swarm leave --force
        echo "✅ Left Docker Swarm"
    fi
fi
