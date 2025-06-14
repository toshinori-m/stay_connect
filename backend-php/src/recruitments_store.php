<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../lib/validate_recruitments.php';
require_once __DIR__ . '/../lib/recruitment_pivot_saver.php';
require_once __DIR__ . '/../lib/recruitment_repository.php';

header('Content-Type: application/json');

$uid = authenticate_uid();

try {
  $pdo = getPDO();

  $input = json_decode(file_get_contents("php://input"), true);

  if (!$input || !isset($input['recruitment'])) {
    http_response_code(400);
    echo json_encode(['error' => ['base' => ['リクエスト形式が不正です']]]);
    exit(1);
  }

  $data = $input['recruitment'];

  $validation = validateRecruitment($data, $pdo);
  $errors = $validation['errors'];
  $sexValue = $validation['sexValue'];
  $startDate = $validation['startDate'];
  $endDate = $validation['endDate'];

  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['error' => $errors]);
    exit(1);
  }

  $stmt = $pdo->prepare("SELECT id FROM users WHERE uid = :uid LIMIT 1");
  $stmt->execute([':uid' => $uid]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  $now = (new DateTime())->format('Y-m-d H:i:s');

  if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => ['user' => ['ユーザーが存在しません']]]);
    exit(1);
  }

  $pdo->beginTransaction();
  $userId = $user['id'];

  // recruitments テーブルへ登録
  $recruitmentId = insertRecruitment($pdo, $data, $userId, $sexValue, $startDate, $endDate, $now);

 // 中間テーブル
  saveRecruitmentPivots($pdo, $recruitmentId, $data, $now);

  $pdo->commit();

  http_response_code(201);
  echo json_encode(['message' => 'イベントが登録されました', 'recruitment_id' => $recruitmentId]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
