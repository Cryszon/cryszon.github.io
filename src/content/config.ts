import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    datePublished: z.date(),
    dateUpdated: z.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const pageContentCollection = defineCollection({
  type: "content",
});

export const collections = {
  posts: postsCollection,
  pageContent: pageContentCollection,
};
