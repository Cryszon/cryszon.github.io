// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import normalizeTrailingSlash from "@reunmedia/astro-normalize-trailing-slash";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://cryszon.github.io",
  trailingSlash: "always",
  integrations: [normalizeTrailingSlash()],
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon()],
});
