<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/authenticate.php';
require_once __DIR__ . '/../lib/error_handler.php';

header('Content-Type: application/json');

function sexLabel($sexInt) {
  switch ($sexInt) {
    case 0: return 'man';
    case 1: return 'woman';
    case 2: return 'mix';
    case 3: return 'man_and_woman';
    default: return 'unknown';
  }
}

try {
  $pdo = getPDO();

  // ベースの recruitments 一覧を取得
  $sql = "
    SELECT 
      r.id, r.name, r.purpose_body, r.sex,
      st.name AS sports_type_name,
      p.name AS prefecture_name
    FROM recruitments r
    LEFT JOIN sports_types st ON r.sports_type_id = st.id
    LEFT JOIN prefectures p ON r.prefecture_id = p.id
    WHERE 1 = 1
  ";

  $params = [];
  if (!empty($_GET['sports_type_name'])) {
    $sql .= " AND st.name = :sports_type_name";
    $params[':sports_type_name'] = $_GET['sports_type_name'];
  }
  if (!empty($_GET['sports_discipline_name'])) {
    $sql .= "
      AND EXISTS (
        SELECT 1
        FROM recruitment_sports_disciplines rsd
        JOIN sports_disciplines sd ON sd.id = rsd.sports_discipline_id
        WHERE rsd.recruitment_id = r.id
          AND sd.name = :sports_discipline_name
      )
    ";
    $params[':sports_discipline_name'] = $_GET['sports_discipline_name'];
  }
  if (!empty($_GET['prefecture_name'])) {
    $sql .= " AND p.name = :prefecture_name";
    $params[':prefecture_name'] = $_GET['prefecture_name'];
  }
  if (!empty($_GET['target_age_name'])) {
    $sql .= "
      AND EXISTS (
        SELECT 1
        FROM recruitment_target_ages rta
        JOIN target_ages ta ON ta.id = rta.target_age_id
        WHERE rta.recruitment_id = r.id
          AND ta.name = :target_age_name
      )
    ";
    $params[':target_age_name'] = $_GET['target_age_name'];
  }

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  $recruitments = $stmt->fetchAll(PDO::FETCH_ASSOC);
  if (!$recruitments) $recruitments = [];

  foreach ($recruitments as &$recruitment) {
    $rid = $recruitment['id'];
    $recruitment['sex'] = sexLabel($recruitment['sex']);

    // 種目
    $stmtDisciplines = $pdo->prepare("
      SELECT sd.id, sd.name
      FROM recruitment_sports_disciplines rsd
      JOIN sports_disciplines sd ON sd.id = rsd.sports_discipline_id
      WHERE rsd.recruitment_id = :rid
    ");
    $stmtDisciplines->execute([':rid' => $rid]);
    $recruitment['sports_discipline_name'] = $stmtDisciplines->fetchAll(PDO::FETCH_ASSOC) ?: [];

    // 対象年齢
    $stmtAges = $pdo->prepare("
      SELECT ta.id, ta.name
      FROM recruitment_target_ages rta
      JOIN target_ages ta ON ta.id = rta.target_age_id
      WHERE rta.recruitment_id = :rid
    ");
    $stmtAges->execute([':rid' => $rid]);
    $recruitment['target_age_name'] = $stmtAges->fetchAll(PDO::FETCH_ASSOC) ?: [];
  }

  echo json_encode($recruitments);
  http_response_code(200);
  exit(0);

} catch (PDOException $e) {
  handlePDOException($e);
} catch (Exception $e) {
  handleException($e);
}
