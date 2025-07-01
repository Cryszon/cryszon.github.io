import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    datePublished: z.date(),
    dateUpdated: z.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const pageContentCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/pageContent",
  }),
});

export const collections = {
  posts: postsCollection,
  pageContent: pageContentCollection,
};
