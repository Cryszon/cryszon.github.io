import { z } from "astro/zod";

// Use dynamic import for `reference()` with `z.string()` fallback so we can use
// this schema in Plop template outside Astro.
type AstroReference = typeof import("astro:content").reference;
const reference: AstroReference = import.meta.env.MODE
  ? (await import("astro:content")).reference
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (((_c: string) => z.string()) as unknown as AstroReference);

export const postsSchema = z.object({
  title: z.string(),
  datePublished: z.date(),
  dateUpdated: z.date().optional(),
  tags: z.array(z.string()).default([]),
});

export const toolsSchema = z.object({
  title: z.string(),
  datePublished: z.date(),
  dateUpdated: z.date().optional(),
  /**
   * List of tags for this tool.
   *
   * Special tags:
   *
   * - `made-by-me` - Displayed in a separate secion on tools page
   */
  tags: z.array(z.string()).nonempty(),
  /**
   * Any installed icon supported by `astro-icon`
   */
  icon: z.string().nullable().optional(),
  parentTool: reference("tools").nullable().optional(),
  usageStatus: z.enum(["inToolbox", "onTheShelf", "storedAway"]),
  favorite: z.boolean().default(false),
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
});
