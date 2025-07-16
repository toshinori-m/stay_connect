<?php
require_once __DIR__ . '/team.php';

class Recruitment
{
  public static function create(PDO $pdo, array $data, int $userId, int $sexValue, DateTime $startDate, DateTime $endDate, $now = null): int {
    $now = $now ?? date('Y-m-d H:i:s');

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

    return $pdo->lastInsertId();
  }

  public static function deleteByIdAndUserId(PDO $pdo, int $recruitmentId, int $userId): bool {
    $stmt = $pdo->prepare("DELETE FROM recruitments WHERE id = :id AND user_id = :user_id");
    $stmt->execute([':id' => $recruitmentId, ':user_id' => $userId]);
    return $stmt->rowCount() > 0;
  }

  public static function fetchAllByUserId(PDO $pdo, int $userId): array {
    $stmt = $pdo->prepare("SELECT id, name FROM recruitments WHERE user_id = :user_id ORDER BY id");
    $stmt->execute([':user_id' => $userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public static function findByIdAndUserId(PDO $pdo, int $id, int $userId): ?array {
    $stmt = $pdo->prepare("SELECT * FROM recruitments WHERE id = :id AND user_id = :user_id");
    $stmt->execute([':id' => $id, ':user_id' => $userId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ?: null;
  }
}
