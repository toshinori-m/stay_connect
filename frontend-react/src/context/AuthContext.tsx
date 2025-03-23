import { useState, ReactNode, useEffect, createContext } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { useQueryClient } from "@tanstack/react-query"
import { AUTH_USER_QUERY_KEY } from "@/constants/queryKeys"

interface AuthUserContextType { user: User | null, loading: boolean }
interface AuthUserUpdateContextType { setUser: (user: User | null) => void }

export const AuthContext = (() => createContext<AuthUserContextType | null>(null))()
export const AuthUpdateContext = (() => createContext<AuthUserUpdateContextType | null>(null))()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser) 
      setLoading(false)
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY })
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <AuthUpdateContext.Provider value={{ setUser }}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}
