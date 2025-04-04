// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://cryszon.github.io",
  integrations: [
    tailwind({
      applyBaseStyles: false, // Prevents Tailwind conflicting with PicoCSS
    }),
  ],
  trailingSlash: "always",
});
