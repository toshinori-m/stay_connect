<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/recruitment.php';
require_once __DIR__ . '/../model/recruitment_disciplines.php';
require_once __DIR__ . '/../model/recruitment_target_ages.php';
require_once __DIR__ . '/../model/team.php'; // SEX_MAPを使うため

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

  $recruitmentId = $_GET['route_params'][0] ?? null;
  if (!$recruitmentId) {
    http_response_code(400);
    echo json_encode(['error' => 'イベントIDが指定されていません']);
    exit;
  }

  // ユーザーが所有するイベントかを確認して取得
  $recruitment = Recruitment::findByIdAndUserId($pdo, $recruitmentId, $user['id']);
  if (!$recruitment) {
    http_response_code(404);
    echo json_encode(['error' => 'イベントが見つかりません']);
    exit;
  }

  // sexをキー名に戻す
  $recruitment['sex'] = array_flip(Team::SEX_MAP)[$recruitment['sex']] ?? '';

  // 中間テーブルのIDを取得
  $recruitment['sports_disciplines'] = RecruitmentDiscipline::getIdsByRecruitmentId($pdo, $recruitmentId);
  $recruitment['target_ages'] = RecruitmentTargetAge::getIdsByRecruitmentId($pdo, $recruitmentId);

  echo json_encode(['data' => $recruitment]);
} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
