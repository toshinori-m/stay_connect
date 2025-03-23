import { useSuspenseQuery } from "@tanstack/react-query"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { AUTH_USER_QUERY_KEY } from "@/constants/queryKeys"

const fetchUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const useAuthUser = () => {
  return useSuspenseQuery<User | null>({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: fetchUser
  })
}
