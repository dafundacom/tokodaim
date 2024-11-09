"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

const ThemeSwitcher: React.FunctionComponent = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" className="size-10 px-0" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Icon.Light className="transition-all" />
      ) : (
        <Icon.Dark className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default ThemeSwitcher
