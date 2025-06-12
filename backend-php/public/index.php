<?php

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

header("Content-Type: application/json; charset=UTF-8");

$routes = [
  'POST' => [
    '/users' => __DIR__ . '/../src/register.php',
  ],
  'GET' => [
    '/users/me' => __DIR__ . '/../src/users_me.php',
    '/sports_types' => __DIR__ . '/../src/sports_types.php',
    '/sports_disciplines' => __DIR__ . '/../src/sports_disciplines.php',
    '/prefectures' => __DIR__ . '/../src/prefectures.php',
    '/target_ages' => __DIR__ . '/../src/target_ages.php',
    '/searches' => __DIR__ . '/../src/searches.php'
  ]
];

if (isset($routes[$requestMethod][$requestUri])) {
  require_once $routes[$requestMethod][$requestUri];
} else {
  http_response_code(404);
  echo json_encode(['error' => 'Not Found']);
  exit(1);
}
