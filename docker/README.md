# Docker Setup Documentation

## 📁 Structure

```
docker/
├── compose/
│   ├── docker-compose.dev.yml   # Local development
│   ├── docker-compose.prod.yml  # Production deployment
│   └── docker-compose.test.yml  # E2E/Integration tests
├── dockerfiles/
│   ├── Dockerfile.dev           # Development image
│   ├── Dockerfile.prod          # Production image (multi-stage)
│   └── Dockerfile.test          # Test image
└── scripts/
    ├── startup-dev.sh           # Development startup
    ├── startup-prod.sh          # Production startup
    ├── startup-test.sh          # Test startup
    └── wait-for-it.sh           # Service dependency waiter
```

## 🚀 Quick Start

### Local Development

Start all services for development:

```bash
npm run docker:dev
```

Or manually:

```bash
docker compose -f docker/compose/docker-compose.dev.yml up
```

Features:

- ✅ Hot reload enabled (source code mounted as volume)
- ✅ PostgreSQL with PostGIS
- ✅ Redis for caching
- ✅ MinIO for file storage
- ✅ Maildev for email testing
- ✅ Adminer for database management

- ✅ Aut<http://localhost:3000>ing on startup
  <http://localhost:8080>
  Access:<http://localhost:1080>
  <http://localhost:9001>
- API: <http://localhost:3000>
- Adminer (DB UI): <http://localhost:8080>
- Maildev: <http://localhost:1080>
- MinIO Console: <http://localhost:9001>

### Production

#### Option 1: Docker Compose (Single Server)

Build and run production containers:

```bash
npm run docker:prod
```

Or manually:

```bash
docker compose -f docker/compose/docker-compose.prod.yml up -d
```

#### Option 2: Docker Stack (Swarm Mode - Recommended for VPS)

Deploy to Docker Swarm for better orchestration:

```bash
# Initialize swarm (first time only)
docker swarm init

# Deploy the stack
npm run docker:stack:deploy

# Update API service
npm run docker:stack:update

# Remove the stack
npm run docker:stack:remove
```

Or manually:

```bash
docker stack deploy -c docker/compose/docker-stack.prod.yml museum
```

Features (Stack):

- ✅ Multi-stage optimized builds
- ✅ Nginx Proxy Manager for reverse proxy

- ✅ Production-ready PostgreSQL (Kartoza PostGIS)
- ✅ Healthchecks for all services
- ✅ Named volumes for data persistence

### Running Tests

Run E2E tests in isolated containers:

```bash
npm run docker:test

```

Or manually:

```bash
docker compose -f docker/compose/docker-compose.test.yml up --abort-on-container-exit
```

Features:

- ✅ Isolated test database (tmpfs for speed)
- ✅ All dependencies included
- ✅ Automatic cleanup after tests
- ✅ Runs linting + E2E tests

## 🛠️ Individual Commands

### Development

```bash
# Start all services
npm run docker:dev

# Stop all services
npm run docker:dev:down

# View logs
docker compose -f docker/compose/docker-compose.dev.yml logs -f api

# Rebuild API container
docker compose -f docker/compose/docker-compose.dev.yml up --build api
```

### Production

```bash
# Build production image locally
npm run docker:build

# Push to registry
docker push davys/museum-api:latest

# Deploy
npm run docker:prod

# Stop and remove volumes
npm run docker:prod:down
```

### Testing

```bash
# Run full test suite
npm run docker:test


# Run tests and keep containers for debugging
docker compose -f docker/compose/docker-compose.test.yml up

# Cleanup test containers
docker compose -f docker/compose/docker-compose.test.yml down -v
```

## 📦 Services Overview

### PostgreSQL

- **Dev**: `postgis/postgis:15-3.3-alpine`
- **Prod**: `kartoza/postgis:16-3.4--v2023.11.04` (ARM64 compatible)
- Automatic healthchecks
- Named volumes for persistence

### Redis

- **Image**: `redis:7-alpine`
- Used for session storage and caching
- Healthchecks enabled

