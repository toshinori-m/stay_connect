import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: null; // 今はログイン機能がないので `null` のみ
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<null>(null); // 仮の `user` を `null` に固定

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
