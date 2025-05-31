FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN rm -rf /var/lib/apt/lists/* \
  && apt-get clean \
  && apt-get update --allow-insecure-repositories \
  && apt-get install -y tzdata php-fpm php8.1-pgsql

WORKDIR /app

CMD ["/usr/sbin/php-fpm8.1", "-F"]
