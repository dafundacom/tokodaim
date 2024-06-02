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
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n } from "@/lib/locales/client"

interface TopUpServerProps extends React.HTMLAttributes<HTMLDivElement> {
  brand: string
  topUpServer: (_value: React.SetStateAction<string>) => void
  queryAccountId: string
}

const TopUpServer: React.FunctionComponent<TopUpServerProps> = (props) => {
  const { brand, topUpServer, queryAccountId } = props

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

  function checkGameIdAndServer(game: string, id: string, zone?: string) {
    let isMatch = true
    switch (game.toLocaleLowerCase()) {
      case "genshin impact":
        if (id.startsWith("6") && zone !== "003") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (id.startsWith("7") && zone !== "002") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (id.startsWith("8") && zone !== "001") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (id.startsWith("9") && zone !== "004") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (!["6", "7", "8", "9"].includes(id.charAt(0))) {
          toast({
            description: "informasi akun tidak ditemukan",
            variant: "danger",
          })
          isMatch = false
        }

        break
      case "honkai star rail":
        if (id.startsWith("6") && zone !== "os_usa") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (id.startsWith("7") && zone !== "os_euro") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (id.startsWith("8") && zone !== "os_asia") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (id.startsWith("9") && zone !== "os_cht") {
          toast({
            description: "server tidak sesuai, silahkan pilih yang lain",
            variant: "danger",
          })
          isMatch = false
        } else if (!["6", "7", "8", "9"].includes(id.charAt(0))) {
          toast({
            description: "informasi akun tidak ditemukan",
            variant: "danger",
          })
          isMatch = false
        }
        break
      default:
        isMatch = true
    }
    return isMatch
  }

  const handleSelectChange = (value: string) => {
    if (value.length > 0) {
      const isMatch = checkGameIdAndServer(brand, queryAccountId, value)
      if (isMatch) {
        topUpServer(value)
        setTopUpServerQuery(value)
        localStorage.setItem(`top-up-server-${brand}`, value)
      }
    }
  }

  const handleInputChange = (event: { target: { value: string } }) => {
    topUpServer(event.target.value)
    setTopUpServerQuery(event.target.value)
    localStorage.setItem(`top-up-server-${brand}`, event.target.value)
  }

  if (topUpServerList) {
    return (
      <div className="w-full">
        <FormLabel>Server</FormLabel>
        <Select onValueChange={handleSelectChange} value={queryTopUpServer}>
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
    <div className="w-full">
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
      { value: "SoutheastAsia-Aeria", name: "Southeast Asia-Aeria" },
      {
        value: "SoutheastAsia-Aestral-Noa",
        name: "Southeast Asia-Aestral-Noa",
      },
      { value: "SoutheastAsia-Animus", name: "Southeast Asia-Animus" },
      { value: "SoutheastAsia-Arcania", name: "Southeast Asia-Arcania" },
      { value: "SoutheastAsia-Chandra", name: "Southeast Asia-Chandra" },
      { value: "SoutheastAsia-Edenia", name: "Southeast Asia-Edenia" },
      {
        value: "SoutheastAsia-EtherealDream",
        name: "Southeast Asia-Ethereal Dream",
      },
      { value: "SoutheastAsia-Famtosyana", name: "Southeast Asia-Famtosyana" },
      { value: "SoutheastAsia-Fantasia", name: "Southeast Asia-Fantasia" },
      { value: "SoutheastAsia-Florione", name: "Southeast Asia-Florione" },
      { value: "SoutheastAsia-GumiGumi", name: "Southeast Asia-Gumi Gumi" },
      { value: "SoutheastAsia-Illyrians", name: "Southeast Asia-Illyrians" },
      { value: "SoutheastAsia-Mechafield", name: "Southeast Asia-Mechafield" },
      {
        value: "SoutheastAsia-Mistilteinn",
        name: "Southeast Asia-Mistilteinn",
      },
      { value: "SoutheastAsia-Odyssey", name: "Southeast Asia-Odyssey" },
      { value: "SoutheastAsia-Oneiros", name: "Southeast Asia-Oneiros" },
      { value: "SoutheastAsia-Oryza", name: "Southeast Asia-Oryza" },
      { value: "SoutheastAsia-Osillron", name: "Southeast Asia-Osillron" },
      { value: "SoutheastAsia-Phantasia", name: "Southeast Asia-Phantasia" },
      { value: "SoutheastAsia-Saeri", name: "Southeast Asia-Saeri" },
      { value: "SoutheastAsia-Scarlet", name: "Southeast Asia-Scarlet" },
      { value: "SoutheastAsia-Stardust", name: "Southeast Asia-Stardust" },
      { value: "SoutheastAsia-Valhalla", name: "Southeast Asia-Valhalla" },
      { value: "AsiaPacific-Adventure", name: "Asia Pacific-Adventure" },
      { value: "AsiaPacific-Atlantis", name: "Asia Pacific-Atlantis" },
      { value: "AsiaPacific-Babel", name: "Asia Pacific-Babel" },
      { value: "AsiaPacific-Cocaiteruyo", name: "Asia Pacific-Cocaiteruyo" },
      { value: "AsiaPacific-Cocokonderu", name: "Asia Pacific-Cocokonderu" },
      { value: "AsiaPacific-Daybreak", name: "Asia Pacific-Daybreak" },
      { value: "AsiaPacific-Eden", name: "Asia Pacific-Eden" },
      { value: "AsiaPacific-Fate", name: "Asia Pacific-Fate" },
      { value: "AsiaPacific-Foodfighter", name: "Asia Pacific-Food fighter" },
      { value: "AsiaPacific-Galaxy", name: "Asia Pacific-Galaxy" },
      { value: "AsiaPacific-Gomap", name: "Asia Pacific-Gomap" },
      { value: "AsiaPacific-Jupiter", name: "Asia Pacific-Jupiter" },
      { value: "AsiaPacific-Mars", name: "Asia Pacific-Mars" },
      { value: "AsiaPacific-Memory", name: "Asia Pacific-Memory" },
      { value: "AsiaPacific-Mihashira", name: "Asia Pacific-Mihashira" },
      { value: "AsiaPacific-Moon", name: "Asia Pacific-Moon" },
      { value: "AsiaPacific-Neptune", name: "Asia Pacific-Neptune" },
      { value: "AsiaPacific-Nova", name: "Asia Pacific-Nova" },
      { value: "AsiaPacific-Oxygen", name: "Asia Pacific-Oxygen" },
      { value: "AsiaPacific-Pluto", name: "Asia Pacific-Pluto" },
      { value: "AsiaPacific-Ruby", name: "Asia Pacific-Ruby" },
      { value: "AsiaPacific-Sakura", name: "Asia Pacific-Sakura" },
      { value: "AsiaPacific-Seeker", name: "Asia Pacific-Seeker" },
      { value: "AsiaPacific-Shinya", name: "Asia Pacific-Shinya" },
      { value: "AsiaPacific-Stella", name: "Asia Pacific-Stella" },
      { value: "AsiaPacific-Sushi", name: "Asia Pacific-Sushi" },
      { value: "AsiaPacific-Sweetie", name: "Asia Pacific-Sweetie" },
      { value: "AsiaPacific-Takoyaki", name: "Asia Pacific-Takoyaki" },
      { value: "AsiaPacific-Tenpura", name: "Asia Pacific-Tenpura" },
      { value: "AsiaPacific-Uranus", name: "Asia Pacific-Uranus" },
      { value: "AsiaPacific-Utopia", name: "Asia Pacific-Utopia" },
      { value: "AsiaPacific-Vega", name: "Asia Pacific-Vega" },
      { value: "AsiaPacific-Venus", name: "Asia Pacific-Venus" },
      { value: "AsiaPacific-Yggdrasil", name: "Asia Pacific-Yggdrasil" },
      { value: "Europe-Aimanium", name: "Europe-Aimanium" },
      { value: "Europe-Alintheus", name: "Europe-Alintheus" },
      { value: "Europe-Andoes", name: "Europe-Andoes" },
      { value: "Europe-Anomora", name: "Europe-Anomora" },
      { value: "Europe-Astora", name: "Europe-Astora" },
      { value: "Europe-Blumous", name: "Europe-Blumous" },
      { value: "Europe-Celestialrise", name: "Europe-Celestialrise" },
      { value: "Europe-Cosmos", name: "Europe-Cosmos" },
      { value: "Europe-Dyrnwyn", name: "Europe-Dyrnwyn" },
      { value: "Europe-Elypium", name: "Europe-Elypium" },
      { value: "Europe-EspoirIV", name: "Europe-Espoir IV" },
      { value: "Europe-Estrela", name: "Europe-Estrela" },
      { value: "Europe-Ether", name: "Europe-Ether" },
      { value: "Europe-ExNihilor", name: "Europe-Ex Nihilor" },
      { value: "Europe-Excalibur", name: "Europe-Excalibur" },
      { value: "Europe-Futuria", name: "Europe-Futuria" },
      { value: "Europe-Hephaestus", name: "Europe-Hephaestus" },
      { value: "Europe-Iter", name: "Europe-Iter" },
      { value: "Europe-Kuura", name: "Europe-Kuura" },
      { value: "Europe-Lycoris", name: "Europe-Lycoris" },
      { value: "Europe-Lyramiel", name: "Europe-Lyramiel" },
      { value: "Europe-Magenta", name: "Europe-Magenta" },
      { value: "Europe-MagiaPrzygodaAida", name: "Europe-Magia Przygoda Aida" },
      { value: "Europe-Midgard", name: "Europe-Midgard" },
      { value: "Europe-Olivine", name: "Europe-Olivine" },
      { value: "Europe-OmniumPrime", name: "Europe-Omnium Prime" },
      { value: "Europe-SeaforthDock", name: "Europe-Seaforth Dock" },
      { value: "Europe-SilvercoastLab", name: "Europe-Silvercoast Lab" },
      { value: "Europe-TheLumina", name: "Europe-The Lumina" },
      { value: "Europe-TransportHub", name: "Europe-Transport Hub" },
      { value: "Europe-Turmus", name: "Europe-Turmus" },
      { value: "Europe-Valstamm", name: "Europe-Valstamm" },
      { value: "NorthAmerica-AzurePlane", name: "North America-Azure Plane" },
      {
        value: "NorthAmerica-EterniumPhantasy",
        name: "North America-Eternium Phantasy",
      },
      {
        value: "NorthAmerica-Freedom-Oasis",
        name: "North America-Freedom-Oasis",
      },
      { value: "NorthAmerica-Frontier", name: "North America-Frontier" },
      { value: "NorthAmerica-Libera", name: "North America-Libera" },
      { value: "NorthAmerica-Lighthouse", name: "North America-Lighthouse" },
      { value: "NorthAmerica-Lunalite", name: "North America-Lunalite" },
      { value: "NorthAmerica-Myriad", name: "North America-Myriad" },
      { value: "NorthAmerica-NewEra", name: "North America-New Era" },
      { value: "NorthAmerica-Nightfall", name: "North America-Nightfall" },
      { value: "NorthAmerica-Nirvana", name: "North America-Nirvana" },
      { value: "NorthAmerica-Observer", name: "North America-Observer" },
      { value: "NorthAmerica-Oumuamua", name: "North America-Oumuamua" },
      { value: "NorthAmerica-Ozera", name: "North America-Ozera" },
      { value: "NorthAmerica-Radiant", name: "North America-Radiant" },
      {
        value: "NorthAmerica-SilverBridge",
        name: "North America-Silver Bridge",
      },
      { value: "NorthAmerica-Sol-III", name: "North America-Sol-III" },
      { value: "NorthAmerica-Solaris", name: "North America-Solaris" },
      { value: "NorthAmerica-Starlight", name: "North America-Starlight" },
      { value: "NorthAmerica-Tempest", name: "North America-Tempest" },
      { value: "NorthAmerica-TheGlades", name: "North America-The Glades" },
      {
        value: "NorthAmerica-Theworldsbetween",
        name: "North America-The worlds between",
      },
      { value: "SouthAmerica-Antlia", name: "South America-Antlia" },
      {
        value: "SouthAmerica-CalodesmaSeven",
        name: "South America-Calodesma Seven",
      },
      { value: "SouthAmerica-Centaurus", name: "South America-Centaurus" },
      { value: "SouthAmerica-Cepheu", name: "South America-Cepheu" },
      { value: "SouthAmerica-Columba", name: "South America-Columba" },
      { value: "SouthAmerica-Corvus", name: "South America-Corvus" },
      { value: "SouthAmerica-Cygnus", name: "South America-Cygnus" },
      { value: "SouthAmerica-Grus", name: "South America-Grus" },
      { value: "SouthAmerica-Hope", name: "South America-Hope" },
      { value: "SouthAmerica-Hydra", name: "South America-Hydra" },
      { value: "SouthAmerica-LunaAzul", name: "South America-Luna Azul" },
      { value: "SouthAmerica-Lyra", name: "South America-Lyra" },
      { value: "SouthAmerica-Ophiuchus", name: "South America-Ophiuchus" },
      { value: "SouthAmerica-Orion", name: "South America-Orion" },
      { value: "SouthAmerica-Pegasus", name: "South America-Pegasus" },
      { value: "SouthAmerica-Phoenix", name: "South America-Phoenix" },
      { value: "SouthAmerica-Tanzanite", name: "South America-Tanzanite" },
      { value: "SouthAmerica-Tiamat", name: "South America-Tiamat" },
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
      { value: "os_cht", name: "TW, HK, MO" },
    ],
  },
]

export default TopUpServer
