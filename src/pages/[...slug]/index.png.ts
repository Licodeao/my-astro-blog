import { getCollection } from "astro:content";
import { generateOgImage } from "../../utils/generateOgImage";
import type { APIRoute, GetStaticPaths, GetStaticPathsItem } from "astro";

export const getStaticPaths: GetStaticPaths = async () => {
  const result: GetStaticPathsItem[] = [];

  const blogs = await getCollection("articles");

  blogs.forEach((blog) =>
    result.push({
      params: { slug: `articles/${blog.slug}/${blog.slug.split("/")[1]}` },
      props: {
        title: blog.data.title,
        date: blog.data.publishDate,
      },
    })
  );

  return result;
};

export const GET: APIRoute = async ({ props }) => {
  const response = await generateOgImage(props.title, props.date);
  return new Response(response, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
};
