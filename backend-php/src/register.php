<?php
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['user'])) {
  http_response_code(400);
  echo json_encode(['error' => 'ユーザー情報が送信されていません。']);
  exit;
}

$user = $input['user'];
$name = trim($user['name'] ?? '');
$email = trim($user['email'] ?? '');
$uid = trim($user['uid'] ?? '');

if (!$name || !$email || !$uid) {
  http_response_code(400);
  echo json_encode(['error' => '必須項目が不足しています。']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => '正しいメールアドレス形式で入力してください。']);
  exit;
}

require_once __DIR__ . '/../config/database.php';

try {
  $pdo = getPDO();

  // emailの重複チェック
  $checkEmailStmt = $pdo->prepare("SELECT 1 FROM users WHERE email = :email LIMIT 1");
  $checkEmailStmt->execute([':email' => $email]);
  if ($checkEmailStmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'このメールアドレスはすでに登録されています。']);
    exit;
  }

  // uidの重複チェック
  $checkUidStmt = $pdo->prepare("SELECT 1 FROM users WHERE uid = :uid LIMIT 1");
  $checkUidStmt->execute([':uid' => $uid]);
  if ($checkUidStmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'このUIDはすでに登録されています。']);
    exit;
  }

  $stmt = $pdo->prepare("
    INSERT INTO users (name, email, uid, created_at, updated_at) 
    VALUES (:name, :email, :uid, NOW(), NOW())
  ");
  $stmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':uid' => $uid,
  ]);
  http_response_code(201);
  echo json_encode(['message' => 'ユーザー登録が完了しました。']);
  exit(0);

} catch (PDOException $e) {
  if ($e->getCode() === '23505') {
    // メッセージ内に 'email' や 'uid' が含まれているか判定
    if (strpos($e->getMessage(), 'email') !== false) {
      http_response_code(409);
      echo json_encode(['error' => 'このメールアドレスはすでに登録されています。']);
    } elseif (strpos($e->getMessage(), 'uid') !== false) {
      http_response_code(409);
      echo json_encode(['error' => 'このUIDはすでに登録されています。']);
    } else {
      http_response_code(409);
      echo json_encode(['error' => '重複したデータが存在します。']);
    }
  } else {
    http_response_code(500);
    echo json_encode([
      'error' => 'ユーザー登録に失敗しました。',
      'message' => $e->getMessage()
    ]);
  }
} catch (Exception $e) {
  // 予期しない例外（PDO以外）
  http_response_code(500);
  echo json_encode([
    'error' => '予期しないエラーが発生しました。',
    'message' => $e->getMessage()
  ]);
}
