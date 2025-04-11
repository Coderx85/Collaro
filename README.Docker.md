# Docker Setup Guide 🐳

## Prerequisites

- Docker Engine 24.0+
- Docker Compose V2
- Node.js 18+ (for local development)

## Quick Start 🚀

1. **Environment Variables**
```bash
cp .env.example .env.local
```

Required variables:
```env
NODE_ENV=development
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STREAM_API_KEY=
STREAM_API_SECRET=
DATABASE_URL=
NEXT_TELEMETRY_DISABLED=1
```

2. **Development**
```bash
docker compose up --build
```

Access: [http://localhost:3000](http://localhost:3000)

## Container Details 📦

### Development Container
```yaml
services:
  devntalk-app:
    build: .
    container_name: devntalk-container
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    volumes:
      - .:/app
    command: yarn dev
```

### Production Container
```dockerfile
FROM node:slim
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Production Deployment 🚀

1. **Build**
```bash
docker build -t devntalk:latest .
```

2. **Platform-Specific Build**
```bash
docker build --platform=linux/amd64 -t devntalk:latest .
```

3. **Push to Registry**
```bash
docker tag devntalk:latest registry.example.com/devntalk:latest
docker push registry.example.com/devntalk:latest
```

## Resource Guidelines 📊

- Minimum RAM: 4GB
- Recommended CPU: 2 cores
- Storage: 10GB

## Troubleshooting 🔧

### Common Issues

1. **Port Conflicts**
```bash
# Check port usage
lsof -i :3000
# Stop conflicting process
kill $(lsof -t -i:3000)
```

2. **Node Modules Issues**
```bash
# Rebuild node_modules
docker compose down -v
docker compose up --build
```

3. **Performance**
- Enable BuildKit: `export DOCKER_BUILDKIT=1`
- Use volume mounts for development
- Configure resource limits in Docker Desktop