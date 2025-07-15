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
    echo json_encode(['error' => 'ユーザーが存在しません']);
    exit(1);
  }

  $recruitmentId = $_GET['route_params'][0] ?? null;

  if (!$recruitmentId) {
    http_response_code(400);
    echo json_encode(['error' => 'イベントIDが指定されていません']);
    exit(1);
  }

  $pdo->beginTransaction();

  // 中間テーブル削除
  RecruitmentDiscipline::deleteByRecruitmentId($pdo, $recruitmentId);
  RecruitmentTargetAge::deleteByRecruitmentId($pdo, $recruitmentId);

  // 所有者確認 + 本体削除
  $deleted = Recruitment::deleteByIdAndUserId($pdo, $recruitmentId, $user['id']);

  if (!$deleted) {
    $pdo->rollBack();
    http_response_code(404);
    echo json_encode(['error' => '削除対象が存在しないか、権限がありません']);
    exit(1);
  }

  $pdo->commit();

  // 最新のイベント一覧を返却
  $recruitments = Recruitment::fetchAllByUserId($pdo, $user['id']);
  echo json_encode($recruitments);

} catch (PDOException $e) {
  $pdo->rollBack();
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
