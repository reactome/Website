FROM php:5.6-apache

# Debian stretch is EOL — use archive repositories
RUN sed -i \
    -e 's|deb.debian.org|archive.debian.org|g' \
    -e 's|security.debian.org|archive.debian.org|g' \
    /etc/apt/sources.list \
 && sed -i '/stretch-updates/d' /etc/apt/sources.list \
 && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until

# Enable Apache modules
RUN a2enmod rewrite headers

# Set Apache DocumentRoot to Reactome Website directory
RUN sed -i \
    's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/Website|g' \
    /etc/apache2/sites-available/000-default.conf \
 && sed -i \
    's|<Directory /var/www/>|<Directory /var/www/html/Website/>|g' \
    /etc/apache2/apache2.conf


# Install dependencies + PHP extensions (allow unauthenticated: required for EOL Debian)
RUN apt-get update && apt-get install -y --allow-unauthenticated \
    default-mysql-client \
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
        simplexml \
 && rm -rf /var/lib/apt/lists/*

# Apache FQDN warning fix
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copy site
COPY . /var/www/html

# Remove unsupported php_flag / php_value directives
RUN sed -i '/^php_flag/d;/^php_value/d' /var/www/html/Website/.htaccess

# Permissions
RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html/Website
EXPOSE 80
