import { FirebaseError } from "firebase/app"

export default function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Google認証関連のエラー
      case "auth/account-exists-with-different-credential":
        return "このメールアドレスは別の認証方法で登録されています。元の認証方法でログインしてください。"
      case "auth/popup-closed-by-user":
        return "ポップアップが閉じられました。もう一度試してください。"
      case "auth/cancelled-popup-request":
        return "複数の認証リクエストが行われました。しばらくしてから再試行してください。"
      case "auth/popup-blocked":
        return "ポップアップがブロックされました。ブラウザの設定を確認してください。"
      case "auth/credential-already-in-use":
        return "このGoogleアカウントはすでに別のFirebaseアカウントにリンクされています。"

      // メール・パスワード認証関連のエラー
      case "auth/email-already-in-use":
        return "このメールアドレスは既に使用されています。"
      case "auth/invalid-email":
        return "メールアドレスの形式が不正です。"
      case "auth/weak-password":
        return "パスワードは6文字以上が必要です。"
      case "auth/operation-not-allowed":
        return "現在、メール・パスワードのサインインは無効になっています。管理者にお問い合わせください。"
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "メールアドレスまたはパスワードが間違っています。"
      case "auth/too-many-requests":
        return "ログイン試行回数が多すぎます。しばらく待ってから再試行してください。"

      // ネットワーク関連のエラー
      case "auth/network-request-failed":
      case "auth/internal-error":
        return "ネットワーク接続に問題があります。接続を確認して再試行してください。"

      default:
        return "エラーが発生しました。しばらくしてから再試行してください。"
    }
  }

  return "予期しないエラーが発生しました。"
}
