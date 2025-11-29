# Docker Refactoring Migration Guide

## 📋 Summary of Changes

This refactoring organizes all Docker-related files into a structured `docker/` directory and consolidates duplicate configurations.

## 🗂️ New Structure

```
docker/
├── compose/
│   ├── docker-compose.dev.yml   # Replaces: docker-compose-local.yaml
│   ├── docker-compose.prod.yml  # Replaces: docker-compose.yaml
│   └── docker-compose.test.yml  # Replaces: docker-compose.test.yaml + docker-compose.ci.yaml
├── dockerfiles/
│   ├── Dockerfile.dev           # New: Development with hot reload
│   ├── Dockerfile.prod          # Replaces: Dockerfile (improved multi-stage)
│   └── Dockerfile.test          # Replaces: test.Dockerfile + e2e.Dockerfile
└── scripts/
    ├── startup-dev.sh           # Replaces: startup.dev.sh
    ├── startup-prod.sh          # Replaces: startup.dev.sh (renamed)
    ├── startup-test.sh          # Replaces: startup.test.sh + startup.ci.sh
    └── wait-for-it.sh           # Moved from root
```

## ✅ What's Improved

### 1. Consolidated Test Files

**Before**: `test.Dockerfile`, `e2e.Dockerfile`, `startup.test.sh`, `startup.ci.sh`  
**After**: Single `Dockerfile.test` and `startup-test.sh`

### 2. Official Images

**Before**: Custom `maildev.Dockerfile`  
**After**: Official `maildev/maildev:2.1.0` image

### 3. Better Organization

**Before**: 9 Docker files scattered in root  
**After**: 3 organized directories in `docker/`

### 4. Enhanced Dev Experience

- Added Adminer for database management
- Proper healthchecks on all services
- Volume mounts for hot reload
- Better dependency management with `depends_on` conditions

### 5. Optimized Builds

- Multi-stage builds with separated dependencies
- Smaller production images
- Better layer caching

## 🔄 Migration Steps

### Step 1: Update Your Commands

#### Old Commands → New Commands

```bash
# Development
docker compose -f docker-compose-local.yaml up
→ npm run docker:dev

# Production
docker compose -f docker-compose.yaml up
→ npm run docker:prod

# Tests
npm run test:e2e:docker
→ npm run docker:test
```

### Step 2: Update CI/CD

If using GitHub Actions, the workflow has been updated to use:

```yaml
file: docker/dockerfiles/Dockerfile.prod
```

### Step 3: Update Environment Variables

No changes needed! All env vars remain the same.

### Step 4: Clean Up Old Files (Optional)

After confirming everything works, you can remove:

```bash
# Old compose files
rm docker-compose.yaml
rm docker-compose-local.yaml
rm docker-compose.test.yaml
rm docker-compose.ci.yaml

# Old Dockerfiles
rm Dockerfile
rm e2e.Dockerfile
rm test.Dockerfile
rm maildev.Dockerfile

# Old scripts
rm startup.dev.sh
rm startup.test.sh
rm startup.ci.sh
rm wait-for-it.sh  # Now in docker/scripts/
```

## 📝 Updated package.json Scripts

```json
{
  "docker:dev": "docker compose -f docker/compose/docker-compose.dev.yml up",
  "docker:dev:build": "docker compose -f docker/compose/docker-compose.dev.yml up --build",
  "docker:dev:down": "docker compose -f docker/compose/docker-compose.dev.yml down",
  "docker:prod": "docker compose -f docker/compose/docker-compose.prod.yml up -d",
  "docker:prod:down": "docker compose -f docker/compose/docker-compose.prod.yml down",
  "docker:test": "docker compose -f docker/compose/docker-compose.test.yml up --abort-on-container-exit",
  "docker:test:down": "docker compose -f docker/compose/docker-compose.test.yml down -v",
  "docker:build": "docker build -f docker/dockerfiles/Dockerfile.prod -t davys/museum-api:latest ."
}
```

## 🐛 Troubleshooting

### "Cannot find Dockerfile"

Make sure you're using the new paths:

```bash
docker build -f docker/dockerfiles/Dockerfile.prod .
```

### "Script not found" errors

Scripts are now in `docker/scripts/`:

- Update any references from `/opt/` to `/scripts/` (already done in new Dockerfiles)

### Volumes not persisting

New named volumes are used. Old volumes won't be automatically migrated.
To migrate data:

```bash
# Export from old setup
docker run --rm -v museum-db-volume:/source -v $(pwd):/backup alpine tar -czf /backup/db-backup.tar.gz -C /source .

# Import to new setup
docker run --rm -v museum-postgres-dev:/dest -v $(pwd):/backup alpine tar -xzf /backup/db-backup.tar.gz -C /dest
```

## 🎯 Benefits

### For Developers

✅ Single command to start dev environment: `npm run docker:dev`  
✅ Adminer included for easier database management  
✅ Clear separation between dev/prod/test environments  
✅ Better documentation in `docker/README.md`

### For CI/CD

✅ Faster builds with better caching  
✅ Consistent test environment  
✅ Single Dockerfile for all test scenarios

### For Production

✅ Optimized multi-stage builds  
✅ Smaller image sizes  
✅ Better healthcheck monitoring  
✅ Proper service dependencies

## 📚 Next Steps

1. Read the full documentation in `docker/README.md`
2. Test the new setup with `npm run docker:dev`
3. Update any deployment scripts to use new compose file paths
4. Remove old files after confirmation

## ❓ Questions?

Check `docker/README.md` for detailed documentation of each environment and service.
