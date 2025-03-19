"use client"

import * as React from "react"
import { Icon } from "@yopem-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "./button"

export const ThemeSwitcher: React.FunctionComponent = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" className="size-10 px-0" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Icon name="Sun" className="transition-all" />
      ) : (
        <Icon name="Moon" className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
