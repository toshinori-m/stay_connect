import { useState, ReactNode, useEffect, createContext } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"

interface AuthUserContextType { user: User | null, loading: boolean }
interface AuthUserUpdateContextType { setUser: (user: User | null) => void }

export const AuthContext = (() => createContext<AuthUserContextType | null>(null))()
export const AuthUpdateContext = (() => createContext<AuthUserUpdateContextType | null>(null))()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser) 
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <AuthUpdateContext.Provider value={{ setUser }}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}
