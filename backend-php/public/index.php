<?php

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

header("Content-Type: application/json; charset=UTF-8");

if ($requestUri === '/users' && $requestMethod === 'POST') {
  require_once __DIR__ . '/../src/register.php';
} else {
  http_response_code(404);
  echo json_encode(['error' => 'Not Found']);
}
