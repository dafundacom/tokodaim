import { defineConfig } from "astro/config"
import cloudflare from "@astrojs/cloudflare"
import partytown from "@astrojs/partytown"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PUBLIC_SITE_URL ?? "http://localhost:4321",
  output: "server",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  adapter: cloudflare({
    mode: "directory",
    imageService: "cloudflare",
    functionPerRoute: true,
    runtime: {
      mode: "local",
      type: "pages",
    },
    bindings: {
      DB: {
        type: "d1",
      },
    },
    platformProxy: {
      enabled: true,
    },
  }),
  image: {
    domains: ["secure.gravatar.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "assets.tripay.co.id",
      },
      {
        protocol: "https",
        hostname: "**.tokodaim.com",
      },
      {
        protocol: "https",
        hostname: import.meta.env.PUBLIC_DOMAIN,
      },
      {
        protocol: "https",
        hostname: `*.${import.meta.env.PUBLIC_DOMAIN}`,
      },
      {
        protocol: "https",
        hostname: `media.${import.meta.env.PUBLIC_DOMAIN}`,
      },
      {
        protocol: "https",
        hostname: `cdn.${import.meta.env.PUBLIC_DOMAIN}`,
      },
    ],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["oslo"],
    },
    ssr: {
      external: [
        "node:buffer",
        "node:util",
        "node:path",
        "node:child_process",
        "node:stream",
        "node:cripto",
        "node:fs",
        "node:os",
      ],
    },
  },
})

