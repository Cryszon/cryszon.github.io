import type { PlopGeneratorConfig } from "plop";
import { toolsSchema } from "../src/content.schema.ts";
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
        name: "usageStatus",
        choices: toolsSchema.shape.usageStatus.options,
        message: "What's the current usage status of this tool?",
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
