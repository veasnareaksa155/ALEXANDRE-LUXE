FROM php:8.2-cli-alpine

# Install system dependencies & PostgreSQL/MySQL drivers
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql bcmath zip gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy Backend codebase
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for Laravel storage & cache
RUN chmod -R 777 storage bootstrap/cache

# Expose Render default port
EXPOSE 10000

# Start Laravel Server & Run Migrations on container launch
CMD php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000

