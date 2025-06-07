<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';

header('Content-Type: application/json');

$uid = authenticate_uid();

try {
    $pdo = getPDO();

    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE uid = :uid LIMIT 1");
    $stmt->execute([':uid' => $uid]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'ユーザーが見つかりません']);
        exit;
    }

    http_response_code(200);
    echo json_encode($user);
    exit(0);

} catch (PDOException $e) {
  // SELECT文でも予期せぬDB接続エラーなどがあり得るので明示
  http_response_code(500);
  echo json_encode([
      'error' => 'データベースエラーが発生しました。',
      'details' => $e->getMessage()
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
      'error' => 'サーバーエラーが発生しました。',
      'details' => $e->getMessage()
  ]);
}
