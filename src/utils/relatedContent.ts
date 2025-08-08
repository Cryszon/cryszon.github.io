import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Get all articles related to a specific tool. The article must have a tag
 * that matches the tool ID.
 *
 * @param tool
 */
export async function getToolArticles(
  tool: CollectionEntry<"tools">,
): Promise<CollectionEntry<"posts">[]> {
  return (await getCollection("posts")).filter((x) =>
    x.data.tags.includes(tool.id),
  );
}
