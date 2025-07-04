<?php
class User
{
  public static function findByUid(PDO $pdo, string $userId): ?array
  {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE uid = :uid LIMIT 1");
    $stmt->execute([':uid' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return $user ?: null;
  }

  public static function update(PDO $pdo, int $id, array $data): void
  {
    $sql = "
      UPDATE users SET
        name = :name,
        email = :email,
        birthday = :birthday,
        sex = :sex,
        self_introduction = :self_introduction,
        email_notification = :email_notification";

    if (!empty($data['image'])) {
      $sql .= ", image = :image";
    }

    $sql .= ",
        updated_at = :updated_at
      WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':name', $data['name']);
    $stmt->bindValue(':email', $data['email']);
    $stmt->bindValue(':birthday', $data['birthday']);
    $stmt->bindValue(':sex', $data['sex'], PDO::PARAM_INT);
    $stmt->bindValue(':self_introduction', $data['self_introduction']);
    $stmt->bindValue(':email_notification', $data['email_notification'], PDO::PARAM_BOOL);
    $stmt->bindValue(':updated_at', (new DateTime())->format('Y-m-d H:i:s'));
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);

    if ($data['image']) {
      $stmt->bindValue(':image', $data['image']);
    }

    $stmt->execute();
  }

  public static function validateProfile(array $data): array
  {
    $errors = [];

    $name = trim($data['name']);
    if ($name === '') {
      $errors['name'][] = '名前を入力してください。';
    } elseif (mb_strlen($name) < 2) {
      $errors['name'][] = '名前は2文字以上で入力してください。';
    } elseif (mb_strlen($name) > 100) {
      $errors['name'][] = '名前は100文字以内で入力してください。';
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      $errors['email'][] = 'メールアドレスの形式が不正です。';
    }

    return $errors;
  }
}
