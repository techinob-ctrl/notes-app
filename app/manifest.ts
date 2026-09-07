import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Orange and Tabby cat",
    short_name: "Orange & Tabby",
    description: "Your thoughts. Their territory. A cozy cat-themed notebook.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#fb923c",
    icons: [
      { src: "/cats/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/cats/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
