<?php
function parseMultipartFormData(string $rawData, string $boundary): array
{
  $parts = explode('--' . $boundary, $rawData);
  array_shift($parts);
  array_pop($parts);

  $parsed = [];

  foreach ($parts as $part) {
    if (empty(trim($part))) continue;

    list($rawHeaders, $body) = explode("\r\n\r\n", $part, 2);
    $headers = [];
    foreach (explode("\r\n", trim($rawHeaders)) as $line) {
      if (strpos($line, ':') === false) continue;
      list($k, $v) = explode(':', $line, 2);
      $headers[strtolower(trim($k))] = trim($v);
    }

    if (!isset($headers['content-disposition'])) continue;
    if (!preg_match('/name="([^"]+)"(?:; filename="([^"]+)")?/', $headers['content-disposition'], $matches)) continue;

    $name = $matches[1];
    $filename = $matches[2] ?? null;

    if ($filename) {
      $tmpPath = '/tmp/' . uniqid('upload_', true) . '_' . basename($filename);
      file_put_contents($tmpPath, rtrim($body, "\r\n"));
      $parsed[$name] = [
        'filename' => $filename,
        'tmp_path' => $tmpPath,
      ];
    } else {
      $parsed[$name] = rtrim($body, "\r\n");
    }
  }

  return $parsed;
}
