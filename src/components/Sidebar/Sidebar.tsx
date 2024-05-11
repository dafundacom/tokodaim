import * as React from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const { children } = props

  return (
    <aside
      className="flex h-screen w-full flex-col flex-wrap px-3 pb-12 pt-4 text-foreground transition-[width] duration-300"
      aria-label="Sidebar"
    >
      <div>
        <ul className="space-y-2">{children}</ul>
      </div>
    </aside>
  )
}

export default Sidebar
