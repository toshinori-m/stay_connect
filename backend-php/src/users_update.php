<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';

header('Content-Type: application/json');

if (!isset($_GET['route_params'][0])) {
  http_response_code(400);
  echo json_encode(['error' => 'ユーザーIDが指定されていません']);
  exit(1);
}
$userIdFromUrl = $_GET['route_params'][0];

try {
  $uid = authenticate_uid();
  $pdo = getPDO();

  $errors = [];

  // ユーザー認証
  $stmt = $pdo->prepare("SELECT id FROM users WHERE uid = :uid LIMIT 1");
  $stmt->execute([':uid' => $uid]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => ['user' => ['ユーザーが存在しません']]]);
    exit(1);
  }

  $userIdFromToken = $user['id'];
  if ((string)$userIdFromUrl !== (string)$userIdFromToken) {
    http_response_code(403);
    echo json_encode(['error' => '他人のプロフィールは更新できません']);
    exit(1);
  }

  // Reactから送信されるmultipart/form-data形式のデータを取得
  $userInput = $_POST['user'] ?? [];
  $data = [
    'name' => $userInput['name'] ?? '',
    'email' => $userInput['email'] ?? '',
    'birthday' => $userInput['birthday'] ?? '',
    'sex' => $userInput['sex'] ?? '',
    'self_introduction' => $userInput['self_introduction'] ?? '',
    'email_notification' => $userInput['email_notification'] ?? 'receives',
  ];

  $emailNotificationRaw = strtolower(trim($data['email_notification'] ?? ''));

  if ($emailNotificationRaw === 'receives' || $emailNotificationRaw === 'true') {
    $emailNotification = true;
  } elseif ($emailNotificationRaw === 'not_receive' || $emailNotificationRaw === 'false') {
    $emailNotification = false;
  } else {
    $errors['email_notification'][] = 'メール通知の値が不正です。';
    $emailNotification = null;
  }

  // バリデーション
  $name = trim($data['name']);
  if ($name === '') {
    $errors['name'][] = '名前を入力してください。';
  } elseif (mb_strlen($name) < 2) {
    $errors['name'][] = '名前は2文字以上で入力してください。';
  } elseif (mb_strlen($name) > 100) {
    $errors['name'][] = '名前は100文字以内で入力してください。';
  }

  if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'][] = 'メールアドレスの形式が不正です。';
  }

  $sexValue = $data['sex'];
  $sexInt = null;

  if ($sexValue === 'man') {
    $sexInt = 0;
  } elseif ($sexValue === 'woman') {
    $sexInt = 1;
  } else {
    $errors['sex'][] = '性別の値が不正です。';
  }

  // 画像の処理の前にログを出力（ここに追加）
  error_log("FILES LOG: " . print_r($_FILES, true));
  if (isset($_FILES['user']['name']['image'])) {
      error_log("画像ファイル名: " . $_FILES['user']['name']['image']);
      error_log("画像の一時パス: " . $_FILES['user']['tmp_name']['image']);
      error_log("画像のエラーコード: " . $_FILES['user']['error']['image']); // 0 = 成功
  }

  // 画像の処理
  $imagePath = null;
  if (isset($_FILES['user']['name']['image']) && $_FILES['user']['error']['image'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../public/uploads/';
    if (!is_dir($uploadDir)) {
      mkdir($uploadDir, 0755, true);
    }

    $ext = pathinfo($_FILES['user']['name']['image'], PATHINFO_EXTENSION);
    $filename = uniqid('user_', true) . '.' . $ext;
    $destination = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['user']['tmp_name']['image'], $destination)) {
      $imagePath = '/uploads/' . $filename;
    } else {
      $errors['image'][] = '画像のアップロードに失敗しました。';
    }
  }

  // エラーがあれば返す
  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit(1);
  }

  // SQL文構築
  $sql = "
    UPDATE users SET
      name = :name,
      email = :email,
      birthday = :birthday,
      sex = :sex,
      self_introduction = :self_introduction,
      email_notification = :email_notification,"
      . ($imagePath ? " image = :image," : "") . "
      updated_at = :updated_at
    WHERE id = :id
  ";

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

  // 実行
  $stmt = $pdo->prepare($sql);

  $stmt->bindValue(':name', $data['name']);
  $stmt->bindValue(':email', $data['email']);
  $stmt->bindValue(':birthday', $data['birthday']);
  $stmt->bindValue(':sex', $sexInt, PDO::PARAM_INT);
  $stmt->bindValue(':self_introduction', $data['self_introduction']);
  $stmt->bindValue(':email_notification', $emailNotification, PDO::PARAM_BOOL);
  $stmt->bindValue(':updated_at', (new DateTime())->format('Y-m-d H:i:s'));
  $stmt->bindValue(':id', $userIdFromToken, PDO::PARAM_INT);

  if ($imagePath) {
    $stmt->bindValue(':image', $imagePath);
  }

  $stmt->execute();

  http_response_code(200);
  echo json_encode(['message' => 'ユーザー情報を更新しました']);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
