import { useState, ReactNode, useEffect, createContext } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { AuthUserContextType, AuthUserUpdateContextType } from "@/types"

export const AuthContext = (() => createContext<AuthUserContextType | null>(null))()
export const AuthUpdateContext = (() => createContext<AuthUserUpdateContextType | null>(null))()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser) 
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      <AuthUpdateContext.Provider value={{ setUser }}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}
