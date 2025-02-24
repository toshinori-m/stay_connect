import OpenHeader from "@/components/layout/OpenHeader"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <OpenHeader />
      {children}
    </div>
  )
}
