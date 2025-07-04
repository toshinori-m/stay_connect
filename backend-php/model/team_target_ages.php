<?php
class TeamTargetAge
{
  public static function insert(PDO $pdo, int $teamId, array $targetAgeIds, string $now): void {
    if (empty($targetAgeIds)) return;

    $placeholders = [];
    $params = [];

    foreach ($targetAgeIds as $id) {
      $placeholders[] = "(?, ?, ?, ?)";
      $params[] = $teamId;
      $params[] = $id;
      $params[] = $now;
      $params[] = $now;
    }

    $sql = "
      INSERT INTO team_target_ages
        (team_id, target_age_id, created_at, updated_at)
      VALUES " . implode(", ", $placeholders);

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
  }
}
