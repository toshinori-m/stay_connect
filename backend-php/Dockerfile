FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# GPG問題を避けるための応急処置を追加
RUN rm -rf /var/lib/apt/lists/* \
  && apt-get clean \
  && apt-get update --allow-insecure-repositories \
  && apt-get install -y tzdata php-fpm

# TCP 9000で受けるように FastCGI 設定ファイルを上書き
COPY etc/www.conf /etc/php/8.1/fpm/pool.d/www.conf

WORKDIR /app

CMD ["/usr/sbin/php-fpm8.1", "-F"]
