<?php
/**
 * multipart/form-dataの生データを解析し、連想配列に変換する。
 * テキストフィールドは文字列として、ファイルフィールドは一時保存パスを含む配列として返す。
 * 
 * @param string $rawData  リクエストボディの生データ
 * @param string $boundary Content-Typeのboundary
 * @return array.          パース済みのフォームデータ
 */
function parseMultipartFormData(string $rawData, string $boundary): array
{
  // boundaryで各partを分割
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
    // name, filename を正規表現で抽出
    if (!preg_match('/name="([^"]+)"(?:; filename="([^"]+)")?/', $headers['content-disposition'], $matches)) continue;

    $name = $matches[1];
    $filename = $matches[2] ?? null;

    if ($filename) {
      // ファイルの場合は一時ファイルとして保存
      $tmpPath = '/tmp/' . uniqid('upload_', true) . '_' . basename($filename);
      file_put_contents($tmpPath, rtrim($body, "\r\n"));

      $parsed[$name] = [
        'filename' => $filename,
        'tmp_path' => $tmpPath,
      ];
      continue;
    }

    // ファイルでなければテキストデータとして処理
    $value = rtrim($body, "\r\n");

    if (!isset($parsed[$name])) {
      $parsed[$name] = $value;
      continue;
    }

    if (!is_array($parsed[$name])) {
      $parsed[$name] = [$parsed[$name]];
    }

    $parsed[$name][] = $value;
  }

  return $parsed;
}
