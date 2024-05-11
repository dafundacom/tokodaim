import * as React from "react"

interface SidebarToggleItemProps {
  children?: React.ReactNode
  href: string
}

const SidebarToggleItem: React.FunctionComponent<SidebarToggleItemProps> = (
  props,
) => {
  const { children, href } = props

  return (
    <li>
      <a
        aria-label="Toggle Item"
        href={href}
        className="group flex w-full items-center rounded-lg bg-background p-2 pl-11 text-base font-normal text-foreground transition duration-75 hover:bg-primary/10"
      >
        {children}
      </a>
    </li>
  )
}

export default SidebarToggleItem
