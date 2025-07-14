<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/User.php';

header('Content-Type: application/json');
$uid = authenticate_uid();

try {
  $pdo = getPDO();
  $user = findUserByUid($pdo, $uid);

  if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => ['user' => ['ユーザーが存在しません']]]);
    exit(1);
  }

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
  $response = [
    'id' => (int)$user['id'],
    'name' => $user['name'],
    'email' => $user['email'],
    'uid' => $user['uid'],
    'birthday' => $user['birthday'],
    'sex' => (int)$user['sex'] === 0 ? 'man' : 'woman',
    'self_introduction' => $user['self_introduction'],
    'email_notification' => $user['email_notification'] ? 'receives' : 'not_receive',
    'image_url' => $user['image_url'] ?? null,
  ];

  http_response_code(200);
  echo json_encode(['data' => $response]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
