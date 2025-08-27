# Use FrankenPHP for better performance
FROM dunglas/frankenphp:php8.3-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    unzip \
    curl \
    nodejs \
    npm \
    netcat-openbsd \
    postgresql-client \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

# Install PHP extensions
RUN install-php-extensions pdo_pgsql redis

# Install pnpm globally
RUN npm install -g pnpm

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy dependency files first for better caching
COPY composer.json composer.lock package.json pnpm-lock.yaml /app/

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Install Node.js dependencies
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY . /app

# Copy Docker-specific environment file
COPY .env.docker /app/.env

# Build frontend assets
RUN pnpm run build

# Copy Caddyfile and entrypoint script
COPY Caddyfile /etc/caddy/Caddyfile
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set proper permissions
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Use entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
