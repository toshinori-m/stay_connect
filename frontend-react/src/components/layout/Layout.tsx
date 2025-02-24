import { useAuth } from "@/contexts/AuthContext"
import OpenHeader from "@/components/layout/OpenHeader"
// import HomeHeader from "../components/layout/HomeHeader"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div>
      {/* 今は `user` が常に `null` なので、 `OpenHeader` を表示 */}
      <OpenHeader />
      {/* {user ? <HomeHeader /> : <OpenHeader />} */}
      {children}
    </div>
  );
}
