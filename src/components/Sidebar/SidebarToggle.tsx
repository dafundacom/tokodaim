import * as React from "react"

import { Icon } from "@/components/UI/Icon"
import { cn } from "@/lib/utils/style"

interface SidebarToggleProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode
  children?: React.ReactNode
  title?: string
  badge?: string
  href?: string
}

const SidebarToggle: React.FunctionComponent<SidebarToggleProps> = (props) => {
  const { icon, title, children } = props

  const [toggle, setToggle] = React.useState<boolean>(false)

  const dropdownClasses = cn(!toggle && "hidden", "space-y-2 py-2")

  return (
    <li>
      <button
        type="button"
        onClick={() => setToggle(!toggle)}
        className="group flex w-full items-center rounded-lg bg-background p-2 text-base font-normal text-foreground transition duration-75 hover:bg-primary/10"
        aria-controls={`${title?.replace(" ", "-")}-dropdown`}
        data-collapse-toggle="dropdown"
      >
        {icon}
        <span
          className="ml-5 flex-1 whitespace-nowrap text-left"
          data-sidebar-toggle-item="true"
        >
          {title}
        </span>
        <Icon.ChevronDown
          aria-label="Dropdown"
          data-sidebar-toggle-item="true"
          className="h-6 w-6"
        />
      </button>
      <ul
        id={`${title?.replace(" ", "-")}-dropdown`}
        className={dropdownClasses}
      >
        {children}
      </ul>
    </li>
  )
}

export default SidebarToggle
