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
}
