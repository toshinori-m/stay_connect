FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y \
    tzdata \
    php-fpm \
    php8.1-pgsql \
    php8.1-mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

CMD ["/usr/sbin/php-fpm8.1", "-F"]
