<?php
function handlePDOException(PDOException $e): void
{
  http_response_code(500);
  echo json_encode([
    'error' => 'データベースエラーが発生しました。',
    'details' => $e->getMessage()
  ]);
  exit(1);
}

function handleException(Exception $e): void
{
  http_response_code(500);
  echo json_encode([
    'error' => 'サーバーエラーが発生しました。',
    'details' => $e->getMessage()
  ]);
  exit(1);
}

function respondValidationErrors(array $errors): void {
  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit(1);
  }
}
