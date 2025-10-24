# FASE 8 - Otimização, Performance e Deploy

## Objetivo
Otimizar performance, implementar monitoramento, configurar deploy production e preparar para escalabilidade em ambiente VPS com outras aplicações.

## Otimização de Performance

### Frontend (Next.js)
**Code Splitting**:
- Lazy loading de módulos por secretaria
- Dynamic imports para páginas especializadas
- Component splitting por nível de usuário
- Bundle analysis e tree shaking

**Caching Strategy**:
- Static Generation para landing page
- ISR para catálogo de serviços
- SWR para dados dinâmicos
- Service Worker para offline

**Image Optimization**:
- Next.js Image component
- WebP/AVIF conversion automática
- Responsive images por device
- CDN integration via nginx

### Backend (Node.js)
**Database Optimization**:
- Indexes otimizados para queries multi-tenant
- Connection pooling configurado
- Query optimization e N+1 prevention
- Database sharding strategy para crescimento

**API Performance**:
- Response compression (gzip/brotli)
- Rate limiting por tenant
- API caching com Redis
- Response time monitoring

**Memory Management**:
- Garbage collection tuning
- Memory leak detection
- CPU profiling e optimization
- Process clustering para multi-core

## Monitoramento e Observabilidade

### Application Performance Monitoring (APM)
**Metrics Collection**:
- Response time por endpoint
- Database query performance
- Memory e CPU usage
- Error rates e stack traces

**Health Checks**:
- Database connectivity
- External API status
- File system availability
- Memory thresholds

### Logging Strategy
**Structured Logging**:
```json
{
  "timestamp": "2024-01-01T10:00:00Z",
  "level": "info",
  "tenantId": "tenant123",
  "userId": "user456",
  "action": "protocol_created",
  "protocolId": "prot789",
  "duration": 150
}
```

**Log Levels**:
- ERROR: Falhas críticas
- WARN: Degradação performance
- INFO: Operações importantes
- DEBUG: Troubleshooting detalhado

### Alerting System
**Critical Alerts**:
- API response time > 5s
- Error rate > 5%
- Database connections > 80%
- Disk space < 20%

**Business Alerts**:
- Protocolos sem atendimento > 24h
- Picos anômalos de demanda
- Integrações externas falhando
- Satisfação abaixo de 3.0

## Configuração de Deploy

### Docker Production
**Multi-stage Builds**:
```dockerfile
# Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

FROM nginx:alpine AS frontend-prod
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

**Container Optimization**:
- Alpine Linux base images
- Multi-stage builds para reduzir tamanho
- .dockerignore configurado
- Health checks nos containers

### nginx Configuration
**Reverse Proxy**:
```nginx
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:3001;
}

server {
    listen 80;
    server_name *.digiurban.com;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant $1;
    }
    
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant $1;
    }
}
```

**Performance Features**:
- Gzip compression habilitado
- Static file caching
- Rate limiting por IP
- SSL/TLS termination

### Environment Configuration
**Production Variables**:
```env
NODE_ENV=production
DATABASE_URL=file:./production.db
REDIS_URL=redis://redis:6379
LOG_LEVEL=info
ENABLE_METRICS=true
SSL_CERT_PATH=/certs/
```

## VPS Setup e Coexistência

### Docker Compose Production
```yaml
version: '3.8'

services:
  digiurban-frontend:
    build: ./frontend
    networks:
      - digiurban-network
    restart: unless-stopped
    
  digiurban-backend:
    build: ./backend
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    networks:
      - digiurban-network
    restart: unless-stopped
    
  digiurban-redis:
    image: redis:alpine
    networks:
      - digiurban-network
    restart: unless-stopped

networks:
  digiurban-network:
    external: true
```

### nginx Integration
**Virtual Hosts**:
- Configuração para coexistir com outras apps
- Subdomain routing para multi-tenancy
- Shared SSL certificates
- Isolated upstream definitions

### Resource Management
**Container Limits**:
```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
    reservations:
      memory: 256M
      cpus: '0.25'
```

**Volume Management**:
- Shared volumes para uploads
- Database backups automáticos
- Log rotation configurado

## Backup e Disaster Recovery

### Database Backup
**Automated Backups**:
```bash
#!/bin/bash
# backup-script.sh
BACKUP_DIR="/backups/digiurban"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# SQLite backup
sqlite3 /app/data/production.db ".backup $BACKUP_DIR/db_$TIMESTAMP.db"

# Compress and cleanup
gzip "$BACKUP_DIR/db_$TIMESTAMP.db"
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

**Recovery Procedures**:
- Point-in-time recovery
- Cross-tenant data restoration
- Rollback procedures documentados

### File System Backup
- Upload files backup
- Configuration files backup
- SSL certificates backup
- Automated S3/cloud sync

## Security Hardening

### Container Security
- Non-root user containers
- Read-only file systems
- Secret management com Docker secrets
- Network policies implementadas

### Application Security
- SQL injection prevention
- XSS protection headers
- CSRF tokens implementados
- Rate limiting agressivo

### Data Protection
- Encryption at rest
- Secure key management
- LGPD compliance checks
- Audit trail completo

## Monitoring Dashboard

### System Metrics
- CPU, RAM, Disk usage
- Network throughput
- Container health status
- Response times por service

### Business Metrics
- Protocolos processados/hora
- Usuários ativos simultâneos
- Tenant usage patterns
- Revenue metrics (SaaS)

### Custom Dashboards
- Grafana dashboards configurados
- Prometheus metrics collection
- Custom alerts setup
- Executive summary reports

## Load Testing

### Performance Benchmarks
**Target Metrics**:
- API response time < 200ms (95th percentile)
- Page load time < 2s
- Concurrent users: 1000+ por tenant
- Database queries < 100ms

**Test Scenarios**:
- Normal load (100 users/tenant)
- Peak load (500 users/tenant)
- Stress test (1000+ users/tenant)
- Spike testing (sudden increases)

### Optimization Results
- Database query optimization
- API endpoint caching
- Frontend bundle size reduction
- CDN implementation benefits

## CI/CD Pipeline

### Automated Testing
- Unit tests (80%+ coverage)
- Integration tests
- E2E tests críticos
- Performance regression tests

### Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t digiurban:latest .
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        run: |
          docker-compose pull
          docker-compose up -d --no-deps
```

## Rollback Strategy

### Blue-Green Deployment
- Zero-downtime deployments
- Instant rollback capability
- Health checks antes do switch
- Database migration safety

### Rollback Procedures
- Automated rollback triggers
- Manual rollback commands
- Data consistency checks
- Communication procedures

## Critérios de Sucesso
1. Response time < 200ms (95th percentile)
2. Uptime > 99.9%
3. Zero-downtime deployments funcionando
4. Monitoring e alertas operacionais
5. Backup e recovery testados
6. Load testing aprovado
7. Security hardening implementado
8. Coexistência com outras apps na VPS