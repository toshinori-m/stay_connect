<?php
function authenticate_uid(): string
{
  $uid = $_SERVER['HTTP_UID'] ?? null;

  if (!$uid) {
    http_response_code(401);
    echo json_encode(['error' => '認証情報が不足しています（uidが必要）']);
    exit(1);
  }

  return $uid;
}
