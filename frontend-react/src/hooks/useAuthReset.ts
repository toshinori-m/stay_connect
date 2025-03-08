import { useEffect } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { FirebaseError } from "firebase/app"
import { useSetAuth } from "@/context/useAuthContext"

const useAuthReset = (setError: (error: string | null) => void) => {
  const { setUser } = useSetAuth()

  useEffect(() => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => {
        if (error instanceof FirebaseError) {
          setError(error.message)
        } else {
          setError("予期しないエラーが発生しました。")
        }
      })
  }, [setUser, setError])
}

export default useAuthReset
