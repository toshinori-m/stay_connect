import { useState, useEffect, useCallback } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import SearchForm from "@/components/HomePage/SearchForm"
import { ApiErrorResponse, SelectOption } from "@/types"
import { AxiosError } from "axios"

export default function HomePage() {
  const [sportsTypes, setSportsTypes] = useState<SelectOption[]>([])
  const [sportsTypeSelected, setSportsTypeSelected] = useState<SelectOption | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()

  const fetchSportsTypes = useCallback(async () => {
    try {
      setErrors([])
      const res = await apiClient.get("/sports_types")
      setSportsTypes(res.data.data)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      setErrors([axiosError.response?.data?.error || "競技を表示できませんでした。"])
    }
  }, [apiClient])

  useEffect(() => {
    fetchSportsTypes()
  }, [fetchSportsTypes])

  return (
    <div className="mt-32 md:mt-20 mx-auto p-4 md:flex md:items-start">
      <SearchForm
        setSportsTypeSelected={setSportsTypeSelected}
        sportsTypes={sportsTypes}
        sportsTypeSelected={sportsTypeSelected}
        errors={errors}
      />
    </div>
  )
}
