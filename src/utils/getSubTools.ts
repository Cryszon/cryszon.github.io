import { getCollection, type CollectionEntry } from "astro:content";

type Tool = CollectionEntry<"tools">;

/**
 * Get all sub-tools of a specific tool
 */
export async function getSubTools(tool: Tool): Promise<Tool[]> {
  const allTools = await getCollection("tools");
  return allTools.filter(
    (x) => x.id.includes("/") && x.id.split("/")[0] == tool.id,
  );
}
