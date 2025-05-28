# Stay_connect_app

## プロジェクトの概要
**Stay_connect_app**  
部活動やクラブチーム、スポーツを楽しむ人たちが練習試合を通じてレベルアップすることは重要です。しかし、練習試合の相手を見つけるのが難しいという声をよく耳にします。  
このアプリは、練習試合を希望するチーム同士を繋げ、簡単に対戦相手を見つけられるようにすることを目的として開発されています。

---

## 機能一覧
### 主な機能
- チーム間の練習試合マッチング機能
- 練習試合のスケジュール管理
- Google認証を使用したログイン機能
- Action Cable を使用したリアルタイム通信

### 使用技術
#### フロントエンド（Vue.js）
- Vue.js `3.3.10`
- Vue Router `4.0.3`
- Tailwind CSS `3.3.6`
- Action Cable
- Firebase `10.6.0`（Google認証）

#### フロントエンド（React + TypeScript）
- React `19.0.0`（開発中）
- TypeScript `5.7.2`
- Vite `6.1.0`
- React Router `7.2.0`
- Tailwind CSS `3`
- Firebase `11.3.1`（Google認証）

#### バックエンド（Ruby on Rails）
- Ruby `3.2.2`
- Ruby on Rails `7.0.7`
- REST API（データの取得・更新）

#### バックエンド（PHP）
- PHP `8.1`
- REST API（データの取得・更新）
- PDO を使用したデータベース接続

---

## 動作環境
- Docker / Docker Compose `2.29.1`
- PostgreSQL `17.5`
- 推奨ブラウザ: Google Chrome, Firefox

---

## セットアップ手順

1. **リポジトリをクローン**
リポジトリをクローンしたいディレクトリに移動して下を実行します。
   ```bash
   git clone https://github.com/toshinori-m/stay_connect.git
   cd stay_connect
   # Vue フロントエンドのセットアップ
   cd frontend
   yarn install
   cd ../

   # React フロントエンドのセットアップ
   cd frontend-react
   yarn install
   cd ../
   ```
2. **データベースのセットアップ（初回のみ）**
   ```bash
   docker compose run --rm backend bash -c "bundle exec rails db:create && bundle exec rails db:migrate && bundle exec rails db:seed"
   ```
3. **Dockerを使用してアプリケーションを起動**
DockerおよびDocker Composeがインストールされていることを確認し、以下のコマンドを実行します。
   ```bash
   docker compose build   # Dockerイメージをビルド
   docker compose up -d   # コンテナをバックグラウンドで起動
   ```
   **Docker Compose 旧バージョンを使用している場合**
   ```bash
   docker-compose build   # イメージをビルド
   docker-compose up -d   # コンテナをバックグラウンドで起動
   ```
4. **backend-php`.env`ファイルの作成**
backend-phpのルートディレクトリの`.env.example`ファイルから`.env`ファイルに名称を修正します。
5. **動作確認**
下のURLにアクセスします
- **Frontend（Vue.js）**: [http://localhost:81/](http://localhost:81/)
- **Frontend（React + TypeScript）**: [http://localhost:5173/](http://localhost:5173/)
- **Backend（Ruby on Rails）**: [http://localhost:3001/](http://localhost:3001/)
- **Backend（PHP）**: [http://localhost:3002/](http://localhost:3002/)
- **Database（PostgreSQL）**: `localhost:3307` （ユーザー: `root`, パスワード: `password`）
※詳しいバックエンド処理の実装例については、下記Zenn記事も参考にしてください。
[React + PHP + PostgreSQLのAPI開発記事](https://zenn.dev/toshi052312/articles/ff3787c8cbb29c)

---

## 環境変数の設定方法
1. **frontend`.env`ファイルの作成**
frontendのルートディレクトリの`.env.example`ファイルから`.env`ファイルに名称を修正します。
2. **Firebaseから情報を取得**
Firebaseの設定ページから以下の情報を取得し、`.env`ファイルに記載します。
- APIキー → VUE_APP_API_KEY
- 認証ドメイン → VUE_APP_AUTH_DOMAIN
- プロジェクトID → VUE_APP_PROJECT_ID
3. **frontend`.env`ファイル内容**
```env
# Firebase APIキー
VUE_APP_API_KEY="YOUR_FIREBASE_API_KEY"

# Firebase Auth ドメイン
VUE_APP_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"

# Firebase プロジェクトID
VUE_APP_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
```
4. **FirebaseからAuthenticationの設定**
   1. 「Authentication」を開く
   - 左側メニューの「構築」セクション内の「Authentication」を選択
   2. Googleサインインを有効化
   - 「サインイン方法（Sign-in method）」タブを開く
   - 「Google」をクリックし、設定画面で「有効にする」スイッチをオン
