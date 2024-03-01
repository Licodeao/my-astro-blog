import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import sitemap from "@astrojs/sitemap";

const options = {
  theme: "one-dark-pro",
};

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, options]],
  },
  site: "https://licodeao.top",
});
