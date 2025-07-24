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
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/tools" }),
  schema: z.object({
    title: z.string(),
    datePublished: z.date(),
    dateUpdated: z.date().optional(),
    tags: z.array(z.string()).nonempty(),
    /**
     * Any installed icon supported by `astro-icon`
     */
    icon: z.string().nullable().optional(),
    inToolbox: z.enum(["active", "previous"]),
    /**
     * Links associated with this tool.
     *
     * Keys are link titles and values are link targets. For some specific
     * service links, a custom icon may be used.
     */
    links: z
      .object({
        GitHub: z.string().nullable(),
        Website: z.string().nullable(),
      })
      .catchall(z.string().nullable().optional())
      .default({ GitHub: "", Website: "" }),
    /**
     * Default icon when no icon is specified
     */
    defaultIcon: z
      .literal("heroicons:question-mark-circle")
      .default("heroicons:question-mark-circle"),
  }),
});

export const collections = {
  posts: postsCollection,
  pageContent: pageContentCollection,
  tools,
};
