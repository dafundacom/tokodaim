"use client"

import * as React from "react"

import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18n } from "@/lib/locales/client"

interface TopUpServerProps extends React.HTMLAttributes<HTMLDivElement> {
  brand: string
  topUpServer: (_value: React.SetStateAction<string>) => void
}

const TopUpServer: React.FunctionComponent<TopUpServerProps> = (props) => {
  const { brand, topUpServer } = props

  const [queryTopUpServer, setTopUpServerQuery] = React.useState<string>("")

  const t = useI18n()

  React.useEffect(() => {
    const savedQuery = localStorage.getItem(`top-up-server-${brand}`)
    if (savedQuery) {
      topUpServer(savedQuery)
      setTopUpServerQuery(savedQuery)
    }
  }, [topUpServer, brand])

  const topUpServerList = topUpGamesWithServer.find(
    (list) => list.name === brand,
  )

  React.useEffect(() => {
    if (topUpServerList) {
      topUpServer(topUpServerList?.gameServers[0]?.value!)
      setTopUpServerQuery(topUpServerList?.gameServers[0]?.value!)
    }
  }, [topUpServer, topUpServerList])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    topUpServer(value)
    setTopUpServerQuery(value)
    localStorage.setItem(`top-up-server-${brand}`, value)
  }

  const handleInputChange = (event: { target: { value: string } }) => {
    topUpServer(event.target.value)
    setTopUpServerQuery(event.target.value)
    localStorage.setItem(`top-up-server-${brand}`, event.target.value)
  }

  if (topUpServerList) {
    return (
      <div>
        <FormLabel>Server</FormLabel>
        <Select
          onValueChange={() => handleSelectChange}
          value={queryTopUpServer}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("server_placeholder_select")} />
          </SelectTrigger>
          <SelectContent>
            {topUpServerList.gameServers.map((gameServer) => (
              <SelectItem key={gameServer.value} value={gameServer.value}>
                {gameServer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
  return (
    <div>
      <FormLabel>Server</FormLabel>
      <Input
        onChange={handleInputChange}
        value={queryTopUpServer}
        placeholder={t("server_placeholder")}
      />
    </div>
  )
}

export const topUpGamesWithServer = [
  {
    name: "Genshin Impact",
    gameServers: [
      { value: "001", name: "Asia" },
      { value: "002", name: "Europe" },
      { value: "003", name: "America" },
      { value: "004", name: "TW, HK, MO" },
    ],
  },
  {
    name: "Tower of Fantasy",
    gameServers: [
      { value: "Phantasia", name: "Southeast Asia-Phantasia" },
      { value: "Mechafield", name: "Southeast Asia-Mechafield" },
      { value: "Ethereal Dream", name: "Southeast Asia-Ethereal Dream" },
      { value: "Odyssey", name: "Southeast Asia-Odyssey" },
      { value: "Aestral-Noa", name: "Southeast Asia-Aestral-Noa" },
      { value: "Osillron", name: "Southeast Asia-Osillron" },
      { value: "Chandra", name: "Southeast Asia-Chandra" },
      { value: "Saeri", name: "Southeast Asia-Saeri" },
      { value: "Aeria", name: "Southeast Asia-Aeria" },
      { value: "Scarlet", name: "Southeast Asia-Scarlet" },
      { value: "Gumi Gumi", name: "Southeast Asia-Gumi Gumi" },
      { value: "Fantasia", name: "Southeast Asia-Fantasia" },
      { value: "Oryza", name: "Southeast Asia-Oryza" },
      { value: "Stardust", name: "Southeast Asia-Stardust" },
      { value: "Arcania", name: "Southeast Asia-Arcania" },
      { value: "Animus", name: "Southeast Asia-Animus" },
      { value: "Mistilteinn", name: "Southeast Asia-Mistilteinn" },
      { value: "Valhalla", name: "Southeast Asia-Valhalla" },
      { value: "Illyrians", name: "Southeast Asia-Illyrians" },
      { value: "Florione", name: "Southeast Asia-Florione" },
      { value: "Oneiros", name: "Southeast Asia-Oneiros" },
      { value: "Famtosyana", name: "Southeast Asia-Famtosyana" },
      { value: "Edenia", name: "Southeast Asia-Edenia" },
    ],
  },
  {
    name: "Ragnarok M: Eternal Love",
    gameServers: [
      { value: "90001", name: "Eternal Love" },
      { value: "90002", name: "Midnight Party" },
      { value: "90002003", name: "Memory of Faith" },
      { value: "90002004", name: "Valhalla Glory" },
    ],
  },
  {
    name: "Punishing Gray Raven",
    gameServers: [
      { value: "5000", name: "Asia Pasific" },
      { value: "5001", name: "Europe" },
      { value: "5002", name: "North America" },
    ],
  },
  {
    name: "Honkai Star Rail",
    gameServers: [
      { value: "os_usa", name: "America" },
      { value: "os_asia", name: "Asia" },
      { value: "os_euro", name: "Europe" },
      { value: "os_cht", name: "Taiwan, Hongkong, Macau" },
    ],
  },
]

export default TopUpServer
