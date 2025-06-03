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
- Google 認証を使用したログイン機能
- Action Cable を使用したリアルタイム通信

### 使用技術

#### フロントエンド（Vue.js）

- Vue.js `3.3.10`
- Vue Router `4.0.3`
- Tailwind CSS `3.3.6`
- Action Cable
- Firebase `10.6.0`（Google 認証）

#### フロントエンド（React + TypeScript / Vite）

- React `19.0.0`
- TypeScript `5.7.2`
- Vite `6.1.0`
- React Router `7.2.0`
- Tailwind CSS `3`
- Firebase `11.3.1`（Google 認証）

#### バックエンド（Ruby on Rails）

- Ruby `3.2.2`
- Ruby on Rails `7.0.7`
- REST API（データの取得・更新）

#### バックエンド（PHP）【開発中】

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

### 対応構成

Stay_connect_app は下の 3 構成で動作確認済みです。
| フロントエンド | バックエンド | 状況 |
|----------------------|------------------|------------------|
| Vue.js | Ruby on Rails | 動作確認済み |
| React + TypeScript | Ruby on Rails | 動作確認済み |
| React + TypeScript | PHP | 動作確認済み（開発中） |

### 初回セットアップ手順（全構成一括起動）

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/toshinori-m/stay_connect.git
   cd stay_connect
   ```
2. **環境変数ファイルを作成**
   ```bash
   cp frontend/.env.example frontend/.env
   cp frontend-react/.env.example frontend-react/.env
   cp backend-php/.env.example backend-php/.env
   ```
3. **Docker を使用してアプリケーションを起動**
   ```bash
   docker compose up -d
   ```
4. **動作確認**
   下の URL にアクセスします

- **Frontend（Vue.js）**: [http://localhost:81/](http://localhost:81/)
- **Frontend（React + TypeScript）**: [http://localhost:5173/](http://localhost:5173/)
- **Backend（Ruby on Rails）**: [http://localhost:3001/](http://localhost:3001/)
- **Backend（PHP）**: [http://localhost:3002/](http://localhost:3002/)（Nginx 経由で接続）（開発中）
- **Database（PostgreSQL）**: `localhost:5432` （ユーザー: `postgres`, パスワード: `password`）

### 2 回目以降の起動手順

```bash
docker compose up -d
```

### 補足：DB 操作（Rails 使用時）

#### 初回にまとめて実行したい場合

```bash
docker compose run --rm backend bash -c "bundle exec rails db:create && bundle exec rails db:migrate && bundle exec rails db:seed"
```

#### 個別に実行したい場合

- **DB 作成**
  ```bash
  docker compose run --rm backend bash -c "bundle exec rails db:create"
  ```
- **マイグレーション**
  ```bash
  docker compose run --rm backend bash -c "bundle exec rails db:migrate"
  ```
- **初期データ投入**
  ```bash
  docker compose run --rm backend bash -c "bundle exec rails db:seed"
  ```

### React + PHP 構成で使用する場合の.env 設定

React フロントエンド（frontend-react）は、デフォルトで PHP バックエンド（http://localhost:3002）と通信する設定です。
Rails バックエンド（http://localhost:3001）を使用する場合は、`frontend-react/.env` ファイル内の 下の箇所のコメントアウトを外してください。

```bash
# VITE_API_BASE_URL="http://localhost:3001"
```

---

## 環境変数の設定方法

### Vue 構成の場合

1. **Firebase から情報を取得**
   Firebase の設定ページから以下の情報を取得し、`.env`ファイルに記載します。

- API キー → VUE_APP_API_KEY
- 認証ドメイン → VUE_APP_AUTH_DOMAIN
- プロジェクト ID → VUE_APP_PROJECT_ID

2. **frontend ディレクトリの`.env`ファイル内容**

```env
# Firebase APIキー
VUE_APP_API_KEY="YOUR_FIREBASE_API_KEY"

# Firebase Auth ドメイン
VUE_APP_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"

# Firebase プロジェクトID
VUE_APP_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
```

3. **Firebase から Authentication の設定**
   1. 「Authentication」を開く
   - 左側メニューの「構築」セクション内の「Authentication」を選択
   2. Google サインインを有効化
   - 「サインイン方法（Sign-in method）」タブを開く
   - 「Google」をクリックし、設定画面で「有効にする」スイッチをオン

### React 構成の場合

1. **Firebase から情報を取得**
   Firebase の設定ページから以下の情報を取得し、`.env`ファイルに記載します。

- API キー → VITE_API_KEY
- 認証ドメイン → VITE_AUTH_DOMAIN
- プロジェクト ID → VITE_PROJECT_ID

2. **frontend-react ディレクトリの`.env`ファイル内容**

```env
# Firebase APIキー
VITE_API_KEY="YOUR_FIREBASE_API_KEY"

# Firebase Auth ドメイン
VITE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"

# Firebase プロジェクトID
VITE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
```

3. **Firebase から Authentication の設定**
   1. 「Authentication」を開く
   - 左側メニューの「構築」セクション内の「Authentication」を選択
   2. Google サインインを有効化
   - 「サインイン方法（Sign-in method）」タブを開く
   - 「Google」をクリックし、設定画面で「有効にする」スイッチをオン
