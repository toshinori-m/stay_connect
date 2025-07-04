<?php
require_once __DIR__ . '/env.php';

$env = loadEnv(__DIR__ . '/../.env');

function getPDO(): PDO
{
  global $env;

  $host = $env['DB_HOST'] ?? 'localhost';
  $dbname = $env['DB_NAME'] ?? '';
  $user = $env['DB_USER'] ?? '';
  $password = $env['DB_PASSWORD'] ?? '';

  try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
  } catch (PDOException $e) {
    throw $e;
  } catch (Exception $e) {
    throw $e;
  }
}
