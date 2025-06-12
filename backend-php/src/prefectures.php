<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/error_handler.php';

header('Content-Type: application/json');

try {
  $pdo = getPDO();

  $stmt = $pdo->query("SELECT id, name FROM prefectures");
  $prefectures = $stmt->fetchAll(PDO::FETCH_ASSOC);

  http_response_code(200);
  echo json_encode([
    'message' => '成功しました',
    'data' => $prefectures
  ]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
