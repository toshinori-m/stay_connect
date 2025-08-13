import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "@/index.css"
import App from "@/App"
import { AuthProvider } from "@/context/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// 開発環境でのみMSWを起動
async function setupMswForDevelopment() {
  if (import.meta.env.DEV) {
    try {
      await (await import("./lib/mocks/browser")).worker.start({
        onUnhandledRequest: "warn",
        serviceWorker: {
          url: "/mockServiceWorker.js"
        }
      })
    } catch {
      console.error("[MSW] モックサーバーの起動に失敗しました。")
    }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
})

setupMswForDevelopment().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<div>読み込み中...</div>}>
              <App />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  )
})
