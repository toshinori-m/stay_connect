<?php
class TeamDiscipline
{
  public static function insert(PDO $pdo, int $teamId, array $disciplineIds, string $now): void {
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
}
