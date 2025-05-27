<?php
$host = 'db';
$dbname = 'myapp_development';
$user = 'postgres';
$password = 'password';

try {
  $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $pdo;
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    'error' => 'DB接続に失敗しました。',
    'message' => $e->getMessage()
  ]);
  exit;
}
