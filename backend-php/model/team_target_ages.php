<?php
class TeamTargetAge
{
  public static function create(PDO $pdo, int $teamId, array $targetAgeIds, string $now): void
  {
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

  public static function deleteByTeamId(PDO $pdo, int $teamId): void {
    $stmt = $pdo->prepare("DELETE FROM team_target_ages WHERE team_id = :team_id");
    $stmt->execute([':team_id' => $teamId]);
  }

  public static function getIdsByTeamId(PDO $pdo, int $teamId): array {
    $stmt = $pdo->prepare("SELECT target_age_id FROM team_target_ages WHERE team_id = :team_id");
    $stmt->execute([':team_id' => $teamId]);
    return array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'target_age_id');
  }
}
