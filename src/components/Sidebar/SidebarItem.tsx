import * as React from "react"

interface SidebarItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode | undefined
  children?: React.ReactNode
  badge?: string
  href?: string
  onClick?: () => void
}

const SidebarItem: React.FunctionComponent<SidebarItemProps> = (props) => {
  const { icon, badge, children, href, onClick, className } = props

  return (
    <li className={className}>
      {href ? (
        <a
          aria-label="Badge"
          href={href}
          className="flex items-center rounded-lg bg-background p-2 text-base font-normal text-foreground hover:bg-primary/10"
        >
          {icon}
          <span className="ml-5 flex-1 whitespace-nowrap">{children}</span>
          {badge && (
            <span className="ml-3 inline-flex items-center justify-center rounded-full bg-background px-2 text-sm font-medium text-foreground hover:bg-primary/10">
              {badge}
            </span>
          )}
        </a>
      ) : (
        <div
          className="flex cursor-pointer items-center rounded-lg bg-background p-2 text-base font-normal text-foreground hover:bg-primary/10"
          onClick={onClick}
        >
          {icon}
          <span className="ml-5 flex-1 whitespace-nowrap">{children}</span>
          {badge && (
            <span className="ml-3 inline-flex items-center justify-center rounded-full bg-background px-2 text-sm font-medium text-foreground hover:bg-primary/10">
              {badge}
            </span>
          )}
        </div>
      )}
    </li>
  )
}

export default SidebarItem
