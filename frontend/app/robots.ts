import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal/private/"],
    },
    sitemap: "https://finora.io/sitemap.xml",
  }
}
