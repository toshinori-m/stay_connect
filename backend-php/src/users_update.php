<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';
require_once __DIR__ . '/../model/user.php';
require_once __DIR__ . '/../lib/image_handler.php';
require_once __DIR__ . '/../lib/formdata_parser.php';

header('Content-Type: application/json');
$uid = authenticate_uid();

try {
  $pdo = getPDO();
  $user = findUserByUid($pdo, $uid);

  if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => ['user' => ['ユーザーが存在しません']]]);
    exit(1);
  }

  if (!isset($_GET['route_params'][0])) {
    http_response_code(400);
    echo json_encode(['error' => 'ユーザーIDが指定されていません']);
    exit(1);
  }

  $userIdFromUrl = $_GET['route_params'][0];
  $userIdFromToken = $user['id'];

  if ((string)$userIdFromUrl !== (string)$userIdFromToken) {
    http_response_code(403);
    echo json_encode(['error' => '他人のプロフィールは更新できません']);
    exit(1);
  }

  // PATCH + multipart/form-data を手動でパース
  $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
  if (!preg_match('/boundary=(.*)$/', $contentType, $matches)) {
    http_response_code(400);
    echo json_encode(['error' => 'boundary が見つかりません']);
    exit(1);
  }
  $boundary = $matches[1];
  $rawData = file_get_contents('php://input');
  $parsed = parseMultipartFormData($rawData, $boundary);

  // user[...] の形式を再構成
  $userInput = [];
  foreach ($parsed as $key => $val) {
    if (preg_match('/^user\[(.+)\]$/', $key, $m)) {
      $userInput[$m[1]] = $val;
    }
  }

  $data = buildUserData($userInput);

  $errors = [];
  $emailNotification = convertToEmailNotificationFlag($data['email_notification'], $errors);

  // バリデーション
  $errors = User::validateProfile($data);

  $sexInt = convertSexToInt($data['sex'], $errors);

  // 画像の処理
  $imagePath = null;
  if (isset($userInput['image']['tmp_path'])) {
    $imagePath = storeUploadedFileLocally($userInput['image']);
    if (!$imagePath) {
      $errors['image'][] = '画像のアップロードに失敗しました。';
    }
  }

  // エラーがあれば返す
  handleValidationErrors($errors);

  $data['sex'] = $sexInt;
  $data['email_notification'] = $emailNotification;
  $data['image'] = $imagePath ?? null;

  // SQL文構築
  User::update($pdo, $userIdFromToken, $data);

  // パラメータ
  $params = [
    ':name' => $data['name'],
    ':email' => $data['email'],
    ':birthday' => $data['birthday'],
    ':sex' => $sexInt,
    ':self_introduction' => $data['self_introduction'],
    ':email_notification' => $emailNotification === true ? true : false,
    ':updated_at' => (new DateTime())->format('Y-m-d H:i:s'),
    ':id' => $userIdFromToken,
  ];
  if ($imagePath) {
    $params[':image'] = $imagePath;
  }

  http_response_code(200);
  echo json_encode(['message' => 'ユーザー情報を更新しました']);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}

function buildUserData(array $userInput): array {
  return [
    'name' => $userInput['name'] ?? '',
    'email' => $userInput['email'] ?? '',
    'birthday' => $userInput['birthday'] ?? '',
    'sex' => $userInput['sex'] ?? '',
    'self_introduction' => $userInput['self_introduction'] ?? '',
    'email_notification' => $userInput['email_notification'] ?? 'receives',
  ];
}

function convertToEmailNotificationFlag(string $raw): bool {
  $val = strtolower(trim($raw));
  if (in_array($val, ['receives', 'true'], true)) return true;
  if (in_array($val, ['not_receive', 'false'], true)) return false;

  throw new InvalidArgumentException("Invalid email notification value: $raw");
}

function convertSexToInt(string $sex, array &$errors): ?int {
  if ($sex === 'man') return 0;
  if ($sex === 'woman') return 1;
  $errors['sex'][] = '性別の値が不正です。';
  return null;
}
