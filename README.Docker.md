# Docker Guide

## Local Development with Docker Compose

### Prerequisites
- Docker
- Docker Compose

### Environment Setup
1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update environment variables in `.env.local`

### Starting the Development Environment

Use Docker Compose to start all services:

```bash
docker compose up --build
```

This will start:
1. PostgreSQL database
2. Collaro application in development mode

## Container Structure

### Database Container
- Image: `postgres:latest`
- Port: 5432
- Environment variables:
  - POSTGRES_USER=postgres
  - POSTGRES_PASSWORD=postgres
  - POSTGRES_DB=collaro

### Application Container
- Base image: `node:18-alpine`
- Working directory: `/app`
- Port: 3000
- Environment:
  - DATABASE_URL (configured to connect to PostgreSQL container)
  - Other environment variables from `.env.local`

## Building the Docker Image

### Standard Build
```bash
docker build -t collaro:latest .
```

### Multi-Platform Build
```bash
docker build --platform=linux/amd64 -t collaro:latest .
```

## Pushing to a Registry

```bash
docker tag collaro:latest registry.example.com/collaro:latest
docker push registry.example.com/collaro:latest
```

## Container Management

### Viewing Logs
```bash
docker compose logs -f
```

### Accessing Container Shell
```bash
docker compose exec collaro-app sh
```

### Database Management
```bash
docker compose exec postgres psql -U postgres
```

## Troubleshooting

### Cleaning Up
```bash
# Stop and remove containers
docker compose down

# Remove volumes (will delete database data)
docker compose down -v

# Remove all related images
docker compose down --rmi all
```

### Common Issues

1. Port conflicts
   - Change the port mapping in `compose.yaml`
   - Default ports: 3000 (app), 5432 (database)

2. Database connection issues
   - Ensure database container is running: `docker compose ps`
   - Check database logs: `docker compose logs postgres`
   - Verify DATABASE_URL in environment