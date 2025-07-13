<?php
class TeamUtil
{
  public static function validate(array $data, PDO $pdo): array {
    $errors = [];

    // enum変換: sex
    $sexMap = [
      'man' => 0,
      'woman' => 1,
      'mix' => 2,
      'man_and_woman' => 3,
    ];
    $sexValue = $sexMap[$data['sex']] ?? null;

    // 必須チェックと長さ制限
    if (empty(trim($data['name'] ?? ''))) {
      $errors['name'][] = "チーム名を入力してください。";
    } elseif (mb_strlen($data['name']) > 255) {
      $errors['name'][] = "チーム名は255文字以内で入力してください。";
    }

    if (empty(trim($data['area'] ?? ''))) {
      $errors['area'][] = "活動地域を入力してください。";
    } elseif (mb_strlen($data['area']) > 255) {
      $errors['area'][] = "活動地域は255文字以内で入力してください。";
    }

    if ($sexValue === null) {
      $errors['sex'][] = "性別を選択してください。";
    }

    if (empty(trim($data['track_record'] ?? ''))) {
      $errors['track_record'][] = "活動実績を入力してください。";
    } elseif (mb_strlen($data['track_record']) > 255) {
      $errors['track_record'][] = "活動実績は255文字以内で入力してください。";
    }

    if (!empty($data['other_body']) && mb_strlen($data['other_body']) > 255) {
      $errors['other_body'][] = "その他は255文字以内で入力してください。";
    }

    if (empty($data['sports_type_id'])) {
      $errors['sports_type_id'][] = "競技を選択してください。";
    }

    if (empty($data['prefecture_id'])) {
      $errors['prefecture_id'][] = "都道府県を選択してください。";
    }

    // sports_type_id のバリデーションと関連種目の存在確認
    if (!empty($data['sports_type_id'])) {
      $stmt = $pdo->prepare("SELECT COUNT(*) FROM sports_disciplines WHERE sports_type_id = :id");
      $stmt->execute([':id' => $data['sports_type_id']]);
      $count = $stmt->fetchColumn();

      if ($count > 0 && empty($data['sports_discipline_ids'])) {
        $errors['sports_discipline_ids'][] = "種目を選択してください。";
      }
    }

    if (empty($data['target_age_ids']) || !is_array($data['target_age_ids']) || count($data['target_age_ids']) === 0) {
      $errors['target_age_ids'][] = "対象年齢を選択してください。";
    }

    return [
      'errors' => $errors
    ];
  }
}
