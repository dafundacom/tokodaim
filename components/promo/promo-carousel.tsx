"use client"

import * as React from "react"
import Image from "next/image"
import NextLink from "next/link"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import env from "@/env"
import type { SelectMedia } from "@/lib/db/schema/media"
import type { SelectPromo } from "@/lib/db/schema/promo"

interface PromoCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  promos: (SelectPromo & {
    featuredImage: Pick<SelectMedia, "url">
  })[]
}

const PromoCarousel: React.FC<PromoCarouselProps> = (props) => {
  const { promos } = props

  return (
    <div
      className="my-16 flex w-full flex-row items-center justify-center"
      {...props}
    >
      <Carousel
        opts={{
          align: "center",
        }}
        plugins={[Autoplay({ playOnInit: true, delay: 5000 })]}
        className="w-full"
      >
        <CarouselContent className="flex">
          {promos.map((promo) => (
            <CarouselItem key={promo.id}>
              <NextLink
                href={`${env.NEXT_PUBLIC_SITE_URL}/promo/${promo.slug}`}
              >
                <Image
                  src={promo.featuredImage.url}
                  alt={promo.title}
                  fill
                  className="!relative !h-[200px] w-full overflow-hidden rounded-2xl object-cover lg:!h-[400px]"
                />
              </NextLink>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default PromoCarousel
