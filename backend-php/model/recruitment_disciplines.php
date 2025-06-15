<?php
class RecruitmentDiscipline
{
  public static function insert(PDO $pdo, int $recruitmentId, array $disciplineIds, string $now): void {
    if (empty($disciplineIds)) return;

    $stmt = $pdo->prepare("
      INSERT INTO recruitment_sports_disciplines (recruitment_id, sports_discipline_id, created_at, updated_at)
      VALUES (:recruitment_id, :sports_discipline_id, :created_at, :updated_at)
    ");

    foreach ($disciplineIds as $id) {
      $stmt->execute([
        ':recruitment_id' => $recruitmentId,
        ':sports_discipline_id' => $id,
        ':created_at' => $now,
        ':updated_at' => $now,
      ]);
    }
  }
}
