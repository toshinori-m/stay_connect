<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../lib/formdata_parser.php';
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
    echo json_encode(['error' => 'ユーザーが存在しません']);
    exit;
  }

  $teamId = $_GET['route_params'][0] ?? null;
  if (!$teamId) {
    http_response_code(400);
    echo json_encode(['error' => 'チームIDが指定されていません']);
    exit;
  }

  $team = Team::findByIdAndUserId($pdo, $teamId, $user['id']);
  if (!$team) {
    http_response_code(404);
    echo json_encode(['error' => 'チームが見つかりません']);
    exit;
  }

  // multipart/form-data 対応：rawデータをパース
  $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
  if (!preg_match('/boundary=(.*)$/', $contentType, $matches)) {
    http_response_code(400);
    echo json_encode(['error' => 'boundary が見つかりません']);
    exit;
  }
  $boundary = $matches[1];
  $rawData = file_get_contents('php://input');
  $parsed = parseMultipartFormData($rawData, $boundary);

  // team[...] の形式から抽出
  $data = [];
  foreach ($parsed as $key => $val) {
    if (preg_match('/^team\[(.+?)\]$/', $key, $m)) {
      $data[$m[1]] = $val;
    }
  }

  // 配列項目の取得（複数選択）
  $data['sports_discipline_ids'] = $parsed['team[sports_discipline_ids][]'] ?? [];
  $data['target_age_ids'] = $parsed['team[target_age_ids][]'] ?? [];

  // 単一値が string の場合、配列に変換
  if (!is_array($data['sports_discipline_ids'])) {
    $data['sports_discipline_ids'] = [$data['sports_discipline_ids']];
  }
  if (!is_array($data['target_age_ids'])) {
    $data['target_age_ids'] = [$data['target_age_ids']];
  }

  $validation = Team::validate($data, $pdo);
  $errors = $validation['errors'];
  $sexValue = $validation['sexValue'];

  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['error' => $errors]);
    exit;
  }

  $pdo->beginTransaction();

  Team::update($pdo, $teamId, $data, $sexValue);
  TeamDiscipline::deleteByTeamId($pdo, $teamId);
  TeamDiscipline::create($pdo, $teamId, $data['sports_discipline_ids']);
  TeamTargetAge::deleteByTeamId($pdo, $teamId);
  TeamTargetAge::create($pdo, $teamId, $data['target_age_ids']);

  $pdo->commit();

  http_response_code(200);
  echo json_encode(['message' => 'チーム情報を更新しました']);
  exit;

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
