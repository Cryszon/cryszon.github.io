import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { postsSchema, toolsSchema } from "./content.schema";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: postsSchema,
});

const tools = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/tools" }),
  schema: toolsSchema,
});

export const collections = {
  posts: postsCollection,
  tools,
};
export { toolsSchema };
