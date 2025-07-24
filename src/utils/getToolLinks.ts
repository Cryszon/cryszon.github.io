import { type CollectionEntry } from "astro:content";
import { toPairs } from "es-toolkit/compat";

interface ToolLink {
  name: string;
  href?: string | null;
  icon?: string | null;
}

/**
 * Preferred order of links based on their name (case-insensitive).
 *
 * Other links are in alphabetical order.
 */
const preferredOrderByName: Lowercase<string>[] = ["github", "website"];

/**
 * Icons for specific link names (case-insensitive)
 */
const linkIcons: Record<Lowercase<string>, string> = {
  github: "simple-icons:github",
  website: "mynaui/globe",
};

const defaultLinkIcon = "heroicons:link";

/**
 * Extracts tool links from a tool and returns them sorted in a preferred order
 * with icons.
 */
export function getToolLinks(
  links: CollectionEntry<"tools">["data"]["links"],
): ToolLink[] {
  return (
    // 1. Convert object to tuple array (Object.entries())
    toPairs(links)
      // 2. Sort specific links in consistent order
      .toSorted(([name1], [name2]) => {
        const [preferredIndex1, preferredIndex2] = [name1, name2].map((x) =>
          preferredOrderByName.indexOf(
            x.toLowerCase() as (typeof preferredOrderByName)[number],
          ),
        );

        // If either index is -1 we need to reverse the order to make sure
        // non-preferred links are put last
        if (preferredIndex1 === -1 || preferredIndex2 === -1) {
          return preferredIndex2 - preferredIndex1;
        }

        return preferredIndex1 - preferredIndex2;
      })
      // Add icons to links
      .map(([name, href]): ToolLink => {
        return {
          name,
          href,
          icon:
            linkIcons[name.toLocaleLowerCase() as keyof typeof linkIcons] ??
            defaultLinkIcon,
        };
      })
  );
}
