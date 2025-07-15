<?php
class RecruitmentTargetAge
{
  public static function create(PDO $pdo, int $recruitmentId, array $targetAgeIds, $now = null): void {
    if (empty($targetAgeIds)) return;

    $now = $now ?? date('Y-m-d H:i:s');
    $placeholders = [];
    $params = [];

    foreach ($targetAgeIds as $id) {
      $placeholders[] = "(?, ?, ?, ?)";
      $params[] = $recruitmentId;
      $params[] = $id;
      $params[] = $now;
      $params[] = $now;
    }

    $sql = "
      INSERT INTO recruitment_target_ages
        (recruitment_id, target_age_id, created_at, updated_at)
      VALUES " . implode(", ", $placeholders);

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
  }

  public static function deleteByRecruitmentId(PDO $pdo, int $recruitmentId): void {
    $stmt = $pdo->prepare("DELETE FROM recruitment_target_ages WHERE recruitment_id = :recruitment_id");
    $stmt->execute([':recruitment_id' => $recruitmentId]);
  }
  
  public static function getIdsByRecruitmentId(PDO $pdo, int $recruitmentId): array {
    $stmt = $pdo->prepare("
      SELECT ta.id, ta.name
      FROM recruitment_target_ages rta
      JOIN target_ages ta ON rta.target_age_id = ta.id
      WHERE rta.recruitment_id = :recruitment_id
    ");
    $stmt->execute([':recruitment_id' => $recruitmentId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
