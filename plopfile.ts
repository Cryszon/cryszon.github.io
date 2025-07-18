import type { z } from "astro:content";
import type { NodePlopAPI } from "plop";
import type { collections } from "./src/content.config";
import type { OrReturnType } from "./src/types/utils";
import { kebabCase } from "es-toolkit";

export default function (plop: NodePlopAPI) {
  plop.setGenerator("tool", {
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
        name: "links.github",
        message: "GitHub link",
      },
      {
        type: "input",
        name: "links.website",
        message: "Website link",
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
        path: "src/content/tools/{{kebabCase title}}.md",
        templateFile: "plop-templates/tool.hbs",
        data: {
          currentDate: new Date().toISOString().split("T")[0],
        },
      },
    ],
  });
}
