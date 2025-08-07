# 🚀 Floraa.dev Deployment Guide

This guide covers deploying Floraa.dev using Docker in production environments.

## 📋 Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- Domain name (for production)
- SSL certificate (recommended)
- GitHub OAuth App configured
- AI API keys (OpenAI, Anthropic, or Google AI)
- PostgreSQL database (for production)

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/floraa-dev.git
cd floraa-dev
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your production values:

```bash
# GitHub OAuth
GITHUB_CLIENT_ID="your_production_github_client_id"
GITHUB_CLIENT_SECRET="your_production_github_client_secret"
GITHUB_CALLBACK_URL="https://your-domain.com/auth/github/callback"

# AI Providers (at least one required)
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-key"

# Database
DATABASE_URL="postgresql://floraa_user:secure_password@db:5432/floraa_production"

# Security
SESSION_SECRET="your-very-secure-session-secret-min-32-characters"

# Environment
NODE_ENV="production"
VITE_LOG_LEVEL="info"
```

## 🐳 Docker Deployment

### Production Deployment
```bash
# Build and start production containers
docker-compose --profile production up -d --build

# View logs
docker-compose logs -f floraa-prod

# Stop containers
docker-compose --profile production down
```

### Development Deployment
```bash
# Build and start development containers
docker-compose --profile development up -d --build

# View logs
docker-compose logs -f floraa-dev
```

## 🗄️ Database Setup

### PostgreSQL with Docker
Add to your `docker-compose.yaml`:

```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: floraa_production
      POSTGRES_USER: floraa_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    profiles:
      - production

volumes:
  postgres_data:
```

### External Database
For managed databases (AWS RDS, Google Cloud SQL, etc.), update your `DATABASE_URL` in `.env.local`.

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use strong, unique passwords and secrets
- Rotate API keys regularly

### 2. Network Security
- Use HTTPS in production
- Configure firewall rules
- Limit database access

### 3. Container Security
- Run containers as non-root user
- Keep base images updated
- Scan for vulnerabilities

## 🌐 Reverse Proxy Setup

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Traefik Configuration
```yaml
version: '3.8'
services:
  floraa-prod:
    # ... your existing config
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.floraa.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.floraa.tls.certresolver=letsencrypt"
      - "traefik.http.services.floraa.loadbalancer.server.port=5173"
```

## 📊 Monitoring & Logging

### Health Checks
Add health checks to your `docker-compose.yaml`:

```yaml
services:
  floraa-prod:
    # ... existing config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Log Management
```bash
# View real-time logs
docker-compose logs -f floraa-prod

# View logs with timestamps
docker-compose logs -t floraa-prod

# Limit log output
docker-compose logs --tail=100 floraa-prod
```

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose --profile production up -d --build

# Clean up old images
docker image prune -f
```

### Backup Database
```bash
# Create backup
docker exec -t your-postgres-container pg_dumpall -c -U floraa_user > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
cat backup_file.sql | docker exec -i your-postgres-container psql -U floraa_user -d floraa_production
```

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   docker-compose logs floraa-prod
   docker-compose ps
   ```

2. **Database connection issues**
   - Check `DATABASE_URL` format
   - Verify database is running
   - Check network connectivity

3. **GitHub OAuth issues**
   - Verify callback URL matches GitHub app settings
   - Check client ID and secret
   - Ensure HTTPS in production

4. **AI API issues**
   - Verify API keys are valid
   - Check API quotas and limits
   - Review API provider status

### Performance Optimization

1. **Resource Limits**
   ```yaml
   services:
     floraa-prod:
       deploy:
         resources:
           limits:
             cpus: '2'
             memory: 4G
           reservations:
             cpus: '1'
             memory: 2G
   ```

2. **Caching**
   - Enable Redis for session storage
   - Configure CDN for static assets
   - Implement application-level caching

## 📞 Support

For deployment issues:
1. Check the logs first
2. Review this deployment guide
3. Check GitHub issues
4. Contact support team

---

**Ready for production?** Follow this guide step by step for a secure, scalable deployment of Floraa.dev! 🚀