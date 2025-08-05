import { c as push, f as fallback, m as ensure_array_like, o as slot, q as attr_style, e as escape_html, t as attr_class, v as attr, w as clsx, x as stringify, b as bind_props, p as pop, y as copy_payload, z as assign_payload, h as head } from "../../../../chunks/index2.js";
import "../../../../chunks/Index.svelte_svelte_type_style_lang.js";
import "../../../../chunks/Index.svelte_svelte_type_style_lang2.js";
import { d as defaultPaymentMethods, g as groupMethodsByType, I as Index, a as getMethodIcon, b as getMethodClasses, f as formatFee, i as isMethodSelected, c as getTypeLabel } from "../../../../chunks/method.js";
import "../../../../chunks/initialize.js";
import { C as CheckCircleSolid } from "../../../../chunks/CheckCircleSolid.js";
function Method($$payload, $$props) {
  push();
  let groupedMethods, heightStyles;
  let paymentMethods = fallback($$props["paymentMethods"], defaultPaymentMethods);
  let selectedMethod = fallback($$props["selectedMethod"], null);
  let disabled = fallback($$props["disabled"], false);
  let minHeight = fallback($$props["minHeight"], "auto");
  let height = fallback($$props["height"], "auto");
  let maxHeight = fallback($$props["maxHeight"], "40vh");
  let onMethodSelected = fallback($$props["onMethodSelected"], void 0);
  let onMethodDeselected = fallback($$props["onMethodDeselected"], void 0);
  function isSelected(method) {
    return isMethodSelected(method, selectedMethod);
  }
  groupedMethods = groupMethodsByType(paymentMethods);
  heightStyles = `min-height: ${minHeight}; height: ${height}; max-height: ${maxHeight};`;
  Index($$payload, {
    variant: "elegant",
    size: "full",
    padding: "xl",
    class: "col-span-3 w-full h-full",
    children: ($$payload2) => {
      const each_array = ensure_array_like(Object.entries(groupedMethods));
      $$payload2.out.push(`<div class="space-y-6"><!---->`);
      slot($$payload2, $$props, "header", {}, () => {
        $$payload2.out.push(`<div class="border-b border-gray-700 pb-4 text-center"><h3 class="mb-2 text-2xl font-bold text-white">Metode Pembayaran</h3> <p class="text-gray-300">Pilih metode pembayaran yang Anda inginkan</p></div>`);
      });
      $$payload2.out.push(`<!----> <div class="scrollbar space-y-6 overflow-y-auto pr-3 pb-4"${attr_style(heightStyles)} role="region" aria-label="Payment method selection"><!--[-->`);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let [type, methods] = each_array[$$index_1];
        const each_array_1 = ensure_array_like(methods);
        $$payload2.out.push(`<div class="space-y-4"><h4 class="text-lg font-semibold text-orange-400 flex items-center gap-2"><!---->`);
        getMethodIcon(methods[0])?.($$payload2, { class: "h-5 w-5" });
        $$payload2.out.push(`<!----> ${escape_html(getTypeLabel(type))}</h4> <div class="grid grid-cols-1 gap-3 md:grid-cols-2"><!--[-->`);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let method = each_array_1[$$index];
          $$payload2.out.push(`<div${attr_class(clsx(getMethodClasses(method, isSelected(method), disabled)))} role="button"${attr("tabindex", disabled || !method.available ? -1 : 0)}>`);
          if (isSelected(method)) {
            $$payload2.out.push("<!--[-->");
            $$payload2.out.push(`<div class="absolute right-3 top-3">`);
            CheckCircleSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
            $$payload2.out.push(`<!----></div>`);
          } else {
            $$payload2.out.push("<!--[!-->");
          }
          $$payload2.out.push(`<!--]--> <div class="space-y-3"><div class="flex items-center gap-3"><!---->`);
          getMethodIcon(method)?.($$payload2, { class: "h-6 w-6 flex-shrink-0 text-orange-400" });
          $$payload2.out.push(`<!----> <div class="flex-1"><h5 class="font-semibold text-white transition-colors group-hover:text-orange-400">${escape_html(method.name)}</h5> <p class="text-xs text-gray-400">${escape_html(method.description)}</p></div></div> <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-4"><div class="flex items-center gap-1"><span class="text-gray-400">Biaya:</span> <span${attr_class(`font-medium ${stringify((method.fee ?? 0) === 0 ? "text-green-400" : "text-yellow-400")}`)}>${escape_html(formatFee(method.fee))}</span></div> `);
          if (method.processingTime) {
            $$payload2.out.push("<!--[-->");
            $$payload2.out.push(`<div class="flex items-center gap-1"><span class="text-gray-400">Proses:</span> <span class="font-medium text-blue-400">${escape_html(method.processingTime)}</span></div>`);
          } else {
            $$payload2.out.push("<!--[!-->");
          }
          $$payload2.out.push(`<!--]--></div> <div class="flex items-center gap-1"><div${attr_class(`h-2 w-2 rounded-full ${stringify(method.available ? "bg-green-500" : "bg-red-500")}`)}></div> <span${attr_class(`text-xs font-medium ${stringify(method.available ? "text-green-400" : "text-red-400")}`)}>${escape_html(method.available ? "Tersedia" : "Tidak Tersedia")}</span></div></div></div> `);
          if (method.available && !disabled) {
            $$payload2.out.push("<!--[-->");
            $$payload2.out.push(`<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>`);
          } else {
            $$payload2.out.push("<!--[!-->");
          }
          $$payload2.out.push(`<!--]--></div>`);
        }
        $$payload2.out.push(`<!--]--></div></div>`);
      }
      $$payload2.out.push(`<!--]--></div> `);
      if (selectedMethod) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4"><div class="flex items-center justify-between"><div class="flex items-center gap-3">`);
        CheckCircleSolid($$payload2, { class: "h-5 w-5 flex-shrink-0 text-orange-500" });
        $$payload2.out.push(`<!----> <div><p class="text-sm font-medium text-orange-400">Metode Terpilih:</p> <p class="font-semibold text-white">${escape_html(selectedMethod.name)}</p></div></div> <div class="text-right"><p class="text-sm text-gray-400">Biaya Admin</p> <p${attr_class(`font-semibold ${stringify((selectedMethod.fee ?? 0) === 0 ? "text-green-400" : "text-yellow-400")}`)}>${escape_html(formatFee(selectedMethod.fee))}</p></div></div></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--> <!---->`);
      slot($$payload2, $$props, "footer", {}, () => {
      });
      $$payload2.out.push(`<!----></div>`);
    }
  });
  bind_props($$props, {
    paymentMethods,
    selectedMethod,
    disabled,
    minHeight,
    height,
    maxHeight,
    onMethodSelected,
    onMethodDeselected
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  let selectedMethod = null;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Payment Method Demo - ABSteak</title>`;
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8"><div class="mx-auto max-w-4xl"><div class="mb-8 text-center"><h1 class="mb-4 text-4xl font-bold text-white">Payment Method Demo</h1> <p class="text-gray-300">Demo komponen payment method dengan scroll dan selection</p></div> <div class="rounded-2xl bg-gray-900/50 p-6 backdrop-blur-sm">`);
    Method($$payload2, {
      get selectedMethod() {
        return selectedMethod;
      },
      set selectedMethod($$value) {
        selectedMethod = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----></div> `);
    if (selectedMethod) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-6"><h3 class="mb-4 text-xl font-semibold text-green-400">Selected Payment Method</h3> <div class="grid grid-cols-1 gap-4 md:grid-cols-2"><div><p class="text-sm text-gray-400">Name:</p> <p class="font-medium text-white">${escape_html(selectedMethod.name)}</p></div> <div><p class="text-sm text-gray-400">Type:</p> <p class="font-medium text-white">${escape_html(selectedMethod.type)}</p></div> <div><p class="text-sm text-gray-400">Fee:</p> <p class="font-medium text-white">${escape_html((selectedMethod.fee ?? 0) === 0 ? "Gratis" : `Rp ${(selectedMethod.fee ?? 0).toLocaleString("id-ID")}`)}</p></div> <div><p class="text-sm text-gray-400">Processing Time:</p> <p class="font-medium text-white">${escape_html(selectedMethod.processingTime)}</p></div></div></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--></div></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
