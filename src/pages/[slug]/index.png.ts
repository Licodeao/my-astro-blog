import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getnerateOgImage } from "../../utils/generateOgImage";

export async function getStaticPaths() {
  const articles = await getCollection("articles").then((p) =>
    p.filter(({ data }) => data.img && data.img_alt)
  );

  return articles.map((article) => ({
    params: { slug: article.slug },
    props: article,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await getnerateOgImage(props as CollectionEntry<"articles">), {
    headers: {
      "Content-Type": "image/png",
    },
  });
