<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/error_handler.php';

header('Content-Type: application/json');

try {
  $pdo = getPDO();

  // パラメータの取得とバリデーション
  $sportsTypeId = isset($_GET['sports_type_id']) ? $_GET['sports_type_id'] : null;

  if (!$sportsTypeId || !is_numeric($sportsTypeId)) {
    http_response_code(400);
    echo json_encode(['message' => 'sports_type_idを指定してください']);
    exit(1);
  }

  // 絞り込みクエリ実行
  $stmt = $pdo->prepare("SELECT id, name, sports_type_id FROM sports_disciplines WHERE sports_type_id = :sports_type_id");
  $stmt->execute([':sports_type_id' => $sportsTypeId]);
  $sportsDisciplines = $stmt->fetchAll(PDO::FETCH_ASSOC);

  http_response_code(200);
  echo json_encode([
    'message' => '成功しました',
    'data' => $sportsDisciplines ?: []
  ]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
