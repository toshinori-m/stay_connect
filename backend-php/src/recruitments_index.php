<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/recruitment.php';

header('Content-Type: application/json');
$uid = authenticate_uid();

try {
  $pdo = getPDO();
  $user = findUserByUid($pdo, $uid);

  if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'ユーザーが存在しません']);
    exit(1);
  }

  $recruitments = Recruitment::fetchAllByUserId($pdo, $user['id']);
  echo json_encode(['data' => $recruitments]);
} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
