import sharp from "sharp";
import { readFile } from "node:fs/promises";
import satori, { type SatoriOptions } from "satori";
import { Template } from "./template";
import { loadEmoji, getIconCode } from "./generateEmoji";

export const generateOgImage = async (
  text: string = "Default Title",
  date: Date = new Date()
): Promise<Buffer> => {
  const options: SatoriOptions = {
    width: 600,
    height: 315,
    embedFont: true,
    fonts: [
      {
        name: "ZCOOLKuaiLe",
        data: await readFile("public/fonts/ZCOOLKuaiLe-Regular.ttf"),
        weight: 600,
        style: "normal",
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {
        return `data:image/svg+xml;base64, ${btoa(
          await loadEmoji("twemoji", getIconCode(segment))
        )}`;
      }

      return code;
    },
  };

  const svg = await satori(
    Template({
      title: text,
      date: date,
    }),
    options
  );

  const sharpSvg = Buffer.from(svg);

  const buffer = await sharp(sharpSvg).toBuffer();

  return buffer;
};
