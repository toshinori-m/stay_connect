<?php
class Team
{
  public const SEX_MAP = [
    'man' => 0,
    'woman' => 1,
    'mix' => 2,
    'man_and_woman' => 3,
  ];
  
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
