import { useState, useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import SearchForm from "@/components/HomePage/SearchForm"
import apiErrorHandler from "@/utils/apiErrorHandler"
import { SelectOption } from "@/types"

export default function HomePage() {
  const [sportsTypes, setSportsTypes] = useState<SelectOption[]>([])
  const [sportsTypeSelected, setSportsTypeSelected] = useState<SelectOption | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()

  useEffect(() => {
    const fetchSportsTypes = async () => {
      try {
        setErrors([])
        const res = await apiClient.get("/sports_types")
        setSportsTypes(res.data.data)
      } catch (error: unknown) {
        apiErrorHandler(error, setErrors)
      }
    }

    fetchSportsTypes()
  }, [apiClient])

  return (
    <div className="mt-32 md:mt-20 mx-auto p-4 md:flex md:items-start">
      {/* TODO: 今は選択するだけだが、将来的に検索機能を追加する */}
      <SearchForm
        setSportsTypeSelected={setSportsTypeSelected}
        sportsTypes={sportsTypes}
        sportsTypeSelected={sportsTypeSelected}
        errors={errors}
      />
    </div>
  )
}
