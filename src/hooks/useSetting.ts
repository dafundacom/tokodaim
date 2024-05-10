import * as React from "react"

import { toast } from "@/components/UI/Toast/useToast"
import type { SelectSetting } from "@/lib/db/schema/setting"

export function useGetSettingByKey(key: string) {
  const [data, setData] = React.useState<SelectSetting | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleGetSettingByKey = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/setting/key/${key}`, {
        method: "GET",
      })
      const data = (await response.json()) as SelectSetting
      if (data) {
        setData(data)
      }
      return data
    } catch (error) {
      toast({
        description: "Error when getting count, try again",
        variant: "warning",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    handleGetSettingByKey()
  }

  React.useEffect(() => {
    handleGetSettingByKey()
  }, [])

  return { data, isLoading, refetch }
}
