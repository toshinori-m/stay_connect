<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';

header('Content-Type: application/json');

$uid = authenticate_uid();

try {
  $pdo = getPDO();

  $input = json_decode(file_get_contents("php://input"), true);

  if (!$input || !isset($input['recruitment'])) {
    http_response_code(400);
    echo json_encode(['error' => ['base' => ['リクエスト形式が不正です']]]);
    exit(1);
  }

  $data = $input['recruitment'];
  $errors = [];

  // enum変換: sex
  $sexMap = [
    'man' => 0,
    'woman' => 1,
    'mix' => 2,
    'man_and_woman' => 3,
  ];
  $sexValue = $sexMap[$data['sex']] ?? null;

  // 必須項目バリデーション
  if (empty($data['sports_type_id'])) {
    $errors['sports_type_id'][] = "競技名を選択してください。";
  } else {
    $sportsTypeId = $data['sports_type_id'];

    // 種目が存在するかチェック
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM sports_disciplines WHERE sports_type_id = :sports_type_id");
    $stmt->execute([':sports_type_id' => $sportsTypeId]);
    $disciplineCount = $stmt->fetchColumn();

    // 種目が存在する競技の場合、選択されているかをチェック
    if ($disciplineCount > 0 && empty($data['sports_discipline_ids'])) {
      $errors['sports_discipline_ids'][] = "種目名を選択してください。";
    }
  }
  if (empty($data['prefecture_id']))         $errors['prefecture_id'][] = "都道府県を選択してください。";
  if (empty($data['target_age_ids']))        $errors['target_age_ids'][] = "対象年齢を選択してください。";
  if (empty(trim($data['name'] ?? '')))      $errors['name'][] = "イベント名を入力してください。";
  if (mb_strlen($data['name'] ?? '') > 255)  $errors['name'][] = "イベント名は255文字以内で入力してください。";
  if (empty(trim($data['area'] ?? '')))      $errors['area'][] = "イベント開催場所を入力してください。";
  if (mb_strlen($data['area'] ?? '') > 255)  $errors['area'][] = "イベント開催場所は255文字以内で入力してください。";
  if ($sexValue === null)                    $errors['sex'][] = "性別を選択してください。";
  if (!isset($data['number']) || !is_numeric($data['number']) || $data['number'] < 1) {
    $errors['number'][] = "募集チーム数は1以上の数値を入力してください。";
  }
  if (empty(trim($data['purpose_body'] ?? ''))) {
    $errors['purpose_body'][] = "イベント目的を入力してください。";
  }

  // 日付のチェック
  try {
    $today = new DateTime('today');
    $startDate = new DateTime($data['start_date'] ?? '');
    $endDate   = new DateTime($data['end_date'] ?? '');

    if ($startDate < $today) {
      $errors['start_date'][] = "開始日は今日以降の日付を選択してください。";
    }
    if ($endDate < $today) {
      $errors['end_date'][] = "終了日は今日以降の日付を選択してください。";
    }
    if ($endDate < $startDate) {
      $errors['end_date'][] = "終了日は開始日以降の日付を選択してください。";
    }
  } catch (Exception $e) {
    $errors['start_date'][] = "開始日または終了日が不正です。";
  }

  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['error' => $errors]);
    exit(1);
  }

  $pdo->beginTransaction();
  $stmt = $pdo->prepare("SELECT id FROM users WHERE uid = :uid LIMIT 1");
  $stmt->execute([':uid' => $uid]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  $now = (new DateTime())->format('Y-m-d H:i:s');

  if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => ['user' => ['ユーザーが存在しません']]]);
    exit(1);
  }

  $userId = $user['id'];

  // recruitments テーブルへ登録
  $stmt = $pdo->prepare("
    INSERT INTO recruitments (
      user_id, sports_type_id, prefecture_id,
      name, image, area, sex,
      start_date, end_date, number,
      purpose_body, other_body,
      created_at, updated_at
    ) VALUES (
      :user_id, :sports_type_id, :prefecture_id,
      :name, :image, :area, :sex,
      :start_date, :end_date, :number,
      :purpose_body, :other_body,
      :created_at, :updated_at
    )
  ");
  $stmt->execute([
    ':user_id' => $userId,
    ':sports_type_id' => $data['sports_type_id'],
    ':prefecture_id' => $data['prefecture_id'],
    ':name' => $data['name'],
    ':image' => $data['image'] ?? null,
    ':area' => $data['area'],
    ':sex' => $sexValue,
    ':start_date' => $startDate->format('Y-m-d'),
    ':end_date' => $endDate->format('Y-m-d'),
    ':number' => $data['number'],
    ':purpose_body' => $data['purpose_body'],
    ':other_body' => $data['other_body'] ?? null,
    ':created_at' => $now,
    ':updated_at' => $now,
  ]);

  $recruitmentId = $pdo->lastInsertId();

  // 中間テーブル: sports_disciplines
  $stmtDiscipline = $pdo->prepare("
    INSERT INTO recruitment_sports_disciplines (recruitment_id, sports_discipline_id, created_at, updated_at)
    VALUES (:recruitment_id, :sports_discipline_id, :created_at, :updated_at)
  ");
  foreach ($data['sports_discipline_ids'] as $id) {
    $stmtDiscipline->execute([
      ':recruitment_id' => $recruitmentId,
      ':sports_discipline_id' => $id,
      ':created_at' => $now,
      ':updated_at' => $now,
    ]);
  }

  // 中間テーブル: target_ages
  $stmtAge = $pdo->prepare("
    INSERT INTO recruitment_target_ages (recruitment_id, target_age_id, created_at, updated_at)
    VALUES (:recruitment_id, :target_age_id, :created_at, :updated_at)
  ");
  foreach ($data['target_age_ids'] as $id) {
    $stmtAge->execute([
      ':recruitment_id' => $recruitmentId,
      ':target_age_id' => $id,
      ':created_at' => $now,
      ':updated_at' => $now,
    ]);
  }

  $pdo->commit();

  http_response_code(201);
  echo json_encode(['message' => 'イベントが登録されました', 'recruitment_id' => $recruitmentId]);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
