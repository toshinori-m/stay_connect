<?php
class RecruitmentTargetAge
{
  public static function insert(PDO $pdo, int $recruitmentId, array $targetAgeIds, string $now): void {
    if (empty($targetAgeIds)) return;

    $stmt = $pdo->prepare("
      INSERT INTO recruitment_target_ages (recruitment_id, target_age_id, created_at, updated_at)
      VALUES (:recruitment_id, :target_age_id, :created_at, :updated_at)
    ");

    foreach ($targetAgeIds as $id) {
      $stmt->execute([
        ':recruitment_id' => $recruitmentId,
        ':target_age_id' => $id,
        ':created_at' => $now,
        ':updated_at' => $now,
      ]);
    }
  }
}
