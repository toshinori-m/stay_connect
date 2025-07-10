<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/team.php';
require_once __DIR__ . '/../model/team_disciplines.php';
require_once __DIR__ . '/../model/team_target_ages.php';
require_once __DIR__ . '/../model/team.php';

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

  // ユーザーが所有するチームかを確認して取得
  $team = Team::findByIdAndUserId($pdo, $teamId, $user['id']);
  if (!$team) {
    http_response_code(404);
    echo json_encode(['error' => 'チームが見つかりません']);
    exit;
  }

  $team['sex'] = array_flip(Team::SEX_MAP)[$team['sex']] ?? '';

  // 中間テーブルのIDも取得
  $team['sports_disciplines'] = TeamDiscipline::getIdsByTeamId($pdo, $teamId);
  $team['target_ages'] = TeamTargetAge::getIdsByTeamId($pdo, $teamId);

  echo json_encode(['data' => $team]);
} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
