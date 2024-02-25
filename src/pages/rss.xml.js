import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const articles = await getCollection("articles");
  return rss({
    title: "Licodeao's Blog",
    description: "Recording life and coding journey of Licodeao",
    site: "https://licodeao.top",
    items: articles.map((article) => ({
      title: article.data.title,
      link: `/article/${article.slug}/`,
      guid: `/article/${article.slug}/`,
      author: article.data.author,
      description: article.data.description,
      pubDate: article.data.publishDate,
    })),
    customData: `<language>en</language>`,
  });
}
