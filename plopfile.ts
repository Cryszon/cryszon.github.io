import type { NodePlopAPI } from "plop";

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
