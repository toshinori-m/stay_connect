<?php
class TeamDiscipline
{
  public static function create(PDO $pdo, int $teamId, array $disciplineIds, string $now): void
  {
    if (empty($disciplineIds)) return;

    $placeholders = [];
    $params = [];

    foreach ($disciplineIds as $id) {
      $placeholders[] = "(?, ?, ?, ?)";
      $params[] = $teamId;
      $params[] = $id;
      $params[] = $now;
      $params[] = $now;
    }

    $sql = "
      INSERT INTO team_sports_disciplines
        (team_id, sports_discipline_id, created_at, updated_at)
      VALUES " . implode(", ", $placeholders);

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
  }

  public static function deleteByTeamId(PDO $pdo, int $teamId): void {
    $stmt = $pdo->prepare("DELETE FROM team_sports_disciplines WHERE team_id = :team_id");
    $stmt->execute([':team_id' => $teamId]);
  }
  
  public static function getIdsByTeamId(PDO $pdo, int $teamId): array {
    $stmt = $pdo->prepare("SELECT sports_discipline_id FROM team_sports_disciplines WHERE team_id = :team_id");
    $stmt->execute([':team_id' => $teamId]);
    return array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'sports_discipline_id');
  }
}
