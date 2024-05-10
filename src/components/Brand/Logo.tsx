import * as React from "react"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

const Logo: React.FunctionComponent<LogoProps> = () => {
  return (
    <span className="relative inline-block h-[23px] w-[120px]">
      <img
        loading="eager"
        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
        alt={import.meta.env.PUBLIC_SITE_TITLE}
        src={import.meta.env.PUBLIC_LOGO_URL}
        width={120}
        height={21}
      />
    </span>
  )
}

export default Logo
