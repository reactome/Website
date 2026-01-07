# Reactome Website – PHP 7.4 + Apache
FROM php:7.4-apache

# Enable Apache rewrite (required by Joomla)
RUN a2enmod rewrite

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    git \
    vim \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    unzip \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install \
        mysqli \
        pdo \
        pdo_mysql \
        zip \
        gd \
        mbstring \
        xml \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set Apache DocumentRoot to Joomla site root if needed
# (adjust if your docker-compose mounts elsewhere)
ENV APACHE_DOCUMENT_ROOT=/var/www/html/Website

RUN sed -ri \
    -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf

# Increase PHP limits for Reactome/Joomla
RUN { \
    echo "memory_limit=512M"; \
    echo "upload_max_filesize=64M"; \
    echo "post_max_size=64M"; \
    echo "max_execution_time=300"; \
} > /usr/local/etc/php/conf.d/reactome.ini

# Fix permissions (Apache runs as www-data)
RUN chown -R www-data:www-data /var/www

WORKDIR /var/www/html/Website

EXPOSE 80
