import { A as clsx, a as spread_attributes, w as clsx$1, p as pop, c as push, s as sanitize_props, r as rest_props, f as fallback, b as bind_props, i as store_get, o as slot, t as attr_class, q as attr_style, v as attr, e as escape_html, u as unsubscribe_stores, x as stringify } from "./index2.js";
import { c as cubicOut } from "./index6.js";
import { o as onDestroy } from "./index-server.js";
import { d as derived } from "./index7.js";
import { i as isVideoModalActive, m as modalStore, a as modalManager } from "./Index.svelte_svelte_type_style_lang2.js";
import { k as kbd } from "./Index.svelte_svelte_type_style_lang.js";
import { g as getTheme } from "./themeUtils.js";
function Kbd($$payload, $$props) {
  push();
  let { children, class: className, $$slots, $$events, ...restProps } = $$props;
  const theme = getTheme("kbd");
  const kbdCls = kbd({ class: clsx(theme, className) });
  $$payload.out.push(`<kbd${spread_attributes({ ...restProps, class: clsx$1(kbdCls) }, null)}>`);
  children($$payload);
  $$payload.out.push(`<!----></kbd>`);
  pop();
}
function LeftMouse($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "color", "className"]);
  push();
  let size = fallback($$props["size"], "md");
  let color = fallback($$props["color"], "primary");
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  }[size];
  const colorClass = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    danger: "text-danger",
    warning: "text-warning",
    info: "text-info",
    white: "text-white",
    black: "text-black"
  }[color];
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass} ${colorClass} ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      viewBox: "0 0 800 800"
    },
    null,
    void 0,
    void 0,
    3
  )}><path fill-rule="evenodd" d="M384.7 1.1c-68.3 3.7-132.7 25-178 58.7-11.3 8.4-28 24.2-36.2 34.2-16.4 20.1-27.9 44-33.4 69.5-4.1 18.6-4.2 27.6-3.9 214l.4 179 2.2 13.8c7.9 48.4 23.7 86.1 52.6 124.7 9.1 12.2 37.4 40.5 49.6 49.6 40.1 30 81.7 46.9 129.6 53 15.4 1.9 46.5 2.2 60.9.5 63.5-7.5 118.6-34.5 162.6-79.7 40.8-42 64.2-90 73.6-151.3 1.5-9.4 1.7-30.2 2-189.6.4-186.4.3-196-3.8-215.9-7.6-37.4-28.7-72.5-58.6-97.6C559.7 26.7 498.6 5 426.2 1c-19.5-1.1-20.2-1.1-41.5.1m49.8 50c27 2.3 47.7 6.4 70.9 14 30.3 10 55.2 24.5 74.1 43.4 19 18.8 29.5 38 35.2 63.7 1.6 7.6 1.8 14.3 1.8 80.7v72.4l-8 3c-45.4 16.5-96.2 26.8-151 30.8-19.3 1.3-69.4 1.3-90-.1-33.4-2.3-70-7.1-102.5-13.6-20.3-4.1-56-12.9-71.1-17.7l-10.4-3.3-.3-66.4c-.3-70.5-.1-75.3 4.4-90.8C205.9 104 281.3 59.1 383.5 50.7c9.5-.8 40-.6 51 .4M200.4 381.5c117.3 32.6 245.4 37.8 351.6 14.4 20.1-4.4 52.4-13.4 63.8-17.7 1.1-.4 1.2 16.1.9 89.9-.3 87.5-.4 90.8-2.5 101.4-4.6 23.6-10.6 41.5-20.4 60.9-27.3 53.6-75.1 93.7-131.9 110.6-45.7 13.6-95.7 11.6-139.7-5.6-76.3-29.7-129.3-98.6-138.1-179.6-1.2-10.5-1.6-178.8-.5-178.8.4 0 7.9 2 16.8 4.5" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M395.6 85c-8.1 2.5-15 10.5-16.7 19.4-.6 3.4-.9 40.3-.7 98.7.3 103.5-.1 96.3 6.9 104.4 6.4 7.3 18.1 9.8 27.7 6 5.7-2.3 12.6-10.1 14.1-15.9.8-3.2 1.1-31.9 1.1-97.9 0-103.1.2-100-6.3-107.4-6-6.9-17.1-10-26.1-7.3M341 90.7c-8.5.9-25.8 4.6-34.2 7.4-38 12.4-68.7 38.7-84.9 72.6-7.9 16.5-13.5 37.8-15.9 59.5-2 19-.5 65 2.2 68.5 1.1 1.3 42.8 11.7 65.3 16.2 29.7 5.9 63.4 9.6 70.8 7.7l2.7-.6V206c0-92.2-.3-116-1.2-115.8-.7 0-2.9.3-4.8.5" clip-rule="evenodd"></path></svg>`);
  bind_props($$props, { size, color, className });
  pop();
}
function Index($$payload, $$props) {
  push();
  var $$store_subs;
  let id = $$props["id"];
  let title = fallback($$props["title"], "");
  let onClose = $$props["onClose"];
  let closeOnBackdrop = fallback($$props["closeOnBackdrop"], true);
  let closeOnEscape = fallback($$props["closeOnEscape"], true);
  let preventScroll = fallback($$props["preventScroll"], true);
  let trapFocus = fallback($$props["trapFocus"], true);
  let animationDuration = fallback($$props["animationDuration"], 100);
  let animationEasing = fallback($$props["animationEasing"], cubicOut);
  let modalClass = fallback($$props["modalClass"], "");
  let backdropClass = fallback($$props["backdropClass"], "");
  let headerClass = fallback($$props["headerClass"], "");
  let contentClass = fallback($$props["contentClass"], "");
  let footerClass = fallback($$props["footerClass"], "");
  let showHeader = fallback($$props["showHeader"], true);
  let showCloseButton = fallback($$props["showCloseButton"], true);
  let showFooter = fallback($$props["showFooter"], false);
  const isOpen = derived(modalStore, ($store) => {
    if (id && id.includes("video")) {
      return $store.isOpen && isVideoModalActive();
    } else {
      return $store.isOpen && !isVideoModalActive();
    }
  });
  const modalData = derived(modalStore, ($store) => ({
    item: $store.item,
    title: $store.item?.name || "",
    content: $store.item?.desc || "",
    type: "default",
    data: $store.item
  }));
  onDestroy(() => {
  });
  if (store_get($$store_subs ??= {}, "$isOpen", isOpen)) {
    if (preventScroll && typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  } else {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }
  modalManager.modal.setModalOpen(store_get($$store_subs ??= {}, "$isOpen", isOpen));
  $$payload.out.push(`<!---->`);
  slot($$payload, $$props, "event", {}, null);
  $$payload.out.push(`<!---->  `);
  if (store_get($$store_subs ??= {}, "$isOpen", isOpen)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div tabindex="0" aria-label="Close modal"${attr_class(`modal-overlay ${stringify(modalClass)}`, "svelte-11a7c8g")}${attr_style(`--animation-duration: ${stringify(animationDuration)}ms; --animation-easing: ${stringify(animationEasing)};`)} role="dialog" aria-modal="true"${attr("aria-labelledby", showHeader ? "modal-title" : void 0)}>`);
    if (closeOnEscape) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="bg-primary-950/20 group absolute bottom-6 left-6 z-10 flex min-w-32 cursor-pointer items-center gap-2 rounded-xl p-6 px-4 py-3 backdrop-blur-md transition-all duration-200"><div class="w-full relative flex items-center justify-center"><div class="flex flex-wrap gap-2 items-center transition-all duration-200 group-hover:invisible group-hover:opacity-0">`);
      Kbd($$payload, {
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->Esc`);
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----> <span class="ml-2 text-sm text-white/80">to close</span></div> <div class="flex flex-wrap gap-2 items-center invisible absolute opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">`);
      Kbd($$payload, {
        children: ($$payload2) => {
          LeftMouse($$payload2, { size: "sm", color: "black" });
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----> <span class="ml-2 text-sm text-white/80">to close</span></div></div></button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <div${attr_class(`modal-backdrop ${stringify(backdropClass)}`, "svelte-11a7c8g")} role="presentation"><div${attr_class(`modal-content mx-auto ${stringify(contentClass)}`, "svelte-11a7c8g")}>`);
    if (showHeader) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<header${attr_class(`modal-header ${stringify(headerClass)}`, "svelte-11a7c8g")}><h2 id="modal-title" class="modal-title svelte-11a7c8g">${escape_html(store_get($$store_subs ??= {}, "$modalData", modalData).title)}</h2> `);
      if (showCloseButton) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button type="button" class="modal-close-button svelte-11a7c8g" aria-label="Close modal"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></header>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <main class="modal-body svelte-11a7c8g"><!---->`);
    slot(
      $$payload,
      $$props,
      "default",
      {
        modalData: store_get($$store_subs ??= {}, "$modalData", modalData),
        isOpen: store_get($$store_subs ??= {}, "$isOpen", isOpen)
      },
      () => {
        if (store_get($$store_subs ??= {}, "$modalData", modalData).content) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<p>${escape_html(store_get($$store_subs ??= {}, "$modalData", modalData).content)}</p>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--> `);
        if (store_get($$store_subs ??= {}, "$modalData", modalData).item) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="modal-item-details svelte-11a7c8g"><h3 class="svelte-11a7c8g">Item Details</h3> <pre class="svelte-11a7c8g">${escape_html(JSON.stringify(store_get($$store_subs ??= {}, "$modalData", modalData).item, null, 2))}</pre></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]-->`);
      }
    );
    $$payload.out.push(`<!----></main> `);
    if (showFooter) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<footer${attr_class(`modal-footer ${stringify(footerClass)}`, "svelte-11a7c8g")}><!---->`);
      slot(
        $$payload,
        $$props,
        "footer",
        {
          modalData: store_get($$store_subs ??= {}, "$modalData", modalData),
          isOpen: store_get($$store_subs ??= {}, "$isOpen", isOpen)
        },
        () => {
          $$payload.out.push(`<button type="button" class="modal-button modal-button-secondary svelte-11a7c8g">Cancel</button> <button type="button" class="modal-button modal-button-primary svelte-11a7c8g">OK</button>`);
        }
      );
      $$payload.out.push(`<!----></footer>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    id,
    title,
    onClose,
    closeOnBackdrop,
    closeOnEscape,
    preventScroll,
    trapFocus,
    animationDuration,
    animationEasing,
    modalClass,
    backdropClass,
    headerClass,
    contentClass,
    footerClass,
    showHeader,
    showCloseButton,
    showFooter
  });
  pop();
}
export {
  Index as I
};
