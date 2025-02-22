import AppRouter from "./router/index"
import Layout from "@/components/layout/Layout.tsx"

export default function App() {
  return (
    <Layout> 
      <AppRouter />
    </Layout>
  )
}
