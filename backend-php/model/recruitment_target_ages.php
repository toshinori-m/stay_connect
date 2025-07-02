<?php
class RecruitmentTargetAge
{
  public static function insert(PDO $pdo, int $recruitmentId, array $targetAgeIds, string $now): void {
    if (empty($targetAgeIds)) return;

    $placeholders = [];
    $params = [];

    foreach ($targetAgeIds as $index => $id) {
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
