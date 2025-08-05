import { g as getContext } from "./index2.js";
import "./Index.svelte_svelte_type_style_lang.js";
function getTheme(componentKey) {
  const theme = getContext("theme");
  return theme?.[componentKey];
}
export {
  getTheme as g
};
