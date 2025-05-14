FROM ubuntu:22.04

# パッケージリストを更新し、必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    vim \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# コンテナ起動時のコマンドを設定
CMD ["/bin/bash"]
