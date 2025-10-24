import { getCollection, type CollectionEntry } from "astro:content";

type Tool = CollectionEntry<"tools">;

/**
 * Get all sub-tools of a specific tool
 */
export async function getSubTools(tool: Tool): Promise<Tool[]> {
  return await getCollection("tools", ({ data }) => {
    return data.parentTool?.id === tool.id;
  });
}
