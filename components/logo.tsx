import * as React from "react"
import Image from "next/image"

import env from "@/env.mjs"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

const Logo: React.FunctionComponent<LogoProps> = () => {
  return (
    <span className="relative inline-block h-[23px] w-[120px]">
      <Image
        loading="eager"
        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
        alt={env.NEXT_PUBLIC_SITE_TITLE}
        src={env.NEXT_PUBLIC_LOGO_URL}
        width={120}
        height={21}
      />
    </span>
  )
}

export default Logo
