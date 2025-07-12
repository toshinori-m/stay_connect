<?php
class Team
{
  public const SEX_MAP = [
    'man' => 0,
    'woman' => 1,
    'mix' => 2,
    'man_and_woman' => 3,
  ];
  
  public static function validate(array $data, PDO $pdo): array {
    $errors = [];
    $sexValue = Team::SEX_MAP[$data['sex']] ?? null;

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
      'errors' => $errors,
      'sexValue' => $sexValue
    ];
  }

  public static function create(PDO $pdo, array $data, int $userId, int $sexValue, $now = null): int {
    $now = $now ?? date('Y-m-d H:i:s');

    $stmt = $pdo->prepare("
      INSERT INTO teams (
        user_id, name, area, sex,
        track_record, other_body,
        sports_type_id, prefecture_id,
        created_at, updated_at
      ) VALUES (
        :user_id, :name, :area, :sex,
        :track_record, :other_body,
        :sports_type_id, :prefecture_id,
        :created_at, :updated_at
      )
    ");

    $stmt->execute([
      ':user_id' => $userId,
      ':name' => $data['name'],
      ':area' => $data['area'],
      ':sex' => $sexValue,
      ':track_record' => $data['track_record'],
      ':other_body' => $data['other_body'] ?? null,
      ':sports_type_id' => $data['sports_type_id'],
      ':prefecture_id' => $data['prefecture_id'],
      ':created_at' => $now,
      ':updated_at' => $now,
    ]);

    return (int)$pdo->lastInsertId();
  }

  public static function fetchAllByUserId(PDO $pdo, int $userId, int $limit = 5): array {
    $stmt = $pdo->prepare("SELECT id, name FROM teams WHERE user_id = :user_id ORDER BY id LIMIT :limit");
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public static function deleteByIdAndUserId(PDO $pdo, int $teamId, int $userId): bool {
    $stmt = $pdo->prepare("DELETE FROM teams WHERE id = :id AND user_id = :user_id");
    $stmt->execute([':id' => $teamId, ':user_id' => $userId]);
    return $stmt->rowCount() > 0;
  }

  public static function findByIdAndUserId(PDO $pdo, int $teamId, int $userId): ?array {
    $stmt = $pdo->prepare("SELECT id, name, sports_type_id, sex, area, prefecture_id, track_record, other_body FROM teams WHERE id = :id AND user_id = :user_id");
    $stmt->execute([':id' => $teamId, ':user_id' => $userId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ?: null;
  }

  public static function update(PDO $pdo, int $teamId, array $data, int $sexValue, $now = null): void {
    $now = $now ?? date('Y-m-d H:i:s');

    $stmt = $pdo->prepare("
      UPDATE teams SET
        name = :name,
        area = :area,
        sex = :sex,
        track_record = :track_record,
        other_body = :other_body,
        sports_type_id = :sports_type_id,
        prefecture_id = :prefecture_id,
        updated_at = :updated_at
      WHERE id = :id
    ");

    $stmt->execute([
      ':name' => $data['name'],
      ':area' => $data['area'],
      ':sex' => $sexValue,
      ':track_record' => $data['track_record'],
      ':other_body' => $data['other_body'] ?? null,
      ':sports_type_id' => $data['sports_type_id'],
      ':prefecture_id' => $data['prefecture_id'],
      ':updated_at' => $now,
      ':id' => $teamId
    ]);
  }
}
