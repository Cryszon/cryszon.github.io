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

const tools = defineCollection({
  loader: glob({ pattern: "[^_]*.{md,mdx}", base: "./src/content/tools" }),
  schema: z.object({
    title: z.string(),
    datePublished: z.date(),
    dateUpdated: z.date().optional(),
    tags: z.array(z.string()).nonempty(),
    /**
     * Any installed icon supported by `astro-icon`
     */
    icon: z.string().default("heroicons:question-mark-circle"),
    inToolbox: z.enum(["active", "previous"]),
    links: z
      .object({
        github: z.string().nullable().optional(),
        website: z.string().nullable().optional(),
      })
      .default({}),
  }),
});

export const collections = {
  posts: postsCollection,
  pageContent: pageContentCollection,
  tools,
};
