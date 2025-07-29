import type { z } from "astro:content";
import type { PlopGeneratorConfig } from "plop";
import type { OrReturnType } from "../src/types/utils";
import type { collections } from "../src/content.config";
import { kebabCase } from "es-toolkit";

export default {
    description: "Creates a new content entry for tools",
    prompts: [
      {
        type: "input",
        name: "title",
        message: "Tool name",
      },
      {
        type: "input",
        name: "icon",
        message:
          "Icon for the tool from https://icones.js.org/collection/simple-icons",
        default: (answers: { title: string }) => {
          return "simple-icons:" + kebabCase(answers.title);
        },
      },
      {
        type: "input",
        name: "links.website",
        message: "Website link",
      },
      {
        type: "input",
        name: "links.github",
        message: "GitHub link",
      },
      {
        type: "input",
        name: "parentTool",
        message: "If this is a sub-tool, enter the ID of the parent tool",
      },
      {
        type: "input",
        name: "tags",
        message: "Tags (comma separated)",
        validate: (x: string) => x.length > 0 || "At least one tag is required",
        filter: (input: string) => {
          if (!input) {
            return input;
          }
          return `[${input.toLowerCase()}]`;
        },
      },
      {
        type: "list",
        name: "inToolbox",
        choices: ["yes", "no"],
        message: "Are you currently using this tool?",
        filter: (input: string) => {
          // The following code ensures that `yes` and `no` responses map to
          // valid `inToolbox` values for the tools content schema. It's by no
          // means necessary as Astro validates the schema anyway, but it was a
          // decent learning exercise.
          const inputMap = {
            yes: "active",
            no: "previous",
          } as const satisfies Record<
            // Use `yes` and `no` choices as keys
            "yes" | "no",
            // Infer valid `inToolbox` values from Astro content collection
            // schema. Content collection schema can be either a method, an
            // object literal or undefined so we use a combination of
            // NonNullable and OrReturnType to make sure we only get the object
            // schema.
            z.infer<
              OrReturnType<NonNullable<typeof collections.tools.schema>>
            >["inToolbox"]
          >;
          return input in inputMap
            ? inputMap[input as keyof typeof inputMap]
            : "yes";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/content/tools/{{#if parentTool}}{{parentTool}}/{{/if}}{{kebabCase title}}.md",
        templateFile: "plop-templates/tool.hbs",
        data: {
          currentDate: new Date().toISOString().split("T")[0],
        },
      },
    ],
} satisfies Partial<PlopGeneratorConfig>
