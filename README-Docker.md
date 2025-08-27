# AB Steak Laravel Application with FrankenPHP

This project uses FrankenPHP as the application server for optimal Laravel performance in Docker containers.

## Prerequisites

- Docker or Podman
- Docker Compose or Podman Compose

## Environment Configuration

### Local Development
- Use `.env` file for local development with `php artisan serve`
- Database host: `127.0.0.1`
- Application URL: `http://localhost:8000`

### Docker Environment
- Uses `.env.docker` file automatically copied during build
- Database host: `db` (Docker service name)
- Application URL: `http://localhost:8000`

## Quick Start

### 1. Build and Start Services

```bash
# Using Docker Compose
docker compose up --build

# Using Podman Compose
podman compose up --build
```

### 2. Access Application

Open your browser and navigate to: `http://localhost:8000`

## Services

### Application (FrankenPHP)
- **Port**: 8000
- **Technology**: FrankenPHP with Laravel
- **Features**:
  - Worker mode for enhanced performance
  - Automatic Laravel setup (migrations, caching)
  - Health checks
  - Hot reload support via volume mounting

### Database (PostgreSQL)
- **Port**: 5432
- **Database**: absteak
- **Username**: absteak
- **Password**: absteak
- **Features**:
  - Health checks
  - Persistent data storage

## Development Workflow

### Making Code Changes
1. Edit files locally
2. Changes are automatically reflected in the container via volume mounting
3. For dependency changes, rebuild the container:
   ```bash
   docker compose up --build
   ```

### Database Operations

```bash
# Run migrations
docker compose exec app php artisan migrate

# Seed database
docker compose exec app php artisan db:seed

# Access database directly
docker compose exec db psql -U absteak -d absteak
```

### Laravel Commands

```bash
# Clear caches
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Generate application key
docker compose exec app php artisan key:generate

# Run tests
docker compose exec app php artisan test
```

## Troubleshooting

### Container Won't Start
1. Check if ports 8000 and 5432 are available
2. Ensure Docker/Podman is running
3. Check logs: `docker compose logs app`

### Database Connection Issues
1. Wait for database health check to pass
2. Verify database credentials in `.env.docker`
3. Check database logs: `docker compose logs db`

### Performance Issues
1. FrankenPHP worker mode is enabled by default
2. Adjust `FRANKENPHP_WORKERS` environment variable if needed
3. Monitor container resources: `docker stats`

## File Structure

```
.
├── Dockerfile              # FrankenPHP container configuration
├── docker-compose.yml      # Multi-service orchestration
├── .env                     # Local development environment
├── .env.docker             # Docker environment (auto-used in container)
├── docker/
│   └── php.ini             # PHP configuration for FrankenPHP
└── README-Docker.md        # This documentation
```

## Environment Variables Synchronization

The following environment variables are synchronized between local and Docker environments:

- **Application**: `APP_NAME`, `APP_ENV`, `APP_DEBUG`, `APP_URL`
- **Database**: `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- **Cache/Session**: `CACHE_STORE`, `SESSION_DRIVER`, `QUEUE_CONNECTION`
- **Performance**: `PHP_CLI_SERVER_WORKERS`

## Production Deployment

For production deployment:

1. Update `.env.docker` with production values
2. Set `APP_ENV=production` and `APP_DEBUG=false`
3. Configure proper database credentials
4. Set up SSL/TLS termination
5. Configure proper logging and monitoring

## Support

For issues related to:
- **FrankenPHP**: Check [FrankenPHP documentation](https://frankenphp.dev/)
- **Laravel**: Check [Laravel documentation](https://laravel.com/docs)
- **Docker**: Check [Docker documentation](https://docs.docker.com/)