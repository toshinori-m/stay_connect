<?php
function validateRecruitment(array $data, PDO $pdo): array {
  $errors = [];

  // enum変換: sex
  $sexMap = [
    'man' => 0,
    'woman' => 1,
    'mix' => 2,
    'man_and_woman' => 3,
  ];
  $sexValue = $sexMap[$data['sex']] ?? null;

  // sports_type_id のバリデーションと関連種目の存在確認
  if (empty($data['sports_type_id'])) {
    $errors['sports_type_id'][] = "競技名を選択してください。";
  } else {
    $sportsTypeId = $data['sports_type_id'];
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM sports_disciplines WHERE sports_type_id = :sports_type_id");
    $stmt->execute([':sports_type_id' => $sportsTypeId]);
    $disciplineCount = $stmt->fetchColumn();

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

  // 日付チェック
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

  return [
    'errors' => $errors,
    'sexValue' => $sexValue,
    'startDate' => $startDate,
    'endDate' => $endDate
  ];
}
