<?php
/**
 * 一時保存された画像ファイルを /public/uploads ディレクトリに移動し、
 * 保存後の公開パスを返す。
 * 
 * @param array $image 一時ファイルのパスと元のファイル名を含む配列
 * @return string|null 保存に成功した場合はファイルの公開パス、失敗した場合は null
 */
function storeUploadedFileLocally(array $image): ?string
{
  $uploadDir = __DIR__ . '/../public/uploads/';

  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
  }
  $ext = pathinfo($image['filename'], PATHINFO_EXTENSION);
  $filename = uniqid('user_', true) . '.' . $ext;
  $destination = $uploadDir . $filename;

  if (rename($image['tmp_path'], $destination)) {
    // 公開パスとして返す（例: /uploads/user_xxx.png）
    return '/uploads/' . $filename;
  }

  return null;
}