### MinIO

- **Image**: `minio/minio:latest`
- S3-compatible object storage
- Web console on port 9001

- Bucket auto-creation handled by app

### Maildev

- **Image**: `maildev/maildev:2.1.0`
- Email testing in development
- Web interface on port 1080

### Adminer (Dev only)

- **Image**: `adminer:4.8.1`
- Database management UI
- Port 8080

### Nginx Proxy Manager (Prod only)

- **Image**: `jc21/nginx-proxy-manager:latest`
- Reverse proxy with Let's Encrypt
- Admin panel on port 81

## 🔧 Environment Variables

Required in `.env` file:

```bash
# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=secret
DATABASE_NAME=museum

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# MinIO
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_WEB_PORT=9001

MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_BUCKET=museum

# Mail
MAIL_HOST=maildev
MAIL_PORT=1025
MAIL_CLIENT_PORT=1080


# App
APP_PORT=3000
```

## 🐛 Troubleshooting

### Containers won't start

```bash
# Check logs

docker compose -f docker/compose/docker-compose.dev.yml logs

# Check service health
docker compose -f docker/compose/docker-compose.dev.yml ps
```

### Database connection issues

```bash
# Ensure PostgreSQL is healthy
docker exec museum-db-dev pg_isready -U postgres

# Reset database
docker compose -f docker/compose/docker-compose.dev.yml down -v
docker compose -f docker/compose/docker-compose.dev.yml up

```

### Permission issues on Linux

```bash
# Fix file permissions
sudo chown -R $USER:$USER docker/scripts
chmod +x docker/scripts/*.sh
```

### Line ending issues (Windows)

The scripts automatically convert CRLF to LF, but if you encounter issues:

```bash
dos2unix docker/scripts/*.sh
```

## 📝 Migration from Old Setup

Old files (can be removed):

- ❌ `docker-compose.yaml` → Use `docker/compose/docker-compose.prod.yml`
- ❌ `docker-compose-local.yaml` → Use `docker/compose/docker-compose.dev.yml`
- ❌ `docker-compose.test.yaml` → Use `docker/compose/docker-compose.test.yml`
- ❌ `docker-compose.ci.yaml` → Use `docker/compose/docker-compose.test.yml`
- ❌ `Dockerfile` → Use `docker/dockerfiles/Dockerfile.prod`
- ❌ `e2e.Dockerfile` → Use `docker/dockerfiles/Dockerfile.test`
- ❌ `test.Dockerfile` → Use `docker/dockerfiles/Dockerfile.test`
- ❌ `maildev.Dockerfile` → Now uses official image
- ❌ `startup.*.sh` → Use `docker/scripts/startup-*.sh`
- ❌ `wait-for-it.sh` → Use `docker/scripts/wait-for-it.sh`

Update package.json scripts:

```json
{
  "docker:dev": "docker compose -f docker/compose/docker-compose.dev.yml up",
  "docker:dev:down": "docker compose -f docker/compose/docker-compose.dev.yml down",
  "docker:prod": "docker compose -f docker/compose/docker-compose.prod.yml up -d",
  "docker:prod:down": "docker compose -f docker/compose/docker-compose.prod.yml down",
  "docker:test": "docker compose -f docker/compose/docker-compose.test.yml up --abort-on-container-exit",
  "docker:build": "docker build -f docker/dockerfiles/Dockerfile.prod -t davys/museum-api:latest ."
}
```

## 🎯 Benefits of New Structure

✅ **Organized**: All Docker files in one directory  
✅ **Clear naming**: `.dev`, `.prod`, `.test` suffixes  
✅ **No duplication**: Single test Dockerfile instead of two  
✅ **Official images**: Using `maildev/maildev` instead of custom  
✅ **Healthchecks**: All services have proper health monitoring  
✅ **Better dependencies**: Using `depends_on` with conditions  
✅ **Optimized builds**: Multi-stage production builds  
✅ **Faster tests**: Using tmpfs for test database  
✅ **Documentation**: Clear README with all commands
