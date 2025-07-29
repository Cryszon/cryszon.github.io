import type { NodePlopAPI } from "plop";
import tool from "./plop-templates/tool.ts";

export default function (plop: NodePlopAPI) {
  plop.setGenerator("tool", tool);
}
