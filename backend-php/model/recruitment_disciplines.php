<?php
class RecruitmentDiscipline
{
  public static function create(PDO $pdo, int $recruitmentId, array $disciplineIds, $now = null): void {
    if (empty($disciplineIds)) return;

    $now = $now ?? date('Y-m-d H:i:s');
    $placeholders = [];
    $params = [];

    foreach ($disciplineIds as $id) {
      $placeholders[] = "(?, ?, ?, ?)";
      $params[] = $recruitmentId;
      $params[] = $id;
      $params[] = $now;
      $params[] = $now;
    }

    $sql = "
      INSERT INTO recruitment_sports_disciplines
        (recruitment_id, sports_discipline_id, created_at, updated_at)
      VALUES " . implode(", ", $placeholders);

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
  }
}
