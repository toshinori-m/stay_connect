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
    echo json_encode(['error' => 'ユーザーが存在しません']);
    exit(1);
  }

  $teamId = $_GET['route_params'][0] ?? null;
  if (!$teamId) {
    http_response_code(400);
    echo json_encode(['error' => 'チームIDが指定されていません']);
    exit(1);
  }

  $pdo->beginTransaction();

  // 中間テーブルを削除
  TeamDiscipline::deleteByTeamId($pdo, $teamId);
  TeamTargetAge::deleteByTeamId($pdo, $teamId);

  // 所有権チェックを含めた削除
  $deleted = Team::deleteByIdAndUserId($pdo, $teamId, $user['id']);

  $pdo->commit();

  if (!$deleted) {
    http_response_code(403);
    echo json_encode(['error' => '削除対象が存在しないか、権限がありません']);
    exit(1);
  }

  // 削除後のチーム一覧を返却（最大5件）
  $teams = Team::fetchAllByUserId($pdo, $user['id'], 5);
  echo json_encode($teams);
} catch (PDOException $e) {
  $pdo->rollBack();
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
