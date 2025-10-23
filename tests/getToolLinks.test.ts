import type { CollectionEntry } from "astro:content";
import { expect, test } from "bun:test";
import { getToolLinks } from "../src/utils/getToolLinks";

type ToolDataLinks = CollectionEntry<"tools">["data"]["links"];

test("getToolLinks", () => {
  // Specify links in arbitrary order
  const links: ToolDataLinks = {
    Website: "https://cryszon.github.io/",
    "Reun Media": "https://reun.eu/",
    GitHub: "https://github.com/Cryszon/cryszon.github.io",
  };

  const sortedLinks = getToolLinks(links);

  expect(
    sortedLinks,
    "Links should be sorted and contain respective icons",
  ).toEqual([
    {
      name: "Website",
      href: "https://cryszon.github.io/",
      icon: "mynaui/globe",
    },
    {
      name: "GitHub",
      href: "https://github.com/Cryszon/cryszon.github.io",
      icon: "simple-icons:github",
    },
    {
      name: "Reun Media",
      href: "https://reun.eu/",
      icon: "heroicons:link",
    },
  ]);
});
