<?php
function loadEnv(string $path): array
{
  $vars = [];

  if (!file_exists($path)) {
    return $vars;
  }

  $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

  foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) {
      continue;
    }

    [$key, $value] = explode('=', $line, 2);
    $vars[trim($key)] = trim($value);
  }

  return $vars;
}
