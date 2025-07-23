import { getCollection } from "astro:content";

type Tool = Awaited<ReturnType<typeof getCollection<"tools">>>[number];

/**
 * Get all sub-tools of a specific tool
 */
export async function getSubTools(tool: Tool): Promise<Tool[]> {
  const allTools = await getCollection("tools");
  return allTools.filter(
    (x) => x.id.includes("/") && x.id.split("/")[0] == tool.id,
  );
}
