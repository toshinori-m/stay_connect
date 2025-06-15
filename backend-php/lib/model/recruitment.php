<?php
function createRecruitment(PDO $pdo, array $data, int $userId, int $sexValue, DateTime $startDate, DateTime $endDate, string $now): int {
  $stmt = $pdo->prepare("
    INSERT INTO recruitments (
      user_id, sports_type_id, prefecture_id,
      name, image, area, sex,
      start_date, end_date, number,
      purpose_body, other_body,
      created_at, updated_at
    ) VALUES (
      :user_id, :sports_type_id, :prefecture_id,
      :name, :image, :area, :sex,
      :start_date, :end_date, :number,
      :purpose_body, :other_body,
      :created_at, :updated_at
    )
  ");

  $stmt->execute([
    ':user_id' => $userId,
    ':sports_type_id' => $data['sports_type_id'],
    ':prefecture_id' => $data['prefecture_id'],
    ':name' => $data['name'],
    ':image' => $data['image'] ?? null,
    ':area' => $data['area'],
    ':sex' => $sexValue,
    ':start_date' => $startDate->format('Y-m-d'),
    ':end_date' => $endDate->format('Y-m-d'),
    ':number' => $data['number'],
    ':purpose_body' => $data['purpose_body'],
    ':other_body' => $data['other_body'] ?? null,
    ':created_at' => $now,
    ':updated_at' => $now,
  ]);

  return $pdo->lastInsertId();
}
