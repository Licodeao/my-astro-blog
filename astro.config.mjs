import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";

const options = {
  theme: "one-dark-pro",
};

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, options]],
  },
  site: "https://licodeao.top",
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
