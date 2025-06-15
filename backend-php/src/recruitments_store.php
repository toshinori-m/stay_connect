<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/recruitment.php';
require_once __DIR__ . '/../model/recruitment_disciplines.php';
require_once __DIR__ . '/../model/recruitment_target_ages.php';

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

  $now = (new DateTime())->format('Y-m-d H:i:s');
  $userId = $user['id'];
  $input = json_decode(file_get_contents("php://input"), true);

  if (!$input || !isset($input['recruitment'])) {
    http_response_code(400);
    echo json_encode(['error' => ['base' => ['リクエスト形式が不正です']]]);
    exit(1);
  }

  $data = $input['recruitment'];

  $validation = Recruitment::validate($data, $pdo);
  $errors = $validation['errors'];
  $sexValue = $validation['sexValue'];
  $startDate = $validation['startDate'];
  $endDate = $validation['endDate'];

  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['error' => $errors]);
    exit(1);
  }

  $pdo->beginTransaction();

  // メインテーブル登録
  $recruitmentId = Recruitment::create($pdo, $data, $userId, $sexValue, $startDate, $endDate, $now);

  // 中間テーブル登録
  RecruitmentDiscipline::insert($pdo, $recruitmentId, $data['sports_discipline_ids'] ?? [], $now);
  RecruitmentTargetAge::insert($pdo, $recruitmentId, $data['target_age_ids'] ?? [], $now);

  $pdo->commit();

  http_response_code(201);
  echo json_encode(['message' => 'イベントが登録されました', 'recruitment_id' => $recruitmentId]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
