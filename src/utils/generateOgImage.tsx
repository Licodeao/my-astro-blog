import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import articleOgImage from "./template";
import { getIconCode, loadEmoji } from "./generateEmoji";

const isDev = import.meta.env.DEV;
const website = isDev ? "http://lcoalhost:4321" : "https://licodeao.top";

const fetchFonts = async () => {
  const fontFile = await fetch(`${website}/fonts/ZCOOLKuaiLe-Regular.ttf`);
  const fontBuffer = await fontFile.arrayBuffer();
  return { fontBuffer };
};

const { fontBuffer } = await fetchFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "ZCOOL KuaiLe",
      data: fontBuffer,
      weight: 400,
      style: "normal",
    },
  ],
  loadAdditionalAsset: async (code: string, segment: string) => {
    if (code === "emoji") {
      return (
        `data:image/svg+xml;base64,` +
        btoa(await loadEmoji("twemoji", getIconCode(segment)))
      );
    }

    return (
      `data:image/svg+xml;base64,` + btoa(await loadEmoji("twemoji", "1f92f"))
    );
  },
} as any;

export async function getnerateOgImage(article: CollectionEntry<"articles">) {
  const svg = await satori(articleOgImage(article), options);
  return svgBufferToPngBuffer(svg);
}

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}
