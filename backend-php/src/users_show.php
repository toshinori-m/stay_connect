<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/User.php';

header('Content-Type: application/json');

try {
  $pdo = getPDO();

  // URLパラメータから id を取得
  if (!isset($_GET['route_params'][0])) {
    http_response_code(400);
    echo json_encode(['error' => 'ユーザーIDが指定されていません']);
    exit(1);
  }

  $userId = $_GET['route_params'][0];
  // DBからユーザー情報を取得
  $user = User::findByUid($pdo, $userId);

  if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'ユーザーが見つかりません']);
    exit(1);
  }

  // 必要な情報のみ返却
  $formattedUser = User::formatUserData($user);

  http_response_code(200);
  echo json_encode(['data' => $formattedUser]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
