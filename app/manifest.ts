import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Habit League",
    short_name: "Habit League",
    description:
      "A social habit tracker for weekly goals, point budgets, and league leaderboards.",
    start_url: "/app",
    display: "standalone",
    background_color: "#f6efe3",
    theme_color: "#14231c",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
