import * as React from "react"

interface ImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string
  alt: string
  decoding?: "async" | "sync" | "auto"
  fetchpriority?: "high" | "low" | "auto"
  width: string
  height: string
  className?: string
}

const addQueryParamToURL = ({
  url,
  height,
  width,
}: {
  url: string
  height: string
  width: string
}): string => {
  try {
    const urlObject = new URL(url)

    return import.meta.env.APP_ENV !== "development"
      ? `/cdn-cgi/image/width=${width},height=${height},format=webp/${urlObject.href}`
      : url
  } catch (error) {
    console.error("URL tidak valid:", error)
    return url
  }
}

const Image = (props: ImageProps) => {
  const { src, alt, decoding, width, height, ...rest } = props

  return (
    <img
      {...rest}
      alt={alt}
      decoding={decoding}
      width={width}
      height={height}
      src={addQueryParamToURL({ url: src, width, height })}
    />
  )
}

export default Image
