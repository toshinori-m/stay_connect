import { useSuspenseQuery } from "@tanstack/react-query"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"

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
    queryKey: ["authUser"],
    queryFn: fetchUser,
    staleTime: Infinity,
  })
}
