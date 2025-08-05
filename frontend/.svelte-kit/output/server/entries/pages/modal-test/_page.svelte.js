import { p as pop, c as push } from "../../../chunks/index2.js";
import "../../../chunks/Index.svelte_svelte_type_style_lang.js";
import "../../../chunks/Index.svelte_svelte_type_style_lang2.js";
import "../../../chunks/initialize.js";
import { I as Index } from "../../../chunks/Index4.js";
function _page($$payload, $$props) {
  push();
  const modalId = "test-modal";
  $$payload.out.push(`<div class="min-h-screen bg-gray-100 flex items-center justify-center"><div class="text-center"><h1 class="text-3xl font-bold mb-8">Modal Test Page</h1> <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Open Test Modal</button> <div class="mt-8 text-sm text-gray-600"><p>Click the button to open the modal.</p> <p>Then click outside the modal content to test backdrop click functionality.</p></div></div></div> `);
  Index($$payload, {
    id: modalId,
    closeOnBackdrop: true,
    closeOnEscape: true,
    showHeader: true,
    showCloseButton: true,
    showFooter: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<div class="p-4"><p class="mb-4">This is the modal content. Click outside this white area to close the modal.</p> <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Close Modal</button></div>`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!---->`);
  pop();
}
export {
  _page as default
};
