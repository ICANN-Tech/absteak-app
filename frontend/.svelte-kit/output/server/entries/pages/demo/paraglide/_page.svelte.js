import { e as escape_html, p as pop, c as push } from "../../../../chunks/index2.js";
import { g as getLocale, t as trackMessageCall } from "../../../../chunks/runtime.js";
import "../../../../chunks/client.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/state.svelte.js";
const en_hello_world = (
  /** @type {(inputs: { name: NonNullable<unknown> }) => string} */
  (i) => {
    return `Hello, ${i.name} from en!`;
  }
);
const id_hello_world = (
  /** @type {(inputs: { name: NonNullable<unknown> }) => string} */
  (i) => {
    return `Hello, ${i.name} from id!`;
  }
);
const hello_world = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("hello_world", locale);
  if (locale === "en") return en_hello_world(inputs);
  return id_hello_world(inputs);
};
function _page($$payload, $$props) {
  push();
  $$payload.out.push(`<h1>${escape_html(/* @__PURE__ */ hello_world({ name: "SvelteKit User" }))}</h1> <div><button>en</button> <button>id</button></div><p>If you use VSCode, install the <a href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension" target="_blank">Sherlock i18n extension</a> for a better i18n experience.</p>`);
  pop();
}
export {
  _page as default
};
