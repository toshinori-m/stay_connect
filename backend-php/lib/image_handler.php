<?php
function saveUploadedImage(array $image): ?string
{
  $uploadDir = __DIR__ . '/../public/uploads/';
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
  }

  $ext = pathinfo($image['filename'], PATHINFO_EXTENSION);
  $filename = uniqid('user_', true) . '.' . $ext;
  $destination = $uploadDir . $filename;

  if (rename($image['tmp_path'], $destination)) {
    return '/uploads/' . $filename;
  }

  return null;
}
