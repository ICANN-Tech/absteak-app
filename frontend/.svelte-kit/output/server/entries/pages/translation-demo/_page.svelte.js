import { e as escape_html, i as store_get, u as unsubscribe_stores, p as pop, c as push } from "../../../chunks/index2.js";
import { c as createTranslationStore, t } from "../../../chunks/translation.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const footerT = createTranslationStore("footer");
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const variables = { year: currentYear, name: "ABSteak Restaurant" };
  $$payload.out.push(`<div class="p-8 space-y-8"><h1 class="text-3xl font-bold text-center mb-8">Translation Variable Interpolation Demo</h1> <div class="space-y-6"><div class="bg-gray-100 p-6 rounded-lg"><h2 class="text-xl font-semibold mb-4">Using t() function with variables</h2> <div class="space-y-2"><p><strong>Raw translation:</strong> "© ${escape_html({ year })} ${escape_html({ name })}. All rights reserved."</p> <p><strong>With variables:</strong> ${escape_html(t("copyright", void 0, variables))}</p></div></div> <div class="bg-blue-50 p-6 rounded-lg"><h2 class="text-xl font-semibold mb-4">Using createTranslationStore with variables</h2> <div class="space-y-2"><p><strong>Footer namespace copyright:</strong></p> <p class="text-lg">${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("copyright", void 0, variables))}</p></div></div> <div class="bg-green-50 p-6 rounded-lg"><h2 class="text-xl font-semibold mb-4">Different variable combinations</h2> <div class="space-y-2"><p><strong>Only year:</strong> ${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("copyright", void 0, { year: currentYear }))}</p> <p><strong>Only name:</strong> ${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("copyright", void 0, { name: "My Restaurant" }))}</p> <p><strong>Custom values:</strong> ${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("copyright", void 0, { year: 2025, name: "Future Restaurant" }))}</p></div></div> <div class="bg-yellow-50 p-6 rounded-lg"><h2 class="text-xl font-semibold mb-4">Other footer translations</h2> <div class="space-y-2"><p><strong>Tagline:</strong> ${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("tagline"))}</p> <p><strong>Address:</strong> ${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("address"))}</p> <p><strong>Phone:</strong> ${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("phone"))}</p> <p><strong>Email:</strong> ${escape_html(store_get($$store_subs ??= {}, "$footerT", footerT)("email"))}</p></div></div> <div class="bg-purple-50 p-6 rounded-lg"><h2 class="text-xl font-semibold mb-4">Usage Examples</h2> <div class="space-y-4"><div><h3 class="font-semibold">In JavaScript/TypeScript:</h3> <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>import { t } from '$lib/utils/translation';

const variables = {
  year: new Date().getFullYear(),
  name: 'ABSteak Restaurant'
};

const copyrightText = t('copyright', undefined, variables);</code></pre></div> <div><h3 class="font-semibold">In Svelte component:</h3> <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>&lt;script>
  import { createTranslationStore } from '$lib/utils/translation';
  
  const footerT = createTranslationStore('footer');
  const variables = { year: 2024, name: 'ABSteak' };
&lt;/script>

&lt;p>{$footerT('copyright', undefined, variables)}&lt;/p></code></pre></div></div></div></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
