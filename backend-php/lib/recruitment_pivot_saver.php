<?php
function saveRecruitmentPivots(PDO $pdo, int $recruitmentId, array $data, string $now): void {
  // sports_disciplines
  if (!empty($data['sports_discipline_ids'])) {
    $stmtDiscipline = $pdo->prepare("
      INSERT INTO recruitment_sports_disciplines (recruitment_id, sports_discipline_id, created_at, updated_at)
      VALUES (:recruitment_id, :sports_discipline_id, :created_at, :updated_at)
    ");
    foreach ($data['sports_discipline_ids'] as $id) {
      $stmtDiscipline->execute([
        ':recruitment_id' => $recruitmentId,
        ':sports_discipline_id' => $id,
        ':created_at' => $now,
        ':updated_at' => $now,
      ]);
    }
  }

  // target_ages
  if (!empty($data['target_age_ids'])) {
    $stmtAge = $pdo->prepare("
      INSERT INTO recruitment_target_ages (recruitment_id, target_age_id, created_at, updated_at)
      VALUES (:recruitment_id, :target_age_id, :created_at, :updated_at)
    ");
    foreach ($data['target_age_ids'] as $id) {
      $stmtAge->execute([
        ':recruitment_id' => $recruitmentId,
        ':target_age_id' => $id,
        ':created_at' => $now,
        ':updated_at' => $now,
      ]);
    }
  }
}
