import { useState, ReactNode, useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"
import { auth } from "@/firebase/firebase"
import { onAuthStateChanged, User } from "firebase/auth"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser) 
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
