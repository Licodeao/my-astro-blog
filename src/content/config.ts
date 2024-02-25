import { defineCollection, z } from "astro:content";

// 定义内容集合的验证规则，如 md 文件的 frontmatter
export const collections = {
  articles: defineCollection({
    type: "content",
    schema: z.object({
      author: z.string(),
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()),
      img: z.string(),
      img_alt: z.string().optional(),
      site: z.string().optional(),
    }),
  }),
};
