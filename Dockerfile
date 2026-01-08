# Reactome Website – PHP 7.4 + Apache
FROM php:7.4-apache

# Enable Apache modules
RUN a2enmod rewrite headers

# Fix old Debian repositories for Bullseye
RUN sed -i -e 's|deb.debian.org|archive.debian.org|g' \
           -e 's|security.debian.org|archive.debian.org|g' \
           /etc/apt/sources.list \
 && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until \
 && sed -i '/bullseye-security/d' /etc/apt/sources.list

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    unzip \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
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

# Copy website code
COPY ./Website /var/www/html/Website

# Permissions for Joomla
RUN chown -R www-data:www-data /var/www/html/Website \
 && chmod -R 755 /var/www/html/Website

# Set Apache DocumentRoot
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/Website|g' \
    /etc/apache2/sites-available/000-default.conf \
 && sed -i '/<Directory \/var\/www\/html>/,/<\/Directory>/c\
<Directory /var/www/html/Website>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' \
    /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD ["apache2-foreground"]
