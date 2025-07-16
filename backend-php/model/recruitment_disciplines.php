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

  public static function deleteByRecruitmentId(PDO $pdo, int $recruitmentId): void {
    $stmt = $pdo->prepare("DELETE FROM recruitment_sports_disciplines WHERE recruitment_id = :recruitment_id");
    $stmt->execute([':recruitment_id' => $recruitmentId]);
  }

  public static function getIdsByRecruitmentId(PDO $pdo, int $recruitmentId): array {
    $stmt = $pdo->prepare("
      SELECT sd.id, sd.name
      FROM recruitment_sports_disciplines rd
      JOIN sports_disciplines sd ON rd.sports_discipline_id = sd.id
      WHERE rd.recruitment_id = :recruitment_id
    ");
    $stmt->execute([':recruitment_id' => $recruitmentId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
