import { useTeamList } from "@/hooks/teams/useTeamList"
import { Team } from "@/types"

const TeamCard = ({ team }: { team: Team }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.name}</h3>
    <p className="text-gray-600 mb-2">
      <span className="inline-block w-4 h-4 mr-2">📍</span>
      {team.area}
    </p>
    <p className="text-xs text-gray-400">
      {team.created_at
        ? new Date(team.created_at).toLocaleDateString("ja-JP") + " 作成"
        : "作成日不明"
      }
    </p>
  </div>
)

const LoadingState = () => (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <p className="mt-4 text-gray-600">チーム情報を読み込んでいます...</p>
  </div>
)

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🏐</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">チームが見つかりません。</h3>
    <p className="text-gray-600 mb-6">現在登録されているチームはありません。</p>
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
      チームを作成する
    </button>
  </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">エラーが発生しました。</h3>
    <p className="text-gray-600 mb-6">チーム情報の取得に失敗しました。</p>
    <button 
      onClick={onRetry}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
    >
      再試行する
    </button>
  </div>
)

export default function TeamListPage() {
  const { data, isLoading, isError, refetch } = useTeamList()

  const teamCards = data?.teams.map((team) => (
    <TeamCard key={team.id} team={team} />
  ))

  return (
    <div className="min-h-screen bg-gray-50 mt-32 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">チーム一覧</h1>
          <p className="text-gray-600">練習試合の相手を見つけよう。</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {isLoading && <LoadingState />}
          
          {isError && <ErrorState onRetry={() => refetch()} />}
          
          {data && data.teams.length === 0 && <EmptyState />}
          
          {data && data.teams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamCards}
            </div>
          )}
          
          {data && data.teams.length > 0 && (
            <div className="mt-8 text-center text-gray-500">
              {data.teams.length} 件のチームが見つかりました。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
