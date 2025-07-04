<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/team.php';
require_once __DIR__ . '/../model/team_disciplines.php';
require_once __DIR__ . '/../model/team_target_ages.php';

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

  $input = json_decode(file_get_contents("php://input"), true);
  if (!$input || !isset($input['team'])) {
    http_response_code(400);
    echo json_encode(['error' => ['base' => ['リクエスト形式が不正です']]]);
    exit(1);
  }

  $data = $input['team'];
  $now = (new DateTime())->format('Y-m-d H:i:s');

  // バリデーション
  $validation = Team::validate($data, $pdo);
  $errors = $validation['errors'];
  $sexValue = $validation['sexValue'];

  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['error' => $errors]);
    exit(1);
  }

  $pdo->beginTransaction();

  // チーム登録
  $teamId = Team::create($pdo, $data, $user['id'], $sexValue, $now);

  // 中間テーブル登録
  TeamDiscipline::insert($pdo, $teamId, $data['sports_discipline_ids'] ?? [], $now);
  TeamTargetAge::insert($pdo, $teamId, $data['target_age_ids'] ?? [], $now);

  $pdo->commit();

  http_response_code(201);
  echo json_encode(['message' => 'チームが登録されました', 'team_id' => $teamId]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
