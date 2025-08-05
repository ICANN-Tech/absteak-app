import { c as push, f as fallback, m as ensure_array_like, t as attr_class, w as clsx, q as attr_style, x as stringify, v as attr, e as escape_html, b as bind_props, p as pop, g as getContext, a as spread_attributes, A as clsx$1, C as spread_props, y as copy_payload, z as assign_payload, s as sanitize_props, r as rest_props, o as slot, i as store_get, u as unsubscribe_stores } from "../../chunks/index2.js";
import { t as tooltip, a as textarea } from "../../chunks/Index.svelte_svelte_type_style_lang.js";
import { m as modalStore, b as isVideoModalOpen, o as openVideoModal, c as closeVideoModal } from "../../chunks/Index.svelte_svelte_type_style_lang2.js";
import { C as ComponentId, j as highlightsData, k as currentHighlightIndex, a as viewportStore, v as viewportState } from "../../chunks/initialize.js";
import { d as derived, w as writable, g as get } from "../../chunks/index7.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import { L as Logo } from "../../chunks/Logo.js";
import { createAreaBasedStateVisibility, lockVisibility, createStateVisibility } from "../../chunks/visibility.js";
import { U as UI_TRANSITIONS, f as UI_TEXTS, b as UI_VARIANTS } from "../../chunks/base2.js";
import { a as fade } from "../../chunks/index5.js";
import { g as getTheme } from "../../chunks/themeUtils.js";
import { t as twMerge, C as CheckCircleSolid } from "../../chunks/CheckCircleSolid.js";
import { l as localeStore, c as createTranslationStore } from "../../chunks/translation.js";
import { L as Locale } from "../../chunks/locale.js";
import "../../chunks/base.js";
import "../../chunks/base3.js";
import "../../chunks/experience.js";
import "../../chunks/hero.js";
import { I as Index$h } from "../../chunks/Index9.js";
import { I as Index$g, E as ExclamationCircleSolid } from "../../chunks/Index10.js";
import { I as Index$f } from "../../chunks/Index4.js";
import { C as CloseButton, g as getInputClasses, b as getLabelClasses, U as UI_MESSAGES, c as getStepperContainerClasses, d as getStepperConnectorClasses, e as getStepperIndicatorClasses, I as Index$j, a as Index$k } from "../../chunks/Index8.js";
import { B as BuildingSolid, I as Index$i, d as defaultPaymentMethods, C as CreditCardSolid } from "../../chunks/method.js";
function Index$e($$payload, $$props) {
  push();
  let messages = fallback($$props["messages"], () => [], true);
  let containerClass = fallback($$props["containerClass"], "flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50 to-white");
  let userMessageClass = fallback($$props["userMessageClass"], "px-4 py-3 rounded-2xl rounded-tr-md mb-1 max-w-[85%] text-sm bg-white text-gray-800 shadow-lg border border-primary-200 backdrop-blur-sm");
  let botMessageClass = fallback($$props["botMessageClass"], "px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-primary-400");
  let botAvatarConfig = fallback(
    $$props["botAvatarConfig"],
    () => ({
      type: "icon",
      backgroundColor: "bg-gradient-to-br from-primary-500 to-primary-600",
      iconColor: "text-white"
    }),
    true
  );
  let showTimestamp = fallback($$props["showTimestamp"], false);
  let animationDelay = fallback($$props["animationDelay"], 50);
  let animationDuration = fallback($$props["animationDuration"], 300);
  let maxMessageWidth = fallback($$props["maxMessageWidth"], "85%");
  function scrollToBottom() {
  }
  function formatTimestamp(timestamp) {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const each_array = ensure_array_like(messages);
  $$payload.out.push(`<div${attr_class(clsx(containerClass), "svelte-qby8qr")}><!--[-->`);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let msg = each_array[i];
    $$payload.out.push(`<div${attr_class("flex svelte-qby8qr", void 0, { "justify-end": msg.from === "user" })}>`);
    if (msg.from === "bot") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex items-start gap-3 svelte-qby8qr"${attr_style(`max-width: ${stringify(maxMessageWidth)}`)}><button${attr_class(`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm transition-transform hover:scale-105 ${stringify(botAvatarConfig.backgroundColor || "bg-gradient-to-br from-primary-500 to-primary-600")}`, "svelte-qby8qr")} aria-label="Bot avatar">`);
      if (botAvatarConfig.type === "image" && botAvatarConfig.imageUrl) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<img${attr("src", botAvatarConfig.imageUrl)} alt="Bot avatar" class="w-full h-full rounded-full object-cover"/>`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<svg${attr_class(`w-4 h-4 ${stringify(botAvatarConfig.iconColor || "text-white")}`, "svelte-qby8qr")} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`);
      }
      $$payload.out.push(`<!--]--></button> <div class="flex flex-col svelte-qby8qr"><button${attr_class(clsx(botMessageClass), "svelte-qby8qr")}>${escape_html(msg.text)}</button> `);
      if (showTimestamp && msg.timestamp) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span class="text-xs text-gray-500 mt-1 ml-2">${escape_html(formatTimestamp(msg.timestamp))}</span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<div class="flex flex-col items-end svelte-qby8qr"${attr_style(`max-width: ${stringify(maxMessageWidth)}`)}><button${attr_class(clsx(userMessageClass), "svelte-qby8qr")}>${escape_html(msg.text)}</button> `);
      if (showTimestamp && msg.timestamp) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span class="text-xs text-gray-500 mt-1 mr-2">${escape_html(formatTimestamp(msg.timestamp))}</span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, {
    messages,
    containerClass,
    userMessageClass,
    botMessageClass,
    botAvatarConfig,
    showTimestamp,
    animationDelay,
    animationDuration,
    maxMessageWidth,
    scrollToBottom
  });
  pop();
}
function CalendarMonthSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "calendar month solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function ChevronLeftOutline($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    strokeWidth = ctx.strokeWidth || "2",
    desc,
    class: className,
    ariaLabel = "chevron left outline",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="m14 8-4 4 4 4"></path></svg>`);
  pop();
}
function ChevronUpOutline($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    strokeWidth = ctx.strokeWidth || "2",
    desc,
    class: className,
    ariaLabel = "chevron up outline",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="m16 14-4-4-4 4"></path></svg>`);
  pop();
}
function ClockSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "clock solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function EditOutline($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    strokeWidth = ctx.strokeWidth || "2",
    desc,
    class: className,
    ariaLabel = "edit outline",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path></svg>`);
  pop();
}
function FileLinesSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "file lines solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function HomeSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "home solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function MapPinSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "map pin solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M5 9a7 7 0 1 1 8 6.93V21a1 1 0 1 1-2 0v-5.07A7.001 7.001 0 0 1 5 9Zm5.94-1.06A1.5 1.5 0 0 1 12 7.5a1 1 0 1 0 0-2A3.5 3.5 0 0 0 8.5 9a1 1 0 0 0 2 0c0-.398.158-.78.44-1.06Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function MessageDotsSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "message dots solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function PhoneSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "phone solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"></path></svg>`);
  pop();
}
function PlayOutline($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    strokeWidth = ctx.strokeWidth || "2",
    desc,
    class: className,
    ariaLabel = "play outline",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M8 18V6l8 6-8 6Z"></path></svg>`);
  pop();
}
function TagSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "tag solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>`);
  pop();
}
function UsersSolid($$payload, $$props) {
  push();
  const ctx = getContext("iconCtx") ?? {};
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  let {
    size = ctx.size || "md",
    color = ctx.color || "currentColor",
    title,
    desc,
    class: className,
    ariaLabel = "users solid",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let ariaDescribedby = `${title?.id || ""} ${desc?.id || ""}`;
  const hasDescription = !!(title?.id || desc?.id);
  $$payload.out.push(`<svg${spread_attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: color,
      ...restProps,
      class: clsx(twMerge(clsx$1("shrink-0", sizes[size], className))),
      "aria-label": ariaLabel,
      "aria-describedby": hasDescription ? ariaDescribedby : void 0,
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}>`);
  if (title?.id && title.title) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<title${attr("id", title.id)}>${escape_html(title.title)}</title>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if (desc?.id && desc.desc) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<desc${attr("id", desc.id)}>${escape_html(desc.desc)}</desc>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
const UI_LAYOUT = {
  padding: {
    base: "px-4",
    lg: "lg:px-12"
  },
  positioned: {
    gap: "4"
  }
};
const CONTAINER_SIZES = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6"
};
const CONTAINER_RADIUS = {
  md: "rounded-xl"
};
const CONTAINER_SHADOWS = {
  md: "shadow-md",
  xl: "shadow-xl",
  "2xl": "shadow-2xl"
};
const CONTAINER_BORDERS = {
  thin: "border"
};
const CONTAINER_VARIANTS = {
  // Default container - solid background
  default: {
    base: UI_VARIANTS.default.base,
    radius: "rounded-xl"
  },
  // Elegant container - glass morphism effect
  elegant: {
    base: UI_VARIANTS.elegant.base,
    radius: "rounded-2xl"
  },
  // Minimal container - subtle primary theme
  minimal: {
    base: UI_VARIANTS.minimal.base,
    radius: "rounded-xl"
  },
  // Blur container - heavy blur effect dengan primary background
  blur: {
    base: "bg-primary-950/60 backdrop-blur-xl shadow-lg border-white/20 text-white",
    radius: "rounded-2xl"
  }
};
const CONTAINER_OVERFLOW = {
  hidden: "overflow-hidden"
};
const CONTAINER_LAYOUTS = {
  // Flex layouts
  flex: {
    col: "flex flex-col",
    row: "flex flex-row"
  }
};
const CONTAINER_GAPS = {
  md: "gap-4"
};
const CONTAINER_RESPONSIVE = {
  text: {
    base: "font-pacifico"
  }
};
const CONTAINER_SECTION = {
  hero: {
    base: "w-full h-screen relative z-20",
    content: {
      centered: `${CONTAINER_LAYOUTS.flex.col} items-center justify-center h-full text-center px-8 md:px-14 lg:px-20 xl:px-28 max-w-4xl mx-auto`
    },
    text: {
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    logo: {
      base: "mb-6 md:mb-8"
    },
    buttons: {
      container: `${CONTAINER_LAYOUTS.flex.col} sm:${CONTAINER_LAYOUTS.flex.row} ${CONTAINER_GAPS.md} justify-center items-center mt-4 md:mt-6`
    }
  },
  videoHighlight: {
    base: "w-full h-screen",
    flex: `flex flex-col h-full justify-center space-y-4 ${CONTAINER_GAPS.md} ${CONTAINER_SIZES.md}`,
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden} ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.lg}`
    },
    text: {
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.subtitle} text-base md:text-lg mb-4 md:mb-6 italic`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    item: {
      list: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.item} flex items-start gap-3`,
      unordered: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.item} mb-4 space-y-2`
    }
  },
  experience: {
    base: "w-full h-screen",
    flex: `flex flex-col h-full justify-center space-y-4 ${UI_LAYOUT.padding.lg} ${CONTAINER_GAPS.md} ${CONTAINER_SIZES.md}`,
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.lg}`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden}`
    },
    text: {
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      subtitle: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.subtitle} text-base md:text-lg mb-4 md:mb-6`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    scrollableImage: {
      left: "w-1/2 h-full",
      right: "w-1/2 h-full"
    }
  },
  chef: {
    base: "w-full h-screen",
    flex: `flex flex-col h-full justify-center space-y-4 ${UI_LAYOUT.padding.lg} ${CONTAINER_GAPS.md} ${CONTAINER_SIZES.md}`,
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden} ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.base}`
    },
    text: {
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.base.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed`
    },
    image: {
      base: "w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
    }
  },
  menu: {
    base: "w-full h-screen relative",
    overlay: {
      first: "absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/65",
      second: "absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"
    },
    content: {
      base: `relative z-10 mx-auto flex h-full ${CONTAINER_LAYOUTS.flex.col} md:${CONTAINER_LAYOUTS.flex.row}`,
      left: `md:w-1/2 ${CONTAINER_LAYOUTS.flex.col} justify-center ${CONTAINER_SIZES.sm} md:${CONTAINER_SIZES.md} lg:${CONTAINER_SIZES.lg} ${UI_LAYOUT.padding.lg}`,
      right: `md:w-1/2 flex h-full ${CONTAINER_OVERFLOW.hidden}`
    },
    text: {
      base: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title}`,
      title: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.title} text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight`,
      description: `${CONTAINER_RESPONSIVE.text.base} ${UI_TEXTS.elegant.description} text-sm md:text-base lg:text-lg mb-6 md:mb-8`
    },
    category: {
      base: "mb-6 md:mb-8 flex flex-wrap gap-3 md:gap-4",
      tab: `${CONTAINER_RESPONSIVE.text.base} rounded-full px-4 md:px-6 py-2 md:py-3 font-semibold shadow-lg ${UI_TRANSITIONS.base}`
    },
    item: {
      list: {
        base: `w-full cursor-pointer ${CONTAINER_RADIUS.md} border border-gray-700/50 bg-gray-900/60 ${CONTAINER_SIZES.md} md:p-5 text-left ${CONTAINER_SHADOWS.xl} backdrop-blur-sm ${UI_TRANSITIONS.base} hover:border-amber-400/30 hover:bg-gray-800/70 hover:${CONTAINER_SHADOWS["2xl"]}`,
        title: `${CONTAINER_RESPONSIVE.text.base} mb-2 text-lg md:text-xl font-bold ${UI_TEXTS.elegant.title} drop-shadow-lg`,
        description: `${CONTAINER_RESPONSIVE.text.base} mb-2 text-xs md:text-sm leading-relaxed text-gray-200 drop-shadow-sm`,
        price: `${CONTAINER_RESPONSIVE.text.base} text-xl md:text-2xl font-bold text-amber-400 drop-shadow-lg`
      }
    },
    scrollableImage: {
      left: "w-1/2 h-full",
      right: "w-1/2 h-full"
    }
  }
};
const CONTAINER_PRESETS = {
  // Wrapper containers
  wrapper: {
    default: `${CONTAINER_VARIANTS.default.base} ${CONTAINER_VARIANTS.default.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    elegant: `${CONTAINER_VARIANTS.elegant.base} ${CONTAINER_VARIANTS.elegant.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    minimal: `${CONTAINER_VARIANTS.minimal.base} ${CONTAINER_VARIANTS.minimal.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`,
    blur: `${CONTAINER_VARIANTS.blur.base} ${CONTAINER_VARIANTS.blur.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.md}`
  },
  // Panel containers
  panel: {
    blur: `${CONTAINER_VARIANTS.blur.base} ${CONTAINER_VARIANTS.blur.radius} ${CONTAINER_SHADOWS.md} ${CONTAINER_BORDERS.thin} ${CONTAINER_RADIUS.md} ${CONTAINER_SIZES.sm}`
  },
  positioned: {
    leftCenter: `fixed left-${UI_LAYOUT.positioned.gap} top-1/2 z-20 -translate-y-1/2`
  }
};
const min = Math.min;
const max = Math.max;
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
const yAxisSides = /* @__PURE__ */ new Set(["top", "bottom"]);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ["left", "right"];
const rlPlacement = ["right", "left"];
const tbPlacement = ["top", "bottom"];
const btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case "left":
    case "right":
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) ? await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) => d.overflows[0] > 0 && getSideAxis(d.placement) === initialSideAxis)) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
const shift = shift$1;
const flip = flip$1;
function Arrow($$payload, $$props) {
  push();
  let {
    placement = "top",
    cords,
    strategy = "absolute",
    class: className = ""
  } = $$props;
  $$payload.out.push(`<div${attr_class(`popover-arrow clip pointer-events-none block h-[10px] w-[10px] border-b border-l border-inherit bg-inherit text-inherit ${stringify(className)}`)}></div>`);
  pop();
}
function Popper($$payload, $$props) {
  push();
  let {
    triggeredBy,
    triggerDelay = 200,
    trigger = "click",
    placement = "top",
    offset = 8,
    arrow = false,
    yOnly = false,
    strategy = "absolute",
    reference,
    middlewares = [flip(), shift()],
    onbeforetoggle: _onbeforetoggle,
    ontoggle: _ontoggle,
    class: className = "",
    arrowClass = "",
    isOpen = false,
    transitionParams,
    transition = fade,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let arrowParams = { placement, cords: { x: 0, y: 0 }, strategy };
  $$payload.out.push(`<div hidden></div> `);
  if (isOpen) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div${spread_attributes(
      {
        popover: "manual",
        role: "tooltip",
        class: clsx(clsx$1(className)),
        ...restProps
      },
      null,
      { "overflow-visible": true }
    )}>`);
    children($$payload);
    $$payload.out.push(`<!----> `);
    if (arrow) {
      $$payload.out.push("<!--[-->");
      Arrow($$payload, spread_props([arrowParams, { class: arrowClass }]));
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { isOpen });
  pop();
}
function Tooltip($$payload, $$props) {
  push();
  let {
    type = "dark",
    color = void 0,
    trigger = "hover",
    arrow = true,
    children,
    placement = "top",
    onbeforetoggle: _onbeforetoggle,
    class: className,
    isOpen = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const theme = getTheme("tooltip");
  let { base } = tooltip({ color, type });
  function onbeforetoggle(ev) {
    if (ev.target instanceof HTMLElement) {
      ev.target.querySelectorAll('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]').forEach((element) => element.setAttribute("tabindex", "-1"));
    }
    _onbeforetoggle?.(ev);
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Popper($$payload2, spread_props([
      restProps,
      {
        placement,
        trigger,
        arrow,
        class: base({ class: clsx$1(theme?.base, className) }),
        onbeforetoggle,
        get isOpen() {
          return isOpen;
        },
        set isOpen($$value) {
          isOpen = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out.push(`<div class="pointer-events-none">`);
          children($$payload3);
          $$payload3.out.push(`<!----></div>`);
        },
        $$slots: { default: true }
      }
    ]));
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { isOpen });
  pop();
}
function Textarea($$payload, $$props) {
  push();
  let {
    header,
    footer,
    addon,
    value = void 0,
    elementRef = void 0,
    divClass,
    innerClass,
    headerClass,
    footerClass,
    addonClass,
    disabled,
    class: className,
    cols,
    clearable,
    clearableSvgClass,
    clearableColor = "none",
    clearableClass,
    clearableOnClick,
    textareaClass,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const theme = getTheme("textarea");
  let hasHeader = !!header;
  let hasFooter = !!footer;
  let hasAddon = !!addon;
  let wrapped = hasHeader || hasFooter || hasAddon;
  const {
    divWrapper,
    base,
    wrapper,
    innerWrapper,
    headerCls,
    footerCls,
    addonCls,
    closebutton
  } = textarea({ wrapped, hasHeader, hasFooter, cols: !!cols });
  const clearAll = () => {
    if (elementRef) {
      elementRef.value = "";
      value = void 0;
    }
    if (clearableOnClick) clearableOnClick();
  };
  $$payload.out.push(`<div${attr_class(clsx(divWrapper({ class: clsx$1(theme?.divWrapper, divClass) })))}>`);
  if (!wrapped) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<textarea${spread_attributes(
      {
        disabled,
        ...restProps,
        class: clsx(wrapper({ class: clsx$1(className) }))
      },
      null
    )}>`);
    const $$body = escape_html(value);
    if ($$body) {
      $$payload.out.push(`${$$body}`);
    }
    $$payload.out.push(`</textarea>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div${attr_class(clsx(wrapper({ class: clsx$1(theme?.wrapper, className) })))}>`);
    if (header) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div${attr_class(clsx(headerCls({ class: clsx$1(theme?.headerCls, headerClass) })))}>`);
      header($$payload);
      $$payload.out.push(`<!----></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <div${attr_class(clsx(innerWrapper({ class: clsx$1(theme?.innerWrapper, innerClass) })))}>`);
    if (addon) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div${attr_class(clsx(addonCls({ class: clsx$1(theme?.addonCls, addonClass) })))}>`);
      addon($$payload);
      $$payload.out.push(`<!----></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <textarea${spread_attributes(
      {
        disabled,
        ...restProps,
        class: clsx(base({ class: clsx$1(theme?.base, textareaClass) }))
      },
      null
    )}>`);
    const $$body_1 = escape_html(value);
    if ($$body_1) {
      $$payload.out.push(`${$$body_1}`);
    }
    $$payload.out.push(`</textarea></div> `);
    if (footer) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div${attr_class(clsx(footerCls({ class: clsx$1(theme?.footerCls, footerClass) })))}>`);
      footer($$payload);
      $$payload.out.push(`<!----></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  if (value !== void 0 && value !== "" && clearable) {
    $$payload.out.push("<!--[-->");
    CloseButton($$payload, {
      onclick: clearAll,
      class: closebutton({ class: clsx$1(theme?.closebutton, clearableClass) }),
      color: clearableColor,
      "aria-label": "Clear search value",
      svgClass: clsx$1(clearableSvgClass)
    });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, { value, elementRef });
  pop();
}
function Index$d($$payload, $$props) {
  push();
  let dotColorClasses;
  let currentSectionIndex = fallback($$props["currentSectionIndex"], 0);
  let isActive = fallback($$props["isActive"], false);
  let title = fallback($$props["title"], null);
  let colorScheme = fallback($$props["colorScheme"], "auto");
  let size = fallback($$props["size"], "md");
  let showTooltip = fallback($$props["showTooltip"], true);
  const sizeClasses = { sm: "w-1.5 h-1.5", md: "w-2.5 h-2.5", lg: "w-4 h-4" };
  dotColorClasses = (() => {
    if (colorScheme === "white") {
      return isActive ? "bg-white" : "bg-white/30";
    } else if (colorScheme === "primary") {
      return isActive ? "bg-primary-700" : "bg-primary-700/30";
    } else {
      if ([0, 2, 5, 6].includes(currentSectionIndex)) {
        return isActive ? "bg-white" : "bg-white/30";
      }
      return isActive ? "bg-primary-950" : "bg-primary-950/30";
    }
  })();
  $$payload.out.push(`<div${attr_class(`
    hover:scale-180
    rounded-full
    transition-all
    duration-300
    hover:bg-white
    ${sizeClasses[size]}
    ${dotColorClasses}
  `)}></div> `);
  if (showTooltip) {
    $$payload.out.push("<!--[-->");
    Tooltip($$payload, {
      placement: "left",
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->${escape_html(title)}`);
      },
      $$slots: { default: true }
    });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, {
    currentSectionIndex,
    isActive,
    title,
    colorScheme,
    size,
    showTooltip
  });
  pop();
}
function Index$c($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["src", "alt"]);
  let src = fallback($$props["src"], "");
  let alt = fallback($$props["alt"], "");
  $$payload.out.push(`<img${spread_attributes({ src, alt, class: `w-full h-auto`, ...$$restProps }, null)} onload="this.__e=event" onerror="this.__e=event"/>`);
  bind_props($$props, { src, alt });
}
function Index$b($$payload, $$props) {
  let {
    title,
    subtitle = "",
    border = true,
    class: className = "",
    children,
    left,
    right
  } = $$props;
  $$payload.out.push(`<div${attr_class(`relative mb-8 flex items-center p-4 text-white ${stringify(className)} ${stringify(border ? "border-b border-gray-700" : "")}`)}><div class="z-10"><!---->`);
  slot($$payload, $$props, "left", {}, null);
  $$payload.out.push(`<!----></div> <div${attr_class(`absolute inset-x-0 flex flex-col items-center justify-center pointer-events-none ${stringify(border ? "mb-8" : "")}`)}><h3 class="text-sm font-semibold text-white leading-tight">${escape_html(title)}</h3> `);
  if (subtitle) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-xs text-gray-400 mt-0.5">${escape_html(subtitle)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="z-10 ml-auto"><!---->`);
  slot($$payload, $$props, "right", {}, null);
  $$payload.out.push(`<!----></div></div>`);
}
const defaultProps = {
  size: "md",
  color: "primary"
};
function ScrollMouse($$payload, $$props) {
  push();
  let currentSize, currentColor, mouseWidth, mouseHeight, mouseX, mouseY, scrollWidth, scrollHeight, scrollX, scrollY, indicatorRadius, indicatorX, indicatorY;
  let size = fallback($$props["size"], () => defaultProps.size, true);
  let color = fallback($$props["color"], () => defaultProps.color, true);
  let className = fallback($$props["className"], "");
  const sizeConfig = {
    sm: { width: 44, height: 46, viewBox: "0 0 46 54" },
    md: { width: 52, height: 58, viewBox: "0 0 58 72" },
    lg: { width: 60, height: 70, viewBox: "0 0 70 90" },
    xl: { width: 68, height: 82, viewBox: "0 0 82 108" },
    "2xl": { width: 76, height: 94, viewBox: "0 0 94 126" }
  };
  const colorConfig = {
    primary: "#3b82f6",
    secondary: "#6b7280",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#06b6d4",
    white: "#ffffff",
    black: "#000000"
  };
  currentSize = sizeConfig[size];
  currentColor = colorConfig[color];
  mouseWidth = currentSize.width * 0.5;
  mouseHeight = currentSize.height * 0.83;
  mouseX = (parseInt(currentSize.viewBox.split(" ")[2]) - mouseWidth) / 2;
  mouseY = currentSize.height * 0.08;
  scrollWidth = mouseWidth * 0.13;
  scrollHeight = mouseHeight * 0.2;
  scrollX = mouseX + (mouseWidth - scrollWidth) / 2;
  scrollY = mouseY + mouseHeight * 0.14;
  indicatorRadius = scrollWidth * 0.6;
  indicatorX = mouseX + mouseWidth / 2;
  indicatorY = scrollY + scrollHeight * 1.2;
  $$payload.out.push(`<svg xmlns="http://www.w3.org/2000/svg"${attr("width", currentSize.width)}${attr("height", currentSize.height)}${attr("viewBox", currentSize.viewBox)}${attr_class(clsx(className))} role="img" aria-label="Scroll down indicator"><style>
		/* Scroll animation keyframes */
		@keyframes scrollDown {
			0% {
				transform: translateY(0);
				opacity: 0.8;
			}
			50% {
				transform: translateY(8px);
				opacity: 0.3;
			}
			100% {
				transform: translateY(0);
				opacity: 0.8;
			}
		}

		/* Scroll indicator animation */
		.scroll-indicator {
			animation: scrollDown 2s infinite ease-in-out;
			transform-origin: center;
		}
	</style><rect${attr("x", mouseX)}${attr("y", mouseY)}${attr("width", mouseWidth)}${attr("height", mouseHeight)}${attr("rx", mouseWidth / 2)}${attr("ry", mouseWidth / 2)} fill="transparent"${attr("stroke", currentColor)} stroke-width="2"></rect><rect${attr("x", scrollX)}${attr("y", scrollY)}${attr("width", scrollWidth)}${attr("height", scrollHeight)}${attr("rx", scrollWidth / 2)}${attr("ry", scrollWidth / 2)} fill="transparent"${attr("stroke", currentColor)} stroke-width="1"></rect><circle class="scroll-indicator"${attr("cx", indicatorX)}${attr("cy", indicatorY)}${attr("r", indicatorRadius)}${attr("fill", currentColor)} opacity="0.8"></circle></svg>`);
  bind_props($$props, { size, color, className });
  pop();
}
function Index$a($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "label",
    "placeholder",
    "value",
    "required",
    "disabled",
    "error",
    "success",
    "size",
    "name",
    "id",
    "variant",
    "readonly",
    "rows",
    "maxlength",
    "resize"
  ]);
  push();
  let textareaClasses, labelClasses, characterCount, isNearLimit, isOverLimit;
  let label = fallback($$props["label"], "");
  let placeholder = fallback($$props["placeholder"], "");
  let value = fallback($$props["value"], "");
  let required = fallback($$props["required"], false);
  let disabled = fallback($$props["disabled"], false);
  let error2 = fallback($$props["error"], "");
  let success = fallback($$props["success"], "");
  let size = fallback($$props["size"], "md");
  let name = fallback($$props["name"], "");
  let id = fallback($$props["id"], "");
  let variant = fallback($$props["variant"], "elegant");
  let readonly = fallback($$props["readonly"], false);
  let rows = fallback($$props["rows"], 4);
  let maxlength = fallback($$props["maxlength"], void 0);
  let resize = fallback($$props["resize"], "vertical");
  textareaClasses = getInputClasses(size, variant, { error: !!error2, success: !!success, disabled, readonly });
  labelClasses = getLabelClasses(variant);
  characterCount = value.length;
  isNearLimit = maxlength && characterCount > maxlength * 0.8;
  isOverLimit = maxlength && characterCount > maxlength;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<div class="flex flex-col gap-2 svelte-3sjptv">`);
    if (label) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<label${attr("for", id)}${attr_class(clsx(labelClasses), "svelte-3sjptv")}>${escape_html(label)} `);
      if (required) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<span class="text-amber-400 ml-1 svelte-3sjptv">*</span>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--></label>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> <div class="relative svelte-3sjptv">`);
    Textarea($$payload2, spread_props([
      {
        id,
        placeholder,
        name,
        required,
        disabled,
        readonly,
        rows,
        maxlength,
        class: `${stringify(textareaClasses)} ${stringify(variant === "elegant" ? "elegant-variant" : "")} resize-${stringify(resize)}`
      },
      $$restProps,
      {
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!----></div> <div class="flex justify-between items-center svelte-3sjptv"><div class="svelte-3sjptv">`);
    if (error2) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div${attr_class(clsx(UI_MESSAGES.error), "svelte-3sjptv")}><svg class="w-4 h-4 svelte-3sjptv" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" class="svelte-3sjptv"></path></svg> <span class="svelte-3sjptv">${escape_html(error2)}</span></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> `);
    if (success) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div${attr_class(clsx(UI_MESSAGES.success), "svelte-3sjptv")}><svg class="w-4 h-4 svelte-3sjptv" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" class="svelte-3sjptv"></path></svg> <span class="svelte-3sjptv">${escape_html(success)}</span></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--></div> `);
    if (maxlength) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div${attr_class(
        `text-sm ${stringify(isOverLimit ? "text-red-400" : isNearLimit ? "text-amber-400" : variant === "elegant" ? "text-gray-400" : "text-gray-500")}`,
        "svelte-3sjptv"
      )}>${escape_html(characterCount)}/${escape_html(maxlength)}</div>`);
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
  bind_props($$props, {
    label,
    placeholder,
    value,
    required,
    disabled,
    error: error2,
    success,
    size,
    name,
    id,
    variant,
    readonly,
    rows,
    maxlength,
    resize
  });
  pop();
}
function Dining($$payload) {
  $$payload.out.push(`<div class="absolute inset-0"><div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div> <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style="background-image: url('https://foodies.id/wp-content/uploads/2024/01/AB-Steak-Senayan-City.jpg')"></div> <div class="absolute inset-0 bg-black/20 mix-blend-multiply"></div></div>`);
}
function Japan($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className", "title"]);
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
    "2xl": "w-48 h-48"
  };
  let className = fallback($$props["className"], "");
  let title = fallback($$props["title"], "Japan Flag");
  $$payload.out.push(`<svg${spread_attributes(
    {
      viewBox: "0 0 3 2",
      class: `${sizeClass[size]} ${className}`,
      ...$$restProps,
      role: "img",
      "aria-label": title
    },
    null,
    void 0,
    void 0,
    3
  )}><rect width="3" height="2" fill="#FFFFFF"></rect><circle cx="1.5" cy="1" r="0.6" fill="#BC002D"></circle></svg>`);
  bind_props($$props, { size, className, title });
}
function Indonesia($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className", "title"]);
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
    "2xl": "w-48 h-48"
  };
  let className = fallback($$props["className"], "");
  let title = fallback($$props["title"], "Indonesia Flag");
  $$payload.out.push(`<svg${spread_attributes(
    {
      viewBox: "0 0 3 2",
      class: `${sizeClass[size]} ${className}`,
      ...$$restProps,
      role: "img",
      "aria-label": title
    },
    null,
    void 0,
    void 0,
    3
  )}><rect width="3" height="1" fill="#FF0000"></rect><rect width="3" height="1" y="1" fill="#FFFFFF"></rect></svg>`);
  bind_props($$props, { size, className, title });
}
function UnitedKingdom($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className", "title"]);
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
    "2xl": "w-48 h-48"
  };
  let className = fallback($$props["className"], "");
  let title = fallback($$props["title"], "Indonesia Flag");
  $$payload.out.push(`<svg${spread_attributes(
    {
      viewBox: "0 0 60 30",
      class: `${sizeClass[size]} ${className}`,
      ...$$restProps,
      role: "img",
      "aria-label": title
    },
    null,
    void 0,
    void 0,
    3
  )}><rect width="60" height="30" fill="#012169"></rect><g fill="white"><polygon points="0,0 60,30 60,24 8,0"></polygon><polygon points="0,30 60,0 60,6 8,30"></polygon><polygon points="0,6 52,30 60,30 60,24 8,0 0,0"></polygon><polygon points="0,24 52,0 60,0 60,6 8,30 0,30"></polygon></g><g fill="#C8102E"><polygon points="0,0 60,30 60,26 6,0"></polygon><polygon points="0,30 60,0 60,4 6,30"></polygon><polygon points="0,4 54,30 60,30 60,26 6,0 0,0"></polygon><polygon points="0,26 54,0 60,0 60,4 6,30 0,30"></polygon></g><g fill="white"><rect x="25" y="0" width="10" height="30"></rect><rect x="0" y="10" width="60" height="10"></rect></g><g fill="#C8102E"><rect x="27" y="0" width="6" height="30"></rect><rect x="0" y="12" width="60" height="6"></rect></g></svg>`);
  bind_props($$props, { size, className, title });
}
function getFlagByLocale(locale) {
  switch (locale) {
    case Locale.Id:
      return Indonesia;
    case Locale.En:
      return UnitedKingdom;
    case Locale.Ja:
      return Japan;
    default:
      console.warn(`No flag component found for locale: ${locale}`);
      return null;
  }
}
function Index$9($$payload, $$props) {
  push();
  let flagComponent;
  let locale = $$props["locale"];
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };
  flagComponent = getFlagByLocale(locale);
  $$payload.out.push(`<div${attr_class(`${sizeClass[size]} ${CONTAINER_OVERFLOW.hidden} ${CONTAINER_PRESETS.wrapper}`)}><!---->`);
  flagComponent?.($$payload, { size, className: "h-full w-full" });
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { locale, size });
  pop();
}
function Index$8($$payload, $$props) {
  let title = fallback($$props["title"], "");
  let subtitle = fallback($$props["subtitle"], "");
  $$payload.out.push(`<div class="font-cursive flex flex-col gap-2 text-center svelte-r74n8c"><h1 class="text-primary mb-2 text-2xl md:text-2xl">${escape_html(title)}</h1> <h6 class="text-primary text-sm md:text-sm">${escape_html(subtitle)}</h6></div>`);
  bind_props($$props, { title, subtitle });
}
function Index$7($$payload, $$props) {
  push();
  let items = fallback($$props["items"], () => [], true);
  const each_array = ensure_array_like(items);
  $$payload.out.push(`<ul class="hidden gap-6 font-medium text-white md:flex"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out.push(`<li><button type="button" class="hover:text-primary-light transition cursor-pointer">${escape_html(item.name)}</button></li>`);
  }
  $$payload.out.push(`<!--]--></ul>`);
  bind_props($$props, { items });
  pop();
}
function Video($$payload, $$props) {
  push();
  let computedVideoClass;
  let src = $$props["src"];
  let poster = fallback($$props["poster"], "");
  let autoPlay = fallback($$props["autoPlay"], false);
  let muted = fallback($$props["muted"], false);
  let loop = fallback($$props["loop"], false);
  let preload = fallback($$props["preload"], "metadata");
  let videoClass = fallback($$props["videoClass"], "w-full h-auto");
  let containerClass = fallback($$props["containerClass"], "relative");
  let size = fallback($$props["size"], "md");
  let aspectRatio = fallback($$props["aspectRatio"], "auto");
  let rounded = fallback($$props["rounded"], "md");
  let shadow = fallback($$props["shadow"], "md");
  let onplay = fallback($$props["onplay"], void 0);
  let onpause = fallback($$props["onpause"], void 0);
  let onended = fallback($$props["onended"], void 0);
  let onerror = fallback($$props["onerror"], void 0);
  let videoElement;
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "w-full"
  };
  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "21:9": "aspect-[21/9]",
    auto: ""
  };
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full"
  };
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl"
  };
  function play() {
  }
  function pause() {
  }
  function togglePlay() {
  }
  function setVolume(newVolume) {
  }
  function toggleMute() {
  }
  function getVideoElement() {
    return videoElement;
  }
  computedVideoClass = [
    videoClass,
    sizeClasses[size],
    aspectRatioClasses[aspectRatio],
    roundedClasses[rounded],
    shadowClasses[shadow],
    "object-cover"
  ].filter(Boolean).join(" ");
  $$payload.out.push(`<div${attr_class(clsx(containerClass), "svelte-gthnzw")} tabindex="-1" role="application"><video${attr_class(clsx(computedVideoClass), "svelte-gthnzw")}${attr("src", src)}${attr("poster", poster)}${attr("muted", muted, true)}${attr("loop", loop, true)}${attr("preload", preload)}${attr("autoplay", autoPlay, true)}><track kind="captions"/></video> `);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"><div class="flex flex-col items-center gap-3"><div class="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div> <span class="text-white/80 text-sm font-medium">Loading video...</span></div></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, {
    src,
    poster,
    autoPlay,
    muted,
    loop,
    preload,
    videoClass,
    containerClass,
    size,
    aspectRatio,
    rounded,
    shadow,
    onplay,
    onpause,
    onended,
    onerror,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    getVideoElement
  });
  pop();
}
function createIndicatorStore(initialHideDelay = 3e3) {
  const initialState2 = {
    visible: true,
    hideTimeout: null,
    hideDelay: initialHideDelay
  };
  const { subscribe, update } = writable(initialState2);
  const clearHideTimer = () => {
    return;
  };
  const startHideTimer = () => {
    return;
  };
  return {
    subscribe,
    show: () => {
      update((state) => ({
        ...state,
        visible: true
      }));
    },
    hide: () => {
      update((state) => ({
        ...state,
        visible: false
      }));
    },
    toggle: () => {
      update((state) => ({
        ...state,
        visible: !state.visible
      }));
    },
    startHideTimer,
    clearHideTimer,
    setHideDelay: (delay) => {
      update((state) => ({
        ...state,
        hideDelay: delay
      }));
    },
    isVisible: () => {
      let visible = false;
      update((state) => {
        visible = state.visible;
        return state;
      });
      return visible;
    }
  };
}
function useMouseAreaDetector(options = {}) {
  const {
    rightAreaPercentage = 0.8,
    // 80% dari kiri, 20% area kanan
    indicatorAreaRadius = 100,
    // 100px radius sekitar indicator
    onEnterRightArea,
    onLeaveRightArea,
    onEnterIndicatorArea,
    onLeaveIndicatorArea
  } = options;
  let isInRightArea = false;
  let isInIndicatorArea = false;
  const start = () => {
    return;
  };
  const stop = () => {
    return;
  };
  return {
    start,
    stop,
    isInRightArea: () => isInRightArea,
    isInIndicatorArea: () => isInIndicatorArea
  };
}
function useIndicatorSystem(options = {}) {
  const {
    hideDelay = 3e3,
    mouseAreaPercentage = 0.8,
    indicatorAreaRadius = 100,
    autoHideOnModal = true
  } = options;
  const indicatorStore = createIndicatorStore(hideDelay);
  let preventHide = false;
  const mouseDetector = useMouseAreaDetector({
    rightAreaPercentage: mouseAreaPercentage,
    indicatorAreaRadius,
    onEnterRightArea: () => {
      indicatorStore.show();
      if (!preventHide) {
        indicatorStore.startHideTimer();
      }
    },
    onEnterIndicatorArea: () => {
      preventHide = true;
      indicatorStore.clearHideTimer();
      indicatorStore.show();
    },
    onLeaveIndicatorArea: () => {
      preventHide = false;
      indicatorStore.startHideTimer();
    }
  });
  const visible = derived(indicatorStore, (state) => state.visible);
  return {
    // Store
    indicatorStore,
    visible,
    // Control functions
    show: indicatorStore.show,
    hide: indicatorStore.hide,
    toggle: indicatorStore.toggle,
    startHideTimer: () => {
      if (!preventHide) {
        indicatorStore.startHideTimer();
      }
    },
    clearHideTimer: indicatorStore.clearHideTimer,
    setHideDelay: indicatorStore.setHideDelay,
    isVisible: indicatorStore.isVisible,
    // Mouse detector
    startMouseDetector: mouseDetector.start,
    stopMouseDetector: mouseDetector.stop,
    isInRightArea: mouseDetector.isInRightArea,
    isInIndicatorArea: mouseDetector.isInIndicatorArea,
    // Convenience function
    showAndStartTimer: () => {
      indicatorStore.show();
      if (!preventHide) {
        indicatorStore.startHideTimer();
      }
    }
  };
}
function Back($$payload, $$props) {
  let finalClasses;
  let onclick = fallback($$props["onclick"], null);
  let className = fallback($$props["className"], "");
  const baseClasses = "relative z-30 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors duration-200 font-medium text-[17px] -ml-1 px-1 py-1";
  finalClasses = className ? `${baseClasses} ${className}` : baseClasses;
  $$payload.out.push(`<button${attr_class(clsx(finalClasses))}><!---->`);
  slot($$payload, $$props, "icon", {}, () => {
    ChevronLeftOutline($$payload, { class: "w-5 h-5" });
  });
  $$payload.out.push(`<!----> <!---->`);
  slot($$payload, $$props, "default", {}, () => {
    $$payload.out.push(`Back`);
  });
  $$payload.out.push(`<!----></button>`);
  bind_props($$props, { onclick, className });
}
class DetailModalService {
  static MODAL_ID = "detail-modal";
  static currentMenuItem = null;
  /**
   * Get the modal state for the detail modal
   */
  static getModalState() {
    return derived(modalStore, ($store) => ({ isOpen: $store.isOpen }));
  }
  /**
   * Check if the detail modal is open
   */
  static isOpen() {
    return derived(modalStore, ($store) => $store.isOpen);
  }
  /**
   * Check if the detail modal is open (synchronous)
   */
  static isOpenSync() {
    const store = get(modalStore);
    return store.isOpen;
  }
  /**
   * Open the detail modal with menu item data
   */
  static open(menuItem) {
    try {
      if (!menuItem) {
        console.warn("Cannot open modal: menu item is required");
        return false;
      }
      this.currentMenuItem = menuItem;
      const modalItem = {
        id: menuItem.name.toLowerCase().replace(/\s+/g, "-"),
        // Generate id from name
        ...menuItem
      };
      modalStore.open(modalItem);
      console.log(`Detail modal opened for: ${menuItem.name}`);
      return true;
    } catch (err) {
      console.error("Error opening detail modal:", err);
      return false;
    }
  }
  /**
   * Close the detail modal
   */
  static close() {
    try {
      this.currentMenuItem = null;
      modalStore.close();
      console.log("Detail modal closed");
    } catch (err) {
      console.error("Error closing detail modal:", err);
    }
  }
  /**
   * Toggle the detail modal
   */
  static toggle(menuItem) {
    try {
      if (this.isOpenSync()) {
        this.close();
        return false;
      } else if (menuItem) {
        return this.open(menuItem);
      } else {
        console.warn("Cannot toggle modal: menu item is required when opening");
        return false;
      }
    } catch (err) {
      console.error("Error toggling detail modal:", err);
      return false;
    }
  }
  /**
   * Get the current modal item
   */
  static getCurrentItem() {
    return derived(modalStore, ($store) => {
      return $store.isOpen ? this.currentMenuItem || $store.item : null;
    });
  }
  /**
   * Get the current modal item (synchronous)
   */
  static getCurrentItemSync() {
    const store = get(modalStore);
    return store.isOpen ? this.currentMenuItem || store.item : null;
  }
  /**
   * Get the modal ID (useful for external components)
   */
  static getModalId() {
    return this.MODAL_ID;
  }
  /**
   * Reset modal to initial state
   */
  static reset() {
    try {
      this.currentMenuItem = null;
      modalStore.close();
      console.log("Detail modal reset to initial state");
    } catch (err) {
      console.error("Error resetting detail modal:", err);
    }
  }
  /**
   * Get modal state snapshot
   */
  static getState() {
    const store = get(modalStore);
    return {
      isOpen: store.isOpen,
      currentItem: this.currentMenuItem,
      modalId: this.MODAL_ID,
      storeItem: store.item
    };
  }
  /**
   * Validate modal data integrity
   */
  static validateModalData() {
    try {
      const store = get(modalStore);
      if (store.isOpen && !this.currentMenuItem && !store.item) {
        console.warn("Modal is open but no item data is available");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating modal data:", err);
      return false;
    }
  }
  /**
   * Handle keyboard navigation for modal
   */
  static handleKeyboardNavigation(event) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        return true;
      default:
        return false;
    }
  }
}
({
  getModalState: DetailModalService.getModalState.bind(DetailModalService),
  isOpen: DetailModalService.isOpen.bind(DetailModalService),
  isOpenSync: DetailModalService.isOpenSync.bind(DetailModalService),
  getCurrentItem: DetailModalService.getCurrentItem.bind(DetailModalService),
  getCurrentItemSync: DetailModalService.getCurrentItemSync.bind(DetailModalService),
  getState: DetailModalService.getState.bind(DetailModalService),
  validate: DetailModalService.validateModalData.bind(DetailModalService)
});
const modalActionInterface = {
  open: DetailModalService.open.bind(DetailModalService),
  close: DetailModalService.close.bind(DetailModalService),
  toggle: DetailModalService.toggle.bind(DetailModalService),
  reset: DetailModalService.reset.bind(DetailModalService),
  handleKeyboard: DetailModalService.handleKeyboardNavigation.bind(DetailModalService)
};
({
  getModalId: DetailModalService.getModalId.bind(DetailModalService)
});
function Title($$payload, $$props) {
  let name = $$props["name"];
  let price = $$props["price"];
  let desc = $$props["desc"];
  $$payload.out.push(`<div class="space-y-2 text-center"><h2 class="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">${escape_html(name)}</h2> <div class="text-3xl font-bold text-amber-400 drop-shadow-lg">${escape_html(price)}</div> <p class="text-base leading-relaxed text-gray-200 drop-shadow-sm">${escape_html(desc)}</p></div>`);
  bind_props($$props, { name, price, desc });
}
function Information($$payload, $$props) {
  push();
  let category = $$props["category"];
  let ingredients = $$props["ingredients"];
  let allergens = $$props["allergens"];
  $$payload.out.push(`<div class="grid grid-cols-2 gap-3"><div class="rounded-xl border border-gray-700/40 bg-gray-800/60 p-4 backdrop-blur-sm"><h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-amber-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Ingredients</h3> <p class="text-sm leading-relaxed text-gray-300">`);
  if (ingredients && ingredients.length > 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`${escape_html(ingredients.join(", "))}`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`Premium quality ingredients carefully selected by our chefs.`);
  }
  $$payload.out.push(`<!--]--></p></div> <div class="rounded-xl border border-gray-700/40 bg-gray-800/60 p-4 backdrop-blur-sm"><h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-amber-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg> Category</h3> <p class="text-sm text-gray-300">${escape_html(category || "Signature Dish")}</p></div> <div class="col-span-2 rounded-xl border border-gray-700/40 bg-gray-800/60 p-4 backdrop-blur-sm"><h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-amber-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Allergens</h3> <p class="text-sm text-gray-300">`);
  if (allergens && allergens.length > 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`${escape_html(allergens.join(", "))}`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`Please inform staff of any allergies.`);
  }
  $$payload.out.push(`<!--]--></p></div></div>`);
  bind_props($$props, { category, ingredients, allergens });
  pop();
}
function Nutrition($$payload, $$props) {
  let calories = $$props["calories"];
  let protein = $$props["protein"];
  let carbs = $$props["carbs"];
  let fat = $$props["fat"];
  $$payload.out.push(`<div class="rounded-xl border border-gray-700/40 bg-gray-800/60 p-5 backdrop-blur-sm"><h3 class="mb-3 flex items-center gap-2 text-lg font-semibold text-amber-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> Nutrition Information</h3> <div class="grid grid-cols-2 gap-3 text-sm text-gray-300"><div class="rounded-lg bg-gray-700/50 p-3 text-center"><div class="font-semibold text-amber-400">${escape_html(calories)}</div> <div class="text-xs">Calories</div></div> <div class="rounded-lg bg-gray-700/50 p-3 text-center"><div class="font-semibold text-amber-400">${escape_html(protein)}</div> <div class="text-xs">Protein</div></div> <div class="rounded-lg bg-gray-700/50 p-3 text-center"><div class="font-semibold text-amber-400">${escape_html(carbs)}</div> <div class="text-xs">Carbs</div></div> <div class="rounded-lg bg-gray-700/50 p-3 text-center"><div class="font-semibold text-amber-400">${escape_html(fat)}</div> <div class="text-xs">Fat</div></div></div></div>`);
  bind_props($$props, { calories, protein, carbs, fat });
}
function Index$6($$payload, $$props) {
  push();
  var $$store_subs;
  let animationDuration = fallback($$props["animationDuration"], 400);
  let onOpen = fallback($$props["onOpen"], void 0);
  let onClose = fallback($$props["onClose"], void 0);
  let onModalOpened = fallback($$props["onModalOpened"], void 0);
  let onModalClosed = fallback($$props["onModalClosed"], void 0);
  const isModalOpen = DetailModalService.isOpen();
  const currentItem = DetailModalService.getCurrentItem();
  const modalId = DetailModalService.getModalId();
  let previousModalState = false;
  function closeModal() {
    DetailModalService.close();
  }
  {
    if (store_get($$store_subs ??= {}, "$isModalOpen", isModalOpen) !== previousModalState) {
      if (store_get($$store_subs ??= {}, "$isModalOpen", isModalOpen)) {
        onOpen?.();
        onModalOpened?.();
      } else {
        onClose?.();
        onModalClosed?.();
      }
      previousModalState = store_get($$store_subs ??= {}, "$isModalOpen", isModalOpen);
    }
  }
  Index$f($$payload, {
    id: modalId,
    onClose: closeModal,
    closeOnBackdrop: true,
    closeOnEscape: true,
    preventScroll: true,
    trapFocus: false,
    animationDuration,
    modalClass: "detail-modal ",
    backdropClass: "detail-modal-backdrop",
    contentClass: "min-w-[35vw] max-w-[90vw] detail-modal-content",
    showHeader: false,
    showCloseButton: false,
    showFooter: false,
    children: ($$payload2) => {
      if (store_get($$store_subs ??= {}, "$currentItem", currentItem)) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="overflow-y-auto rounded-2xl bg-gray-900/95"><div class="relative flex-shrink-0"><div class="relative h-40 overflow-hidden rounded-t-2xl md:h-48"><button aria-label="Close modal" class="bg-primary-950/40 group-hover:bg-primary-950 absolute right-2 top-2 z-10 cursor-pointer rounded-full p-4 text-white transition-all"><svg class="group-hover:text-primary-500 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button> <img${attr("src", store_get($$store_subs ??= {}, "$currentItem", currentItem).img)}${attr("alt", store_get($$store_subs ??= {}, "$currentItem", currentItem).name)} class="h-full w-full object-cover"/> <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div></div></div> <div class="relative space-y-4 p-4">`);
        Title($$payload2, {
          name: store_get($$store_subs ??= {}, "$currentItem", currentItem).name,
          price: store_get($$store_subs ??= {}, "$currentItem", currentItem).price,
          desc: store_get($$store_subs ??= {}, "$currentItem", currentItem).desc
        });
        $$payload2.out.push(`<!----> `);
        Information($$payload2, {
          category: store_get($$store_subs ??= {}, "$currentItem", currentItem).category,
          ingredients: store_get($$store_subs ??= {}, "$currentItem", currentItem).ingredients,
          allergens: store_get($$store_subs ??= {}, "$currentItem", currentItem).allergens
        });
        $$payload2.out.push(`<!----> `);
        if (store_get($$store_subs ??= {}, "$currentItem", currentItem).nutritionInfo) {
          $$payload2.out.push("<!--[-->");
          Nutrition($$payload2, {
            calories: store_get($$store_subs ??= {}, "$currentItem", currentItem).nutritionInfo.calories,
            protein: store_get($$store_subs ??= {}, "$currentItem", currentItem).nutritionInfo.protein,
            carbs: store_get($$store_subs ??= {}, "$currentItem", currentItem).nutritionInfo.carbs,
            fat: store_get($$store_subs ??= {}, "$currentItem", currentItem).nutritionInfo.fat
          });
        } else {
          $$payload2.out.push("<!--[!-->");
        }
        $$payload2.out.push(`<!--]--></div></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]-->`);
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    animationDuration,
    onOpen,
    onClose,
    onModalOpened,
    onModalClosed
  });
  pop();
}
const navItems = [
  { id: "video-highlight", name: "About" },
  { id: "experience", name: "Story" },
  { id: "chef", name: "Chef" },
  { id: "menu", name: "Menu" },
  { id: "booking", name: "Reserve" }
];
const visibility$5 = createAreaBasedStateVisibility(ComponentId.Navigation, {
  targetArea: "top",
  proximityRadius: 150,
  areaOffset: 100,
  initialVisible: false,
  hideDelay: 2e3,
  showComponent: false
});
const { isDisplay: isDisplay$4, showComponent: showComponent$3 } = visibility$5;
visibility$5.updatePosition;
const destroyVisibilityManager$4 = visibility$5.destroy;
function NavBar($$payload, $$props) {
  push();
  var $$store_subs;
  onDestroy(() => destroyVisibilityManager$4());
  if (store_get($$store_subs ??= {}, "$isDisplay", isDisplay$4)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<header class="fixed left-0 top-0 z-20 w-full"><nav class="bg-primary-950/80 mx-auto flex max-w-4xl items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 text-white shadow-lg backdrop-blur-lg">`);
    Logo($$payload, {});
    $$payload.out.push(`<!----> `);
    Index$7($$payload, { items: navItems });
    $$payload.out.push(`<!----></nav></header>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (store_get($$store_subs ??= {}, "$showComponent", showComponent$3)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<header class="fixed left-0 top-0 z-20 w-full"><nav class="bg-primary-950/80 mx-auto flex w-fit items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 shadow-lg backdrop-blur-lg">`);
      Logo($$payload, { size: "sm" });
      $$payload.out.push(`<!----></nav></header>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const visibility$4 = createAreaBasedStateVisibility(ComponentId.Highlight, {
  targetArea: "right",
  proximityRadius: 150,
  areaOffset: 100,
  initialVisible: false,
  hideDelay: 2e3,
  showComponent: false
});
const { isDisplay: isVisible, showComponent: showComponent$2 } = visibility$4;
visibility$4.updatePosition;
const destroyVisibilityManager$3 = visibility$4.destroy;
function Highlight($$payload, $$props) {
  push();
  var $$store_subs;
  onDestroy(() => {
    destroyVisibilityManager$3();
  });
  if (store_get($$store_subs ??= {}, "$showComponent", showComponent$2) && store_get($$store_subs ??= {}, "$isVisible", isVisible) && store_get($$store_subs ??= {}, "$highlightsData", highlightsData).length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$highlightsData", highlightsData));
    $$payload.out.push(`<div role="navigation" aria-label="Section highlights navigation"${attr_class(`${CONTAINER_PRESETS.panel.blur} fixed right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col space-y-2 rounded-l-2xl border-white/20 p-3 py-2 shadow-lg py-4`)}><!--[-->`);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let highlight = each_array[index];
      const isActive = store_get($$store_subs ??= {}, "$currentHighlightIndex", currentHighlightIndex) === index;
      $$payload.out.push(`<button>`);
      Index$d($$payload, {
        currentSectionIndex: index,
        title: highlight.name,
        isActive,
        colorScheme: "white"
      });
      $$payload.out.push(`<!----></button>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const visibility$3 = createAreaBasedStateVisibility(ComponentId.Schedule, { proximityRadius: 150, areaOffset: 100, hideDelay: 2e3 });
const { isDisplay: isDisplay$3, showComponent: showComponent$1 } = visibility$3;
visibility$3.updatePosition;
const destroyVisibilityManager$2 = visibility$3.destroy;
function Schedule($$payload, $$props) {
  push();
  var $$store_subs;
  onDestroy(() => destroyVisibilityManager$2());
  if (store_get($$store_subs ??= {}, "$isDisplay", isDisplay$3)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<nav${attr_class(`${CONTAINER_PRESETS.panel.blur} fixed bottom-0 left-1/2 z-20 mx-auto flex max-w-5xl -translate-x-1/2 flex-col gap-2 rounded-t-3xl rounded-b-none border-t border-white/20 px-4 py-4 text-white`)}><div class="flex flex-wrap items-center justify-center gap-20 p-4">`);
    Index$8($$payload, { title: "Weekdays", subtitle: "09.00 – 17.00" });
    $$payload.out.push(`<!----> `);
    Index$8($$payload, { title: "Weekends", subtitle: "10.00 – 16.00" });
    $$payload.out.push(`<!----> `);
    Index$8($$payload, { title: "Sunday", subtitle: "Closed" });
    $$payload.out.push(`<!----></div></nav>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (store_get($$store_subs ??= {}, "$showComponent", showComponent$1)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="fixed bottom-2 left-1/2 z-20 -translate-x-1/2"><div class="bg-primary-950/80 flex items-center justify-center overflow-hidden rounded-2xl border border-white/20 shadow-lg backdrop-blur-lg"><button class="flex h-14 w-14 items-center justify-center bg-white/10 transition-all duration-300 hover:bg-white/20" title="Operating Hours"><div class="text-lg text-white">`);
      ChevronUpOutline($$payload, {});
      $$payload.out.push(`<!----></div></button></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const localeLabels = {
  id: "Bahasa Indonesia",
  en: "English",
  ja: "日本語"
};
function getLocaleLabel(locale) {
  return localeLabels[locale] || locale;
}
const visibility$2 = createAreaBasedStateVisibility(ComponentId.LanguageSwitch, {
  targetArea: "left",
  proximityRadius: 50,
  areaOffset: 50,
  hideDelay: 2e3,
  showComponent: true
});
lockVisibility(ComponentId.LanguageSwitch, true);
const { isDisplay: isDisplay$2, showComponent } = visibility$2;
visibility$2.updatePosition;
visibility$2.destroy;
function LanguageSwitcher($$payload, $$props) {
  push();
  var $$store_subs;
  let selectedClass;
  onDestroy(() => visibility$2.destroy);
  selectedClass = (locale) => `group flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-125 hover:bg-white/20 ${store_get($$store_subs ??= {}, "$localeStore", localeStore).current === locale ? "bg-white/20" : ""}`;
  if (store_get($$store_subs ??= {}, "$isDisplay", isDisplay$2)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div${attr_class(clsx(CONTAINER_PRESETS.positioned.leftCenter))}><div${attr_class(`${CONTAINER_PRESETS.panel.blur} flex flex-col flex-wrap gap-4`)}><button${attr_class(clsx(selectedClass(Locale.Id)))}${attr("title", getLocaleLabel(Locale.Id))}>`);
    Index$9($$payload, { locale: Locale.Id, size: "xs" });
    $$payload.out.push(`<!----></button> <button${attr_class(clsx(selectedClass(Locale.En)))}${attr("title", getLocaleLabel(Locale.En))}>`);
    Index$9($$payload, { locale: Locale.En, size: "xs" });
    $$payload.out.push(`<!----></button> <button${attr_class(clsx(selectedClass(Locale.Ja)))}${attr("title", getLocaleLabel(Locale.Ja))}>`);
    Index$9($$payload, { locale: Locale.Ja, size: "xs" });
    $$payload.out.push(`<!----></button></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (store_get($$store_subs ??= {}, "$showComponent", showComponent)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div${attr_class(`${CONTAINER_PRESETS.panel.blur} ${CONTAINER_PRESETS.positioned.leftCenter}`)}>`);
      if (store_get($$store_subs ??= {}, "$localeStore", localeStore).current === Locale.Id) {
        $$payload.out.push("<!--[-->");
        Index$9($$payload, { locale: Locale.Id, size: "xs" });
      } else {
        $$payload.out.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$localeStore", localeStore).current === Locale.En) {
          $$payload.out.push("<!--[-->");
          Index$9($$payload, { locale: Locale.En, size: "xs" });
        } else {
          $$payload.out.push("<!--[!-->");
          if (store_get($$store_subs ??= {}, "$localeStore", localeStore).current === Locale.Ja) {
            $$payload.out.push("<!--[-->");
            Index$9($$payload, { locale: Locale.Ja, size: "xs" });
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Branch($$payload, $$props) {
  push();
  let { branch, selected = false, disabled = false } = $$props;
  const getBranchClasses = () => {
    const baseClasses = "relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer group w-full text-left";
    if (!branch.available) {
      return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
    }
    if (disabled) {
      return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
    }
    if (selected) {
      return `${baseClasses} border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-[1.02]`;
    }
    return `${baseClasses} border-gray-700 bg-white/5 hover:border-orange-400 hover:bg-orange-400/5 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-400/10`;
  };
  $$payload.out.push(`<button type="button"${attr_class(clsx(getBranchClasses()))}${attr("tabindex", disabled || !branch.available ? -1 : 0)}>`);
  if (selected) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="absolute right-3 top-3 sm:right-4 sm:top-4">`);
    CheckCircleSolid($$payload, { class: "h-5 w-5 sm:h-6 sm:w-6 text-orange-500" });
    $$payload.out.push(`<!----></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="space-y-3"><h4 class="text-lg sm:text-xl font-semibold text-white transition-colors group-hover:text-orange-400 pr-8">${escape_html(branch.name)}</h4> <div class="flex items-start gap-2 sm:gap-3 text-gray-300">`);
  MapPinSolid($$payload, { class: "mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" });
  $$payload.out.push(`<!----> <span class="text-xs sm:text-sm leading-relaxed">${escape_html(branch.address)}</span></div> `);
  if (branch.phone) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center gap-2 sm:gap-3 text-gray-300">`);
    PhoneSolid($$payload, { class: "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" });
    $$payload.out.push(`<!----> <span class="text-xs sm:text-sm">${escape_html(branch.phone)}</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="mt-3 sm:mt-4 flex items-center gap-2"><div${attr_class(`h-2 w-2 rounded-full ${stringify(branch.available ? "bg-green-500" : "bg-red-500")}`)}></div> <span${attr_class(`text-xs font-medium ${stringify(branch.available ? "text-green-400" : "text-red-400")}`)}>${escape_html(branch.available ? "Tersedia" : "Tidak Tersedia")}</span></div></div> `);
  if (branch.available && !disabled) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></button>`);
  pop();
}
function BranchSelector($$payload, $$props) {
  push();
  let branches = fallback($$props["branches"], () => [], true);
  let selectedBranch2 = fallback($$props["selectedBranch"], null);
  let disabled = fallback($$props["disabled"], false);
  let title = fallback($$props["title"], "Pilih Cabang");
  let subtitle = fallback($$props["subtitle"], "Pilih cabang ABSteak yang ingin Anda kunjungi");
  let loading = fallback($$props["loading"], false);
  let onBack = fallback($$props["onBack"], null);
  let onBranchSelected = fallback($$props["onBranchSelected"], null);
  let onBranchDeselected = fallback($$props["onBranchDeselected"], null);
  function isSelected(branch) {
    return selectedBranch2?.id === branch.id;
  }
  $$payload.out.push(`<div class="space-y-6 pb-4 pr-3" aria-label="Branch selection" role="region">`);
  Index$b($$payload, {
    title,
    subtitle,
    children: ($$payload2) => {
      if (onBack !== null) {
        $$payload2.out.push("<!--[-->");
        Back($$payload2, { slot: "left", onclick: onBack });
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]-->`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  if (loading) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center justify-center py-12"><div class="text-center"><div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div> <p class="text-gray-300">Loading branches...</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (branches.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex items-center justify-center py-12"><div class="text-center"><p class="mb-2 text-gray-300">No branches available</p> <p class="text-sm text-gray-400">Please try again later</p></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array = ensure_array_like(branches);
      $$payload.out.push(`<div class="flex flex-col gap-4 space-y-4"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let branch = each_array[$$index];
        Branch($$payload, {
          branch,
          selected: isSelected(branch),
          disabled
        });
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--> `);
  if (selectedBranch2) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="mt-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4"><div class="flex items-center gap-3">`);
    CheckCircleSolid($$payload, { class: "h-5 w-5 flex-shrink-0 text-orange-500" });
    $$payload.out.push(`<!----> <div><p class="text-sm font-medium text-orange-400">Cabang Terpilih:</p> <p class="font-semibold text-white">${escape_html(selectedBranch2.name)}</p></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, {
    branches,
    selectedBranch: selectedBranch2,
    disabled,
    title,
    subtitle,
    loading,
    onBack,
    onBranchSelected,
    onBranchDeselected
  });
  pop();
}
function Outlet($$payload, $$props) {
  push();
  let { outlet, selected = false, disabled = false } = $$props;
  const typeConfig = {
    indoor: { icon: BuildingSolid, label: "Ruangan Dalam" },
    outdoor: { icon: HomeSolid, label: "Ruangan Luar" },
    private: { icon: UsersSolid, label: "Ruangan Privat" }
  };
  const priceColors = {
    $: "text-green-400 bg-green-400/10 border-green-400/20",
    $$: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    $$$: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    $$$$: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Standard: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Premium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Luxury: "text-purple-400 bg-purple-400/10 border-purple-400/20"
  };
  const typeInfo = typeConfig[outlet.type] || typeConfig.indoor;
  const IconComponent = typeInfo.icon;
  const isInteractive = outlet.available && !disabled;
  const priceColorClass = outlet.priceRange ? priceColors[outlet.priceRange] || "text-gray-400 bg-gray-400/10 border-gray-400/20" : "";
  $$payload.out.push(`<button type="button"${attr_class(`group relative w-full rounded-xl border text-left backdrop-blur-sm transition-all duration-300 ease-out ${stringify(selected ? "scale-[1.02] border-orange-400/60 bg-orange-400/15 shadow-lg shadow-orange-400/20" : isInteractive ? "hover:bg-orange-400/8 border-white/20 bg-white/5 hover:scale-[1.01] hover:border-orange-400/40 hover:shadow-md hover:shadow-orange-400/10" : "cursor-not-allowed border-white/10 bg-white/5 opacity-60")} p-5`)}${attr("tabindex", isInteractive ? 0 : -1)}${attr("disabled", !isInteractive, true)}><div class="mb-4 flex items-start justify-between"><div class="flex min-w-0 flex-1 items-center gap-3"><!---->`);
  IconComponent($$payload, { class: "h-5 w-5 flex-shrink-0 text-orange-400" });
  $$payload.out.push(`<!----> <div class="min-w-0 flex-1"><h3 class="truncate text-lg font-semibold leading-tight text-white transition-colors group-hover:text-orange-300">${escape_html(outlet.name)}</h3> <p class="mt-0.5 text-sm text-gray-400">${escape_html(typeInfo.label)}</p></div></div> `);
  if (outlet.priceRange) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<span${attr_class(`rounded-lg border px-2.5 py-1 text-xs font-medium ${stringify(priceColorClass)} ml-3 flex-shrink-0`)}>${escape_html(outlet.priceRange)}</span>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-3"><div class="flex items-center gap-2 text-gray-300">`);
  UsersSolid($$payload, { class: "h-4 w-4 flex-shrink-0" });
  $$payload.out.push(`<!----> <span class="text-sm">${escape_html(outlet.capacity)} orang</span></div> <div class="flex justify-between">`);
  if (outlet.features.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(outlet.features.slice(0, 3));
    $$payload.out.push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let feature = each_array[$$index];
      $$payload.out.push(`<span class="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs text-gray-300">${escape_html(feature)}</span>`);
    }
    $$payload.out.push(`<!--]--> `);
    if (outlet.features.length > 3) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<span class="px-2 py-1 text-xs text-gray-400">+${escape_html(outlet.features.length - 3)} lainnya</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="flex items-center gap-2 pt-1"><div${attr_class(`h-2 w-2 rounded-full ${stringify(outlet.available ? "bg-emerald-400" : "bg-red-400")}`)}></div> <span${attr_class(`text-xs font-medium ${stringify(outlet.available ? "text-emerald-400" : "text-red-400")}`)}>${escape_html(outlet.available ? "Tersedia" : "Tidak Tersedia")}</span></div></div></div> `);
  if (isInteractive) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 via-orange-400/0 to-orange-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></button>`);
  pop();
}
function OutletSelector($$payload, $$props) {
  push();
  let {
    outlets = [],
    selectedBranch: selectedBranch2 = null,
    selectedOutlet: selectedOutlet2 = null,
    disabled = false,
    title = "Pilih Outlet",
    subtitle = "",
    loading = false,
    onBack = null
  } = $$props;
  const availableOutlets = selectedBranch2 ? outlets.filter((outlet) => outlet.branchId === selectedBranch2.id) : [];
  const isDisabled = disabled || !selectedBranch2;
  const isSelected = (outlet) => {
    return selectedOutlet2?.id === outlet.id;
  };
  $$payload.out.push(`<div class="space-y-6 pb-4 pr-3" aria-label="Outlet selection" role="region">`);
  Index$b($$payload, {
    title,
    subtitle,
    children: ($$payload2) => {
      if (onBack) {
        $$payload2.out.push("<!--[-->");
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]-->`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> <main class="space-y-6">`);
  if (loading) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="py-12 text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center"><div class="h-12 w-12 animate-spin rounded-full border-b-2 border-white/30"></div></div> <p class="text-lg text-gray-300">Loading outlets...</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (!selectedBranch2) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="py-12 text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">`);
      BuildingSolid($$payload, { class: "h-8 w-8 text-gray-300" });
      $$payload.out.push(`<!----></div> <p class="text-lg text-gray-300">Pilih cabang terlebih dahulu untuk melihat outlet yang tersedia</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (availableOutlets.length === 0) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="py-12 text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">`);
        BuildingSolid($$payload, { class: "h-8 w-8 text-gray-300" });
        $$payload.out.push(`<!----></div> <p class="text-lg text-gray-300">Tidak ada outlet tersedia di cabang ini</p></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
        const each_array = ensure_array_like(availableOutlets);
        $$payload.out.push(`<div class="space-y-4"><!--[-->`);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let outlet = each_array[$$index];
          Outlet($$payload, {
            outlet,
            selected: isSelected(outlet),
            disabled: isDisabled
          });
        }
        $$payload.out.push(`<!--]--></div>`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></main></div>`);
  pop();
}
function PlayButton($$payload, $$props) {
  let buttonSizeClass, pingSizeClass, buttonColorClass, pingColorClass, overlayClasses, buttonClasses;
  let size = fallback($$props["size"], "lg");
  let color = fallback($$props["color"], "primary");
  let overlayOpacity = fallback($$props["overlayOpacity"], "bg-black/20");
  let hoverOverlayOpacity = fallback($$props["hoverOverlayOpacity"], "bg-black/30");
  let buttonClass = fallback($$props["buttonClass"], "");
  let overlayClass = fallback($$props["overlayClass"], "");
  let ariaLabel = fallback($$props["ariaLabel"], "Play video");
  let showOverlay = fallback($$props["showOverlay"], true);
  let showPingAnimation = fallback($$props["showPingAnimation"], true);
  let pingDelay12 = fallback($$props["pingDelay1"], 0);
  let pingDelay22 = fallback($$props["pingDelay2"], 1);
  let pingOpacity2 = fallback($$props["pingOpacity"], 0.6);
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };
  const pingSizeClasses = {
    sm: "h-14 w-14",
    md: "h-16 w-16",
    lg: "h-20 w-20",
    xl: "h-28 w-28"
  };
  const colorClasses = {
    primary: "bg-primary-600 hover:bg-primary-700",
    secondary: "bg-secondary-600 hover:bg-secondary-700",
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700"
  };
  const pingColorClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500"
  };
  buttonSizeClass = sizeClasses[size];
  pingSizeClass = pingSizeClasses[size];
  buttonColorClass = colorClasses[color];
  pingColorClass = pingColorClasses[color];
  overlayClasses = showOverlay ? `absolute inset-0 flex items-center justify-center ${overlayOpacity} transition-all duration-300 group-hover:${hoverOverlayOpacity} ${overlayClass}` : "flex items-center justify-center";
  buttonClasses = `${buttonSizeClass} ${buttonColorClass} transform cursor-pointer border-0 shadow-lg transition-all duration-300 hover:scale-110 relative z-10 ${buttonClass}`;
  $$payload.out.push(`<div${attr_class(clsx(overlayClasses))}><div class="relative flex items-center justify-center">`);
  if (showPingAnimation) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<span${attr_class(`absolute ${pingSizeClass} ${pingColorClass} rounded-full animate-ping`)}${attr_style(`animation-delay: ${stringify(pingDelay12)}s; opacity: ${stringify(pingOpacity2)}; animation-duration: 2s;`)}></span> <span${attr_class(`absolute ${pingSizeClass} ${pingColorClass} rounded-full animate-ping`)}${attr_style(`animation-delay: ${stringify(pingDelay22)}s; opacity: ${stringify(pingOpacity2)}; animation-duration: 2s;`)}></span>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  Index$g($$payload, {
    color,
    pill: true,
    class: buttonClasses,
    "aria-label": ariaLabel,
    children: ($$payload2) => {
      PlayOutline($$payload2, {});
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div>`);
  bind_props($$props, {
    size,
    color,
    overlayOpacity,
    hoverOverlayOpacity,
    buttonClass,
    overlayClass,
    ariaLabel,
    showOverlay,
    showPingAnimation,
    pingDelay1: pingDelay12,
    pingDelay2: pingDelay22,
    pingOpacity: pingOpacity2
  });
}
function Stepper($$payload, $$props) {
  push();
  let containerClasses, labelClasses;
  let steps2 = fallback($$props["steps"], () => [], true);
  let currentStep2 = fallback($$props["currentStep"], 0);
  let variant = fallback($$props["variant"], "default");
  let orientation = fallback($$props["orientation"], "horizontal");
  let type = fallback($$props["type"], "numbered");
  let label = fallback($$props["label"], "");
  let clickable = fallback($$props["clickable"], true);
  let showConnector = fallback($$props["showConnector"], true);
  let disabled = fallback($$props["disabled"], false);
  let error2 = fallback($$props["error"], "");
  let success = fallback($$props["success"], "");
  let id = fallback($$props["id"], "");
  let classes = fallback($$props["classes"], () => ({}), true);
  function getStepClasses(step, index) {
    const stepClasses = orientation === "horizontal" ? "flex flex-col items-center text-center" : "flex items-center space-x-3";
    return `${stepClasses} ${classes.step || ""}`;
  }
  function getConnectorClasses(index) {
    const isCompleted = index < currentStep2;
    return getStepperConnectorClasses(variant, orientation, isCompleted) + ` ${classes.connector || ""}`;
  }
  function getLocalStepIndicatorClasses(step, index) {
    const isActive = index === currentStep2;
    const isCompleted = step.completed || index < currentStep2;
    const state = isCompleted ? "completed" : isActive ? "active" : "inactive";
    return getStepperIndicatorClasses(variant, state);
  }
  containerClasses = getStepperContainerClasses(variant, orientation) + ` ${classes.container || ""}`;
  labelClasses = getLabelClasses(variant);
  const each_array = ensure_array_like(steps2);
  if (label) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<label${attr("for", id)}${attr_class(clsx(labelClasses))}>${escape_html(label)}</label>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div${attr_class(clsx(containerClasses))}${attr("id", id)}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let step = each_array[index];
    $$payload.out.push(`<div${attr_class(clsx(getStepClasses()))} role="button"${attr("tabindex", clickable && !step.disabled && !disabled ? 0 : -1)}${attr("aria-current", index === currentStep2 ? "step" : void 0)}${attr("aria-disabled", step.disabled || disabled)}><div${attr_class(clsx(getLocalStepIndicatorClasses(step, index)))}>`);
    if (type === "icon" && step.icon) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<i${attr_class(clsx(step.icon))}></i>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (type === "progress" && (step.completed || index < currentStep2)) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`${escape_html(index + 1)}`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></div> <div${attr_class(`${orientation === "horizontal" ? "mt-2" : "ml-3"} ${classes.content || ""}`)}><div class="text-sm text-white font-medium">${escape_html(step.title)}</div></div></div> `);
    if (showConnector && index < steps2.length - 1) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div${attr_class(clsx(getConnectorClasses(index)))}></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div> `);
  if (error2) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div${attr_class(clsx(UI_MESSAGES.error))}><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> <span>${escape_html(error2)}</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (success) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div${attr_class(clsx(UI_MESSAGES.success))}><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> <span>${escape_html(success)}</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, {
    steps: steps2,
    currentStep: currentStep2,
    variant,
    orientation,
    type,
    label,
    clickable,
    showConnector,
    disabled,
    error: error2,
    success,
    id,
    classes
  });
  pop();
}
function ThumbnailMedia($$payload, $$props) {
  push();
  let src = $$props["src"];
  let alt = fallback($$props["alt"], "Video thumbnail");
  let onClick = $$props["onClick"];
  let showOverlay = fallback($$props["showOverlay"], true);
  let showPlayButton = fallback($$props["showPlayButton"], true);
  let playButtonSize = fallback($$props["playButtonSize"], "lg");
  let playButtonColor = fallback($$props["playButtonColor"], "primary");
  let pingDelay12 = fallback($$props["pingDelay1"], 0.5);
  let pingDelay22 = fallback($$props["pingDelay2"], 1.5);
  let pingOpacity2 = fallback($$props["pingOpacity"], 0.8);
  let showPingAnimation = fallback($$props["showPingAnimation"], true);
  let containerClass = fallback($$props["containerClass"], "");
  let imageClass = fallback($$props["imageClass"], "");
  let overlayClass = fallback($$props["overlayClass"], "");
  $$payload.out.push(`<div${attr_class(`group relative aspect-video w-full cursor-pointer overflow-hidden ${stringify(containerClass)}`)} role="button" tabindex="0" aria-label="Play video"><img${attr("src", src)}${attr("alt", alt)}${attr_class(`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${stringify(imageClass)}`)}/> `);
  if (showOverlay) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div${attr_class(`absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/30 ${stringify(overlayClass)}`)}>`);
    if (showPlayButton) {
      $$payload.out.push("<!--[-->");
      PlayButton($$payload, {
        size: playButtonSize,
        color: playButtonColor,
        pingDelay1: pingDelay12,
        pingDelay2: pingDelay22,
        pingOpacity: pingOpacity2,
        showPingAnimation
      });
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<div class="absolute inset-0 flex items-center justify-center"><!---->`);
      slot($$payload, $$props, "overlay", {}, null);
      $$payload.out.push(`<!----></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, {
    src,
    alt,
    onClick,
    showOverlay,
    showPlayButton,
    playButtonSize,
    playButtonColor,
    pingDelay1: pingDelay12,
    pingDelay2: pingDelay22,
    pingOpacity: pingOpacity2,
    showPingAnimation,
    containerClass,
    imageClass,
    overlayClass
  });
  pop();
}
function VideoOverlay($$payload, $$props) {
  push();
  var $$store_subs;
  let show = fallback($$props["show"], false);
  let videoUrl = $$props["videoUrl"];
  let captionUrl = fallback($$props["captionUrl"], "");
  let captionLanguage = fallback($$props["captionLanguage"], "en");
  let captionLabel = fallback($$props["captionLabel"], "English captions");
  let autoPlay = fallback($$props["autoPlay"], true);
  let closeOnBackdropClick = fallback($$props["closeOnBackdropClick"], true);
  let closeOnEscape = fallback($$props["closeOnEscape"], true);
  let preload = fallback($$props["preload"], "metadata");
  let animationDuration = fallback($$props["animationDuration"], 300);
  let onopen = fallback($$props["onopen"], void 0);
  let onclose = fallback($$props["onclose"], void 0);
  let onvideoended = fallback($$props["onvideoended"], void 0);
  let onvideoplay = fallback($$props["onvideoplay"], void 0);
  let onvideoPause = fallback($$props["onvideoPause"], void 0);
  let onvideoerror = fallback($$props["onvideoerror"], void 0);
  const modalId = "video-overlay-modal";
  const isModalOpen = derived(modalStore, () => isVideoModalOpen(modalId) && show);
  let previousModalState = false;
  function closeOverlay() {
    closeVideoModal(modalId);
  }
  function handleVideoPlay() {
    onvideoplay?.();
  }
  function handleVideoPause() {
    onvideoPause?.();
  }
  function handleVideoEnded() {
    onvideoended?.();
  }
  function handleVideoError(event) {
    onvideoerror?.(event);
  }
  {
    if (store_get($$store_subs ??= {}, "$isModalOpen", isModalOpen) !== previousModalState) {
      if (store_get($$store_subs ??= {}, "$isModalOpen", isModalOpen)) {
        onopen?.();
      } else {
        onclose?.();
      }
      previousModalState = store_get($$store_subs ??= {}, "$isModalOpen", isModalOpen);
    }
  }
  if (show) {
    openVideoModal(modalId);
  } else {
    closeVideoModal(modalId);
  }
  Index$f($$payload, {
    id: (
      // Stop video immediately
      // Close modal immediately
      modalId
    ),
    onClose: closeOverlay,
    closeOnBackdrop: closeOnBackdropClick,
    closeOnEscape,
    preventScroll: true,
    trapFocus: false,
    animationDuration,
    modalClass: "video-overlay-modal",
    backdropClass: "video-overlay-backdrop",
    contentClass: "w-[80vw]",
    showHeader: false,
    showCloseButton: false,
    showFooter: false,
    children: ($$payload2) => {
      Video($$payload2, {
        src: videoUrl,
        autoPlay,
        preload,
        muted: false,
        loop: false,
        containerClass: "",
        size: "full",
        aspectRatio: "16:9",
        rounded: "md",
        shadow: "xl",
        onplay: handleVideoPlay,
        onpause: handleVideoPause,
        onended: handleVideoEnded,
        onerror: handleVideoError
      });
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    show,
    videoUrl,
    captionUrl,
    captionLanguage,
    captionLabel,
    autoPlay,
    closeOnBackdropClick,
    closeOnEscape,
    preload,
    animationDuration,
    onopen,
    onclose,
    onvideoended,
    onvideoplay,
    onvideoPause,
    onvideoerror
  });
  pop();
}
function ScrollableImage($$payload, $$props) {
  push();
  let images = fallback($$props["images"], () => [], true);
  let heights = fallback($$props["heights"], () => [], true);
  let animationClass = fallback($$props["animationClass"], "");
  const each_array = ensure_array_like([...images, ...images]);
  $$payload.out.push(`<div${attr_class(`flex flex-col h-full ${animationClass}`)}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let image = each_array[index];
    $$payload.out.push(`<div${attr_class(`${heights[index % heights.length]} flex-shrink-0 w-full`)}>`);
    Index$c($$payload, {
      src: image,
      alt: "food",
      class: "object-cover w-full h-full block"
    });
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, { images, heights, animationClass });
  pop();
}
function Button_1($$payload, $$props) {
  push();
  var $$store_subs;
  const t = createTranslationStore();
  $$payload.out.push(`<div${attr_class(clsx(CONTAINER_SECTION.hero.buttons.container))}>`);
  Index$g($$payload, {
    href: "#menu",
    color: "yellow",
    pill: true,
    outline: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$t", t)("hero.menuButton", "Menu"))}`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Index$g($$payload, {
    href: "#reservation",
    variant: "warning",
    pill: true,
    outline: true,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->${escape_html(store_get($$store_subs ??= {}, "$t", t)("hero.bookButton", "Book"))}`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const IMAGES = [
  {
    url: "https://bootstrapmade.com/content/demo/Delicious/assets/img/hero-carousel/hero-carousel-1.jpg"
  },
  {
    url: "https://bootstrapmade.com/content/demo/Delicious/assets/img/hero-carousel/hero-carousel-2.jpg"
  }
];
function Index$5($$payload, $$props) {
  push();
  var $$store_subs;
  const t = createTranslationStore();
  Index$h($$payload, {
    carouselId: "top",
    images: IMAGES,
    children: ($$payload2) => {
      $$payload2.out.push(`<div${attr_class(clsx(CONTAINER_SECTION.hero.base))}><div${attr_class(clsx(CONTAINER_SECTION.hero.content.centered))}><div${attr_class(clsx(CONTAINER_SECTION.hero.logo.base))}>`);
      Logo($$payload2, { size: "2xl" });
      $$payload2.out.push(`<!----></div> <p${attr_class(clsx(CONTAINER_SECTION.hero.text.description))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("hero.description", "Experience the finest culinary journey with premium steaks grilled to perfection."))}</p> `);
      Button_1($$payload2);
      $$payload2.out.push(`<!----></div></div>`);
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
let pingDelay1 = 0.5;
let pingDelay2 = 1.5;
let pingOpacity = 0.8;
function Left$3($$payload, $$props) {
  push();
  let containerClass;
  const thumbnailUrl = "assets/thumbnail.webp";
  const thumbnailAlt = "video highlight";
  const videoUrl = "assets/videos/highlight.webm";
  let showOverlay = false;
  containerClass = `${CONTAINER_SECTION.videoHighlight.content.left}`;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<div${attr_class(clsx(containerClass))}>`);
    ThumbnailMedia($$payload2, {
      src: thumbnailUrl,
      alt: thumbnailAlt,
      onClick: () => showOverlay = true,
      containerClass: "h-full w-full",
      pingDelay1,
      pingDelay2,
      pingOpacity
    });
    $$payload2.out.push(`<!----></div> `);
    VideoOverlay($$payload2, {
      videoUrl,
      autoPlay: true,
      onclose: () => showOverlay = false,
      get show() {
        return showOverlay;
      },
      set show($$value) {
        showOverlay = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function Right$3($$payload, $$props) {
  push();
  var $$store_subs;
  let textContainerClasses;
  let className = fallback($$props["className"], "");
  const t = createTranslationStore();
  textContainerClasses = `${CONTAINER_SECTION.videoHighlight.content.right} ${CONTAINER_RESPONSIVE.text.base}`;
  $$payload.out.push(`<div${attr_class(`${textContainerClasses} ${className}`)}><div${attr_class(clsx(CONTAINER_SECTION.videoHighlight.flex))}><h2${attr_class(clsx(CONTAINER_SECTION.videoHighlight.text.title))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("videoHighlight.title") || "ABSteak Culinary Excellence")}</h2> `);
  if (store_get($$store_subs ??= {}, "$t", t)("videoHighlight.subtitle")) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p${attr_class(clsx(CONTAINER_SECTION.videoHighlight.text.subtitle))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("videoHighlight.subtitle"))}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (Array.isArray(store_get($$store_subs ??= {}, "$t", t)("videoHighlight.items")) && store_get($$store_subs ??= {}, "$t", t)("videoHighlight.items").length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(Array.isArray(store_get($$store_subs ??= {}, "$t", t)("videoHighlight.items")) ? store_get($$store_subs ??= {}, "$t", t)("videoHighlight.items") : []);
    $$payload.out.push(`<ul${attr_class(clsx(CONTAINER_SECTION.videoHighlight.item.unordered))}><!--[-->`);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let item = each_array[i];
      $$payload.out.push(`<li${attr_class(clsx(CONTAINER_SECTION.videoHighlight.item.list))}><svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"></polyline></svg> <span>${escape_html(item)}</span></li>`);
    }
    $$payload.out.push(`<!--]--></ul>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (store_get($$store_subs ??= {}, "$t", t)("videoHighlight.description")) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p${attr_class(clsx(CONTAINER_SECTION.videoHighlight.text.description))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("videoHighlight.description"))}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { className });
  pop();
}
function Index$4($$payload, $$props) {
  push();
  let flexDirection, sectionClasses, sectionStyle, contentContainerClasses;
  let backgroundColor = fallback($$props["backgroundColor"], "#fdf6ee");
  let layoutDirection = fallback($$props["layoutDirection"], "normal");
  let containerClass = fallback($$props["containerClass"], "");
  let contentClass = fallback($$props["contentClass"], "");
  flexDirection = layoutDirection === "reverse" ? "md:flex-row-reverse" : "md:flex-row";
  sectionClasses = `${CONTAINER_SECTION.videoHighlight.base} ${containerClass}`;
  sectionStyle = `background-color: ${backgroundColor};`;
  contentContainerClasses = `${CONTAINER_SECTION.videoHighlight.content.base} ${flexDirection}`;
  $$payload.out.push(`<section${attr_class(clsx(sectionClasses))}${attr_style(sectionStyle)}><div${attr_class(clsx(contentContainerClasses))}>`);
  Left$3($$payload);
  $$payload.out.push(`<!----> `);
  Right$3($$payload, { className: contentClass });
  $$payload.out.push(`<!----></div></section>`);
  bind_props($$props, {
    backgroundColor,
    layoutDirection,
    containerClass,
    contentClass
  });
  pop();
}
const BACKGROUND_IMAGE_URL = "https://res.cloudinary.com/gordonramsay/image/upload/c_fill,w_1920,h_640,q_auto,f_auto/Gordon%20Ramsay%20Restaurants%20-%20NA/default-light-bg_dddsi4";
function Left$2($$payload, $$props) {
  push();
  var $$store_subs;
  let textContainerClasses;
  const t = createTranslationStore();
  textContainerClasses = `${CONTAINER_SECTION.experience.content.left} ${CONTAINER_RESPONSIVE.text.base}`;
  $$payload.out.push(`<div${attr_class(`${textContainerClasses}`)}><div${attr_class(clsx(CONTAINER_SECTION.experience.flex))}><h2${attr_class(clsx(CONTAINER_SECTION.experience.text.title))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("experience.title"))}</h2> <p${attr_class(clsx(CONTAINER_SECTION.experience.text.description))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("experience.description"))}</p> <p${attr_class(clsx(CONTAINER_SECTION.experience.text.subtitle))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("experience.subtitle"))}</p></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const EXPERIENCE_LEFT_COLUMN_IMAGES = [
  "assets/images/preview/img_prev_1.webp",
  "assets/images/preview/img_prev_2.webp",
  "assets/images/preview/img_prev_3.webp",
  "assets/images/preview/img_prev_4.webp",
  "assets/images/preview/img_prev_5.webp",
  "assets/images/preview/img_prev_6.webp"
];
const EXPERIENCE_RIGHT_COLUMN_IMAGES = [
  "assets/images/preview/img_prev_7.webp",
  "assets/images/preview/img_prev_8.webp",
  "assets/images/preview/img_prev_9.webp",
  "assets/images/preview/img_prev_10.webp",
  "assets/images/preview/img_prev_11.webp",
  "assets/images/preview/img_prev_12.webp"
];
function Right$2($$payload, $$props) {
  push();
  let imageContainerClasses;
  let leftColumnImages = fallback($$props["leftColumnImages"], EXPERIENCE_LEFT_COLUMN_IMAGES);
  let rightColumnImages = fallback($$props["rightColumnImages"], EXPERIENCE_RIGHT_COLUMN_IMAGES);
  let leftColumnHeights = fallback($$props["leftColumnHeights"], () => ["h-48", "h-72", "h-56", "h-80", "h-64", "h-60"], true);
  let rightColumnHeights = fallback($$props["rightColumnHeights"], () => ["h-64", "h-52", "h-76", "h-68", "h-56", "h-72"], true);
  imageContainerClasses = `${CONTAINER_SECTION.experience.content.right}`;
  $$payload.out.push(`<div${attr_class(`${imageContainerClasses}`)}><div${attr_class(clsx(CONTAINER_SECTION.experience.scrollableImage.left))}>`);
  ScrollableImage($$payload, {
    images: leftColumnImages,
    heights: leftColumnHeights,
    animationClass: "animate-scroll-up"
  });
  $$payload.out.push(`<!----></div> <div${attr_class(clsx(CONTAINER_SECTION.experience.scrollableImage.right))}>`);
  ScrollableImage($$payload, {
    images: rightColumnImages,
    heights: rightColumnHeights,
    animationClass: "animate-scroll-down"
  });
  $$payload.out.push(`<!----></div></div>`);
  bind_props($$props, {
    leftColumnImages,
    rightColumnImages,
    leftColumnHeights,
    rightColumnHeights
  });
  pop();
}
const backgroundImage = BACKGROUND_IMAGE_URL;
function Index$3($$payload, $$props) {
  push();
  let flexDirection, sectionClasses, sectionStyle, contentContainerClasses;
  let backgroundColor = fallback($$props["backgroundColor"], "#fdf6ee");
  let layoutDirection = fallback($$props["layoutDirection"], "normal");
  flexDirection = layoutDirection === "reverse" ? "md:flex-row-reverse" : "md:flex-row";
  sectionClasses = `${CONTAINER_SECTION.experience.base}`;
  sectionStyle = `background-color: ${backgroundColor}; background-image: url('${backgroundImage}'); background-repeat: repeat; background-size: cover;`;
  contentContainerClasses = `${CONTAINER_SECTION.experience.content.base} ${flexDirection}`;
  $$payload.out.push(`<section${attr_class(clsx(sectionClasses))}${attr_style(sectionStyle)}><div${attr_class(clsx(contentContainerClasses))}>`);
  Left$2($$payload);
  $$payload.out.push(`<!----> `);
  Right$2($$payload, {});
  $$payload.out.push(`<!----></div></section>`);
  bind_props($$props, { backgroundColor, layoutDirection });
  pop();
}
const imageUrl = "assets/images/img_chef.webp";
function Left$1($$payload, $$props) {
  push();
  let imageContainerClasses, imageClasses;
  imageContainerClasses = `${CONTAINER_SECTION.chef.content.left} group relative overflow-hidden`;
  imageClasses = `${CONTAINER_SECTION.chef.image.base}`;
  $$payload.out.push(`<div${attr_class(clsx(imageContainerClasses))}>`);
  Index$c($$payload, { class: imageClasses, src: imageUrl, alt: "Chef Image" });
  $$payload.out.push(`<!----> <div class="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/30"></div></div>`);
  pop();
}
function Right$1($$payload, $$props) {
  push();
  var $$store_subs;
  let textContainerClasses;
  const t = createTranslationStore();
  textContainerClasses = `${CONTAINER_SECTION.chef.content.right} ${CONTAINER_RESPONSIVE.text.base}`;
  $$payload.out.push(`<div${attr_class(`${CONTAINER_SECTION.chef.content.right} ${textContainerClasses}`)}><div${attr_class(`${CONTAINER_SECTION.chef.flex}`)}><h2${attr_class(clsx(CONTAINER_SECTION.chef.text.title))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("chef.name") || "CHEF ABSTEAK")}</h2> <p${attr_class(clsx(CONTAINER_SECTION.chef.text.description))}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("chef.quote") || store_get($$store_subs ??= {}, "$t", t)("chef.description"))}</p></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Index$2($$payload, $$props) {
  push();
  let flexDirection, sectionClasses, sectionStyle, contentContainerClasses;
  let backgroundColor = fallback($$props["backgroundColor"], "#fdf6ee");
  let layout_direction = fallback($$props["layout_direction"], "normal");
  let containerClass = fallback($$props["containerClass"], "");
  flexDirection = layout_direction === "reverse" ? "md:flex-row-reverse" : "md:flex-row";
  sectionClasses = `${CONTAINER_SECTION.chef.base} ${containerClass}`;
  sectionStyle = `background-color: ${backgroundColor};`;
  contentContainerClasses = `${CONTAINER_SECTION.chef.content.base} ${flexDirection}`;
  $$payload.out.push(`<section${attr_class(clsx(sectionClasses))}${attr_style(sectionStyle)}><div${attr_class(clsx(contentContainerClasses))}>`);
  Left$1($$payload);
  $$payload.out.push(`<!----> `);
  Right$1($$payload);
  $$payload.out.push(`<!----></div></section>`);
  bind_props($$props, { backgroundColor, layout_direction, containerClass });
  pop();
}
const BACKGROUNDS = [
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1920"
];
const activeCategory = writable(0);
const isLoading = writable(false);
const error = writable(null);
const animationStates = writable({
  categoryTransition: false,
  itemsTransition: false,
  backgroundTransition: false
});
const uiPreferences = writable({
  showNutritionInfo: true,
  showIngredients: true,
  showAllergens: true,
  animationDuration: 400,
  autoScrollToTop: true
});
const fallbackMenuCategories = [
  {
    category: "Appetizer",
    items: [
      {
        name: "Wagyu Beef Tartare",
        desc: "Wagyu segar dipotong tangan dengan telur puyuh dan minyak truffle",
        price: "Rp 380.000",
        img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Foie Gras Pan-Seared",
        desc: "Disajikan dengan apel karamel dan reduksi wine port",
        price: "Rp 420.000",
        img: "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Tuna Sashimi Premium",
        desc: "Tuna bluefin segar dengan wasabi dan jahe acar",
        price: "Rp 320.000",
        img: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Lobster Bisque",
        desc: "Sup lobster kaya dan creamy dengan sentuhan cognac",
        price: "Rp 280.000",
        img: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    category: "Steak Premium",
    items: [
      {
        name: "Dry-Aged Ribeye A5",
        desc: "Ribeye premium aged 28 hari dengan bone marrow panggang",
        price: "Rp 980.000",
        img: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Wagyu Tenderloin",
        desc: "Tenderloin wagyu dengan saus truffle dan kentang fondant",
        price: "Rp 1.200.000",
        img: "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Tomahawk Steak",
        desc: "Steak tomahawk 800gr dengan herb butter dan sayuran panggang",
        price: "Rp 1.500.000",
        img: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Surf & Turf",
        desc: "Kombinasi steak tenderloin dan lobster thermidor",
        price: "Rp 1.800.000",
        img: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    category: "Dessert",
    items: [
      {
        name: "Chocolate Soufflé",
        desc: "Soufflé cokelat hitam dengan es krim vanilla",
        price: "Rp 180.000",
        img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Crème Brûlée",
        desc: "Custard vanilla klasik dengan gula karamel",
        price: "Rp 160.000",
        img: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Tiramisu Premium",
        desc: "Tiramisu Italia tradisional dengan espresso dan mascarpone",
        price: "Rp 170.000",
        img: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  }
];
const categoryImages = {
  0: {
    // Starters
    leftColumn: [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    rightColumn: [
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400"
    ]
  },
  1: {
    // Mains
    leftColumn: [
      "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    rightColumn: [
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400"
    ]
  },
  2: {
    // Desserts
    leftColumn: [
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400"
    ],
    rightColumn: [
      "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400"
    ]
  }
};
const imageHeights = {
  leftColumn: ["h-48", "h-72", "h-56", "h-80", "h-64", "h-60"],
  rightColumn: ["h-64", "h-52", "h-76", "h-68", "h-56", "h-72"]
};
const translationStore = createTranslationStore();
const menuCategories = derived(
  [translationStore],
  ([$t]) => {
    const translatedCategories = $t("menu.categories");
    if (Array.isArray(translatedCategories) && translatedCategories.length > 0) {
      return translatedCategories.map((category, categoryIndex) => ({
        category: category.name,
        items: Array.isArray(category.items) ? category.items.map((item, itemIndex) => ({
          name: item.name,
          desc: item.description,
          price: item.price,
          img: fallbackMenuCategories[categoryIndex]?.items[itemIndex]?.img || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
        })) : []
      }));
    }
    return fallbackMenuCategories;
  }
);
derived(
  [menuCategories, activeCategory],
  ([$menuCategories, $activeCategory]) => {
    return $menuCategories && $menuCategories.length > 0 ? $menuCategories[$activeCategory] || $menuCategories[0] : {
      category: "Loading...",
      items: []
    };
  }
);
const currentBackground = derived(
  [activeCategory],
  ([$activeCategory]) => {
    return BACKGROUNDS[$activeCategory] || BACKGROUNDS[0];
  }
);
const currentCategoryImages = derived(
  [activeCategory],
  ([$activeCategory]) => {
    return categoryImages[$activeCategory] || {
      leftColumn: [
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
      ],
      rightColumn: [
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
      ]
    };
  }
);
derived(
  [activeCategory, isLoading, error, animationStates, uiPreferences],
  ([$activeCategory, $isLoading, $error, $animationStates, $uiPreferences]) => ({
    activeCategory: $activeCategory,
    isLoading: $isLoading,
    error: $error,
    animationStates: $animationStates,
    uiPreferences: $uiPreferences
  })
);
const menuInterfaceActions = {
  /**
   * Set the active category
   */
  setActiveCategory: (index) => {
    activeCategory.update((current) => {
      let categories = [];
      menuCategories.subscribe((value) => categories = value)();
      if (categories && categories.length > 0 && index >= 0 && index < categories.length) {
        animationStates.update((state) => ({
          ...state,
          categoryTransition: true,
          backgroundTransition: true
        }));
        setTimeout(() => {
          animationStates.update((state) => ({
            ...state,
            categoryTransition: false,
            backgroundTransition: false
          }));
        }, 600);
        return index;
      }
      return current;
    });
  },
  /**
   * Set loading state
   */
  setLoading: (loading) => {
    isLoading.set(loading);
  },
  /**
   * Set error state
   */
  setError: (errorMessage) => {
    error.set(errorMessage);
  },
  /**
   * Clear error state
   */
  clearError: () => {
    error.set(null);
  },
  /**
   * Update UI preferences
   */
  updatePreferences: (preferences) => {
    uiPreferences.update((current) => ({
      ...current,
      ...preferences
    }));
  },
  /**
   * Reset interface to initial state
   */
  reset: () => {
    activeCategory.set(0);
    isLoading.set(false);
    error.set(null);
    animationStates.set({
      categoryTransition: false,
      itemsTransition: false,
      backgroundTransition: false
    });
  },
  /**
   * Create enhanced menu item for detail modal
   */
  createDetailMenuItem: (item, categoryName) => {
    return {
      ...item,
      category: categoryName,
      ingredients: [],
      // Add if available in your data
      allergens: [],
      // Add if available in your data
      nutritionInfo: {
        calories: 0,
        protein: "0g",
        carbs: "0g",
        fat: "0g"
      }
      // Add if available in your data
    };
  }
};
let InterfaceService$1 = class InterfaceService {
  /**
   * Get menu items for the currently selected category
   */
  static getMenuItems() {
    const currentCategory = this.getCurrentCategory();
    if (!currentCategory) {
      return [];
    }
    return currentCategory.items;
  }
  /**
   * Get menu items by category index
   */
  static getMenuItemsByCategory(categoryIndex) {
    const category = this.getCategoryByIndex(categoryIndex);
    if (!category) {
      return [];
    }
    return category.items;
  }
  /**
   * Select a category by index with validation and animation
   */
  static selectCategory(index) {
    try {
      const categories = get(menuCategories);
      const currentActive = get(activeCategory);
      if (!categories || categories.length === 0) {
        console.warn("No categories available");
        return false;
      }
      if (index < 0 || index >= categories.length) {
        console.warn(`Invalid category index: ${index}. Available: 0-${categories.length - 1}`);
        return false;
      }
      if (currentActive === index) {
        return true;
      }
      menuInterfaceActions.setLoading(true);
      menuInterfaceActions.clearError();
      menuInterfaceActions.setActiveCategory(index);
      setTimeout(() => {
        menuInterfaceActions.setLoading(false);
      }, 300);
      console.log(`Category changed to: ${categories[index].category} (index: ${index})`);
      return true;
    } catch (err) {
      console.error("Error selecting category:", err);
      menuInterfaceActions.setError("Failed to select category");
      menuInterfaceActions.setLoading(false);
      return false;
    }
  }
  /**
   * Get current active category
   */
  static getCurrentCategory() {
    const categories = get(menuCategories);
    const activeIndex = get(activeCategory);
    if (!categories || categories.length === 0 || activeIndex < 0 || activeIndex >= categories.length) {
      return null;
    }
    return categories[activeIndex];
  }
  /**
   * Get category by index
   */
  static getCategoryByIndex(index) {
    const categories = get(menuCategories);
    if (!categories || categories.length === 0 || index < 0 || index >= categories.length) {
      return null;
    }
    return categories[index];
  }
  /**
   * Navigate to next category
   */
  static nextCategory() {
    const categories = get(menuCategories);
    const currentIndex = get(activeCategory);
    if (!categories || categories.length === 0) {
      return false;
    }
    const nextIndex = (currentIndex + 1) % categories.length;
    return this.selectCategory(nextIndex);
  }
  /**
   * Navigate to previous category
   */
  static previousCategory() {
    const categories = get(menuCategories);
    const currentIndex = get(activeCategory);
    if (!categories || categories.length === 0) {
      return false;
    }
    const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
    return this.selectCategory(prevIndex);
  }
  /**
   * Reset interface to initial state
   */
  static reset() {
    menuInterfaceActions.reset();
    console.log("Menu interface reset to initial state");
  }
  /**
   * Update UI preferences
   */
  static updatePreferences(preferences) {
    uiPreferences.update((current) => ({
      ...current,
      ...preferences
    }));
    console.log("UI preferences updated:", preferences);
  }
  /**
   * Create enhanced menu item for detail modal
   */
  static createDetailMenuItem(item, categoryName) {
    const currentCategory = categoryName || this.getCurrentCategory()?.category || "Unknown";
    return menuInterfaceActions.createDetailMenuItem(item, currentCategory);
  }
  /**
   * Get interface state snapshot
   */
  static getState() {
    return {
      activeCategory: get(activeCategory),
      isLoading: get(isLoading),
      error: get(error),
      animationStates: get(animationStates),
      uiPreferences: get(uiPreferences),
      categories: get(menuCategories),
      currentCategory: this.getCurrentCategory()
    };
  }
  /**
   * Check if category transition is in progress
   */
  static isTransitioning() {
    const animations = get(animationStates);
    return animations.categoryTransition || animations.backgroundTransition;
  }
  /**
   * Wait for transition to complete
   */
  static async waitForTransition() {
    return new Promise((resolve) => {
      const checkTransition = () => {
        if (!this.isTransitioning()) {
          resolve();
        } else {
          setTimeout(checkTransition, 50);
        }
      };
      checkTransition();
    });
  }
  /**
   * Keyboard navigation handler
   */
  static handleKeyboardNavigation(event) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        return this.previousCategory();
      case "ArrowRight":
        event.preventDefault();
        return this.nextCategory();
      case "Home":
        event.preventDefault();
        return this.selectCategory(0);
      case "End":
        event.preventDefault();
        const categories = get(menuCategories);
        return this.selectCategory(categories.length - 1);
      default:
        return false;
    }
  }
  /**
   * Validate menu data integrity
   */
  static validateMenuData() {
    const categories = get(menuCategories);
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      menuInterfaceActions.setError("No menu categories available");
      return false;
    }
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (!category.category || !Array.isArray(category.items)) {
        menuInterfaceActions.setError(`Invalid category data at index ${i}`);
        return false;
      }
    }
    menuInterfaceActions.clearError();
    return true;
  }
};
const itemInterface = {
  getMenuItems: InterfaceService$1.getMenuItems.bind(InterfaceService$1),
  getMenuItemsByCategory: InterfaceService$1.getMenuItemsByCategory.bind(InterfaceService$1)
};
({
  selectCategory: InterfaceService$1.selectCategory.bind(InterfaceService$1),
  getCurrentCategory: InterfaceService$1.getCurrentCategory.bind(InterfaceService$1),
  nextCategory: InterfaceService$1.nextCategory.bind(InterfaceService$1),
  previousCategory: InterfaceService$1.previousCategory.bind(InterfaceService$1),
  reset: InterfaceService$1.reset.bind(InterfaceService$1),
  getState: InterfaceService$1.getState.bind(InterfaceService$1),
  handleKeyboard: InterfaceService$1.handleKeyboardNavigation.bind(InterfaceService$1),
  validate: InterfaceService$1.validateMenuData.bind(InterfaceService$1)
});
function Category($$payload, $$props) {
  push();
  var $$store_subs;
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$menuCategories", menuCategories));
  $$payload.out.push(`<div${attr_class(`${CONTAINER_SECTION.menu.category.base}`)}><!--[-->`);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let category = each_array[index];
    $$payload.out.push(`<button${attr_class(`${CONTAINER_SECTION.menu.category.tab} transition-all duration-300 ${store_get($$store_subs ??= {}, "$activeCategory", activeCategory) === index ? "scale-105 bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/50" : "border border-gray-600/50 bg-gray-900/80 text-white hover:scale-105 hover:border-amber-400/50 hover:bg-gray-800/90"}`)}>${escape_html(category.category)}</button>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Item($$payload, $$props) {
  push();
  const { getMenuItems } = itemInterface;
  const items = getMenuItems();
  const { close } = modalActionInterface;
  const each_array = ensure_array_like(items);
  $$payload.out.push(`<div${attr_class(`menu-scrollbar max-h-80 space-y-3 overflow-y-auto p-2 md:max-h-96 md:space-y-4`)} role="region" aria-label="Menu items"><!--[-->`);
  for (let itemIndex = 0, $$length = each_array.length; itemIndex < $$length; itemIndex++) {
    let item = each_array[itemIndex];
    $$payload.out.push(`<button${attr_class(`${CONTAINER_SECTION.menu.item.list.base} transition-all duration-300 hover:scale-[1.02]`)}><div class="flex items-center justify-between"><div class="flex-1"><h3${attr_class(`${CONTAINER_SECTION.menu.item.list.title} drop-shadow-lg`)}>${escape_html(item.name)}</h3> <p${attr_class(`${CONTAINER_SECTION.menu.item.list.description} drop-shadow-sm`)}>${escape_html(item.desc)}</p></div> <div class="ml-4 text-right"><span${attr_class(`${CONTAINER_SECTION.menu.item.list.price} drop-shadow-lg`)}>${escape_html(item.price)}</span></div></div></button>`);
  }
  $$payload.out.push(`<!--]--></div> `);
  Index$6($$payload, { onClose: close, onModalClosed: close });
  $$payload.out.push(`<!---->`);
  pop();
}
function Left($$payload, $$props) {
  push();
  var $$store_subs;
  const t = createTranslationStore();
  $$payload.out.push(`<div${attr_class(`${CONTAINER_SECTION.menu.content.left} ${CONTAINER_SECTION.menu.text.base}`)}><div${attr_class(clsx(CONTAINER_SECTION.experience.flex))}><h2${attr_class(`${CONTAINER_SECTION.menu.text.title} drop-shadow-2xl`)}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("menu.title") || "MENU SIGNATURE KAMI")}</h2> <p${attr_class(`${CONTAINER_SECTION.menu.text.description} drop-shadow-lg`)}>${escape_html(store_get($$store_subs ??= {}, "$t", t)("menu.subtitle") || "Rasakan keunggulan kuliner dengan pilihan hidangan yang dikurasi dengan cermat, dibuat oleh chef kelas dunia menggunakan bahan-bahan terbaik.")}</p> `);
  Category($$payload);
  $$payload.out.push(`<!----> `);
  Item($$payload);
  $$payload.out.push(`<!----></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Right($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out.push(`<div${attr_class(`${CONTAINER_SECTION.menu.content.right}`)}><div${attr_class(`${CONTAINER_SECTION.menu.scrollableImage.left}`)}><!---->`);
  {
    $$payload.out.push(`<div class="h-full">`);
    ScrollableImage($$payload, {
      images: store_get($$store_subs ??= {}, "$currentCategoryImages", currentCategoryImages).leftColumn,
      heights: imageHeights.leftColumn,
      animationClass: "animate-scroll-up"
    });
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!----></div> <div${attr_class(`${CONTAINER_SECTION.menu.scrollableImage.right}`)}><!---->`);
  {
    $$payload.out.push(`<div class="h-full">`);
    ScrollableImage($$payload, {
      images: store_get($$store_subs ??= {}, "$currentCategoryImages", currentCategoryImages).rightColumn,
      heights: imageHeights.rightColumn,
      animationClass: "animate-scroll-down"
    });
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!----></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Index$1($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out.push(`<section${attr_class(`${CONTAINER_SECTION.menu.base} bg-cover bg-center`)}${attr_style(`background-image: url('${stringify(store_get($$store_subs ??= {}, "$currentBackground", currentBackground))}');`)}><div${attr_class(`${CONTAINER_SECTION.menu.overlay.first}`)}></div> <div${attr_class(`${CONTAINER_SECTION.menu.overlay.second}`)}></div> <div${attr_class(`${CONTAINER_SECTION.menu.content.base}`)}>`);
  Left($$payload);
  $$payload.out.push(`<!----> `);
  Right($$payload);
  $$payload.out.push(`<!----></div></section>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const OUTLET_DUMMY = [
  {
    id: "outlet-1",
    name: "Main Dining Room",
    branchId: "branch-1",
    type: "indoor",
    capacity: 80,
    features: ["AC", "Live Music", "City View"],
    available: true,
    priceRange: "Premium"
  },
  {
    id: "outlet-2",
    name: "Garden Terrace",
    branchId: "branch-1",
    type: "outdoor",
    capacity: 40,
    features: ["Garden View", "Fresh Air", "Romantic Setting"],
    available: true,
    priceRange: "Premium"
  },
  {
    id: "outlet-3",
    name: "Private Room VIP",
    branchId: "branch-1",
    type: "private",
    capacity: 12,
    features: ["Private", "Karaoke", "Projector"],
    available: true,
    priceRange: "Luxury"
  },
  {
    id: "outlet-4",
    name: "Main Hall",
    branchId: "branch-2",
    type: "indoor",
    capacity: 60,
    features: ["AC", "Traditional Decor"],
    available: true,
    priceRange: "Standard"
  },
  {
    id: "outlet-5",
    name: "Rooftop Dining",
    branchId: "branch-2",
    type: "outdoor",
    capacity: 30,
    features: ["Mountain View", "Sunset View"],
    available: false,
    priceRange: "Premium"
  }
];
const BRANCH_DUMMY = [
  {
    id: "branch-1",
    name: "ABSteak Jakarta Pusat",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    phone: "+62 21 1234 5678",
    available: true
  },
  {
    id: "branch-2",
    name: "ABSteak Bandung",
    address: "Jl. Braga No. 45, Bandung",
    phone: "+62 22 8765 4321",
    available: true
  },
  {
    id: "branch-3",
    name: "ABSteak Surabaya",
    address: "Jl. Pemuda No. 67, Surabaya",
    phone: "+62 31 9876 5432",
    available: false
  }
];
const initialData$1 = {
  selectedBranch: null,
  selectedOutlet: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  partySize: 2,
  specialRequests: ""
};
const initialErrors$1 = {};
const initialTouched$1 = {
  selectedBranch: false,
  selectedOutlet: false,
  customerName: false,
  customerEmail: false,
  customerPhone: false,
  partySize: false,
  specialRequests: false
};
const initialState$2 = {
  data: initialData$1,
  errors: initialErrors$1,
  isValid: false,
  isSubmitting: false,
  touched: initialTouched$1
};
function createPersonalFormStore() {
  const { subscribe, set, update } = writable(initialState$2);
  return {
    subscribe,
    // Update specific field
    updateField: (field, value, markAsTouched = true) => {
      update((state) => {
        const newData = { ...state.data, [field]: value };
        const newState = {
          ...state,
          data: newData,
          touched: markAsTouched ? { ...state.touched, [field]: true } : state.touched
        };
        return { ...newState, errors: {}, isValid: true };
      });
    },
    // Set branch and reset outlet if branch changes
    setBranch: (branch) => {
      update((state) => {
        const newData = {
          ...state.data,
          selectedBranch: branch,
          selectedOutlet: null
          // Reset outlet when branch changes
        };
        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, selectedBranch: true, selectedOutlet: false }
        };
        return { ...newState, errors: {}, isValid: true };
      });
    },
    // Set outlet
    setOutlet: (outlet) => {
      update((state) => {
        const newData = { ...state.data, selectedOutlet: outlet };
        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, selectedOutlet: true }
        };
        return { ...newState, errors: {}, isValid: true };
      });
    },
    // Mark field as touched
    touchField: (field) => {
      update((state) => ({
        ...state,
        touched: { ...state.touched, [field]: true }
      }));
    },
    // Validation is currently disabled as per user request.
    // validateAll: () => {
    //   update(state => {
    //     return { ...state, errors: {}, isValid: true };
    //   });
    // }
    // Set submitting state
    setSubmitting: (isSubmitting) => {
      update((state) => ({ ...state, isSubmitting }));
    },
    // Reset form
    reset: () => {
      set(initialState$2);
    },
    // Get form data for submission
    getFormData: () => {
      let currentState;
      subscribe((state) => currentState = state)();
      return currentState.data;
    }
  };
}
const personalFormStore = createPersonalFormStore();
const personalFormData = derived(personalFormStore, ($store) => $store.data);
derived(personalFormStore, ($store) => $store.errors);
derived(personalFormStore, ($store) => $store.isValid);
derived(personalFormStore, ($store) => $store.isSubmitting);
derived(personalFormStore, ($store) => $store.touched);
const selectedBranch = derived(personalFormStore, ($store) => $store.data.selectedBranch);
const selectedOutlet = derived(personalFormStore, ($store) => $store.data.selectedOutlet);
var StepLabel = /* @__PURE__ */ ((StepLabel2) => {
  StepLabel2["Personal"] = "Personal";
  StepLabel2["Payment"] = "Payment";
  StepLabel2["Summary"] = "Summary";
  StepLabel2["Receipt"] = "Receipt";
  return StepLabel2;
})(StepLabel || {});
const initialSteps = [
  {
    id: 0,
    label: "Personal",
    status: "current",
    isValid: false,
    canNavigate: true
  },
  {
    id: 1,
    label: "Payment",
    status: "pending",
    isValid: false,
    canNavigate: false
  },
  {
    id: 2,
    label: "Summary",
    status: "pending",
    isValid: false,
    canNavigate: false
  },
  {
    id: 3,
    label: "Receipt",
    status: "pending",
    isValid: false,
    canNavigate: false
  }
];
const initialState$1 = {
  currentStepIndex: 0,
  steps: initialSteps,
  isNavigating: false,
  canProceed: false,
  canGoBack: false
};
function createInterfaceStore() {
  const { subscribe, set, update } = writable(initialState$1);
  return {
    subscribe,
    // Navigate to specific step
    goToStep: (stepIndex) => {
      update((state) => {
        if (stepIndex < 0 || stepIndex >= state.steps.length) return state;
        if (!state.steps[stepIndex].canNavigate) return state;
        const newSteps = state.steps.map((step, index) => ({
          ...step,
          status: index < stepIndex ? "completed" : index === stepIndex ? "current" : "pending"
        }));
        return {
          ...state,
          currentStepIndex: stepIndex,
          steps: newSteps,
          canProceed: stepIndex < state.steps.length - 1,
          canGoBack: stepIndex > 0
        };
      });
    },
    // Go to next step
    nextStep: () => {
      update((state) => {
        const nextIndex = state.currentStepIndex + 1;
        if (nextIndex >= state.steps.length) return state;
        if (!state.canProceed) return state;
        const newSteps = state.steps.map((step, index) => ({
          ...step,
          status: index < nextIndex ? "completed" : index === nextIndex ? "current" : "pending",
          canNavigate: index <= nextIndex
        }));
        return {
          ...state,
          currentStepIndex: nextIndex,
          steps: newSteps,
          canProceed: nextIndex < state.steps.length - 1,
          canGoBack: true
        };
      });
    },
    // Go to previous step
    prevStep: () => {
      update((state) => {
        const prevIndex = state.currentStepIndex - 1;
        if (prevIndex < 0) return state;
        const newSteps = state.steps.map((step, index) => ({
          ...step,
          status: index < prevIndex ? "completed" : index === prevIndex ? "current" : "pending"
        }));
        return {
          ...state,
          currentStepIndex: prevIndex,
          steps: newSteps,
          canProceed: true,
          canGoBack: prevIndex > 0
        };
      });
    },
    // Mark current step as valid/invalid
    setStepValid: (stepIndex, isValid) => {
      update((state) => {
        const newSteps = state.steps.map(
          (step, index) => index === stepIndex ? { ...step, isValid } : step
        );
        const currentStep2 = newSteps[state.currentStepIndex];
        const canProceed2 = currentStep2?.isValid && state.currentStepIndex < state.steps.length - 1;
        return {
          ...state,
          steps: newSteps,
          canProceed: canProceed2
        };
      });
    },
    // Set navigation state
    setNavigating: (isNavigating2) => {
      update((state) => ({ ...state, isNavigating: isNavigating2 }));
    },
    // Reset to initial state
    reset: () => {
      set(initialState$1);
    },
    // Get current step data
    getCurrentStep: () => {
      let currentState;
      subscribe((state) => currentState = state)();
      return currentState.steps[currentState.currentStepIndex];
    }
  };
}
const interfaceStore = createInterfaceStore();
const currentStep = derived(
  interfaceStore,
  ($store) => $store.steps[$store.currentStepIndex]
);
const steps = derived(interfaceStore, ($store) => $store.steps);
const currentStepIndex = derived(interfaceStore, ($store) => $store.currentStepIndex);
derived(interfaceStore, ($store) => $store.canProceed);
derived(interfaceStore, ($store) => $store.canGoBack);
derived(interfaceStore, ($store) => $store.isNavigating);
derived(currentStepIndex, ($index) => $index === 0);
derived(
  interfaceStore,
  ($store) => $store.currentStepIndex === $store.steps.length - 1
);
derived(
  steps,
  ($steps) => $steps.filter((step) => step.status === "completed")
);
derived(
  interfaceStore,
  ($store) => ($store.currentStepIndex + 1) / $store.steps.length * 100
);
class InterfaceService2 {
  static instance;
  constructor() {
  }
  static getInstance() {
    if (!InterfaceService2.instance) {
      InterfaceService2.instance = new InterfaceService2();
    }
    return InterfaceService2.instance;
  }
  /**
   * Navigate to a specific step by index
   */
  goToStep(stepIndex) {
    interfaceStore.goToStep(stepIndex);
  }
  /**
   * Navigate to a specific step by label
   */
  goToStepByLabel(label) {
    const stepIndex = this.getStepIndexByLabel(label);
    if (stepIndex !== -1) {
      this.goToStep(stepIndex);
    }
  }
  /**
   * Move to the next step
   */
  nextStep() {
    interfaceStore.nextStep();
  }
  /**
   * Move to the previous step
   */
  prevStep() {
    interfaceStore.prevStep();
  }
  /**
   * Validate and proceed to next step
   */
  async validateAndProceed() {
    const currentStep2 = interfaceStore.getCurrentStep();
    try {
      interfaceStore.setNavigating(true);
      const isValid = await this.validateCurrentStep(currentStep2.label);
      if (isValid) {
        interfaceStore.setStepValid(currentStep2.id, true);
        this.nextStep();
        return true;
      } else {
        interfaceStore.setStepValid(currentStep2.id, false);
        return false;
      }
    } catch (error2) {
      console.error("Error validating step:", error2);
      interfaceStore.setStepValid(currentStep2.id, false);
      return false;
    } finally {
      interfaceStore.setNavigating(false);
    }
  }
  /**
   * Validate current step based on step type
   */
  async validateCurrentStep(stepLabel) {
    switch (stepLabel) {
      case StepLabel.Personal:
        return this.validatePersonalStep();
      case StepLabel.Payment:
        return true;
      case StepLabel.Summary:
        return true;
      case StepLabel.Receipt:
        return true;
      default:
        return false;
    }
  }
  /**
   * Validate personal form step
   */
  validatePersonalStep() {
    console.log("Personal step validation bypassed for UI testing");
    return true;
  }
  /**
   * Get step index by label
   */
  getStepIndexByLabel(label) {
    let stepIndex = -1;
    interfaceStore.subscribe((state) => {
      const step = state.steps.find((s) => s.label === label);
      stepIndex = step ? step.id : -1;
    })();
    return stepIndex;
  }
  /**
   * Mark a step as valid/invalid
   */
  setStepValid(stepIndex, isValid) {
    interfaceStore.setStepValid(stepIndex, isValid);
  }
  /**
   * Reset the interface to initial state
   */
  reset() {
    interfaceStore.reset();
  }
  /**
   * Check if can proceed to next step
   */
  canProceed() {
    let canProceed = false;
    interfaceStore.subscribe((state) => {
      canProceed = state.canProceed;
    })();
    return canProceed;
  }
  /**
   * Check if can go back to previous step
   */
  canGoBack() {
    let canGoBack = false;
    interfaceStore.subscribe((state) => {
      canGoBack = state.canGoBack;
    })();
    return canGoBack;
  }
  /**
   * Get current step information
   */
  getCurrentStep() {
    return interfaceStore.getCurrentStep();
  }
  /**
   * Set navigation loading state
   */
  setNavigating(isNavigating) {
    interfaceStore.setNavigating(isNavigating);
  }
  /**
   * Initialize step validation based on form states
   */
  initializeStepValidation() {
    personalFormStore.subscribe((state) => {
      this.setStepValid(1, state.isValid);
    });
  }
}
const interfaceService = InterfaceService2.getInstance();
class BranchService {
  /**
   * Get selected branch
   */
  static getSelectedBranch() {
    const formData = get(personalFormStore);
    return formData.data.selectedBranch;
  }
  /**
   * Select a branch and reset outlet selection
   */
  static selectBranch(branch) {
    try {
      if (!branch) {
        console.warn("Cannot select branch: branch is required");
        return false;
      }
      if (!branch.available) {
        console.warn(`Cannot select branch: ${branch.name} is not available`);
        return false;
      }
      personalFormStore.setBranch(branch);
      console.log(`Branch selected: ${branch.name}`);
      return true;
    } catch (err) {
      console.error("Error selecting branch:", err);
      return false;
    }
  }
  /**
   * Handle branch selection with validation
   */
  static handleBranchSelection(branch) {
    try {
      if (!branch.available) {
        console.warn(`Branch ${branch.name} is not available for selection`);
        return false;
      }
      const success = this.selectBranch(branch);
      if (success) {
        personalFormStore.touchField("selectedBranch");
      }
      return success;
    } catch (err) {
      console.error("Error handling branch selection:", err);
      return false;
    }
  }
  /**
   * Clear branch selection and reset outlet
   */
  static clearBranchSelection() {
    try {
      personalFormStore.setBranch(null);
      console.log("Branch selection cleared");
    } catch (err) {
      console.error("Error clearing branch selection:", err);
    }
  }
  /**
   * Get branch state snapshot
   */
  static getBranchState() {
    const selectedBranch2 = this.getSelectedBranch();
    return {
      selectedBranch: selectedBranch2,
      isSelected: !!selectedBranch2,
      isAvailable: selectedBranch2?.available ?? false
    };
  }
  /**
   * Validate branch selection
   */
  static validateBranchSelection() {
    try {
      const selectedBranch2 = this.getSelectedBranch();
      if (!selectedBranch2) {
        console.warn("Branch validation failed: no branch selected");
        return false;
      }
      if (!selectedBranch2.available) {
        console.warn("Branch validation failed: selected branch is not available");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating branch selection:", err);
      return false;
    }
  }
  /**
   * Handle keyboard navigation for branch selection
   */
  static handleKeyboardNavigation(event) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.clearBranchSelection();
        return true;
      default:
        return false;
    }
  }
  /**
   * Event handler for branch selection from component
   */
  static handleBranchSelected(event) {
    const branch = event.detail;
    this.handleBranchSelection(branch);
  }
  /**
   * Event handler for branch deselection from component
   */
  static handleBranchDeselected() {
    this.clearBranchSelection();
  }
  /**
   * Callback wrapper for branch selection (adapts callback props to event handlers)
   */
  static handleBranchSelectedCallback(branch) {
    this.handleBranchSelected({ detail: branch });
  }
  /**
   * Callback wrapper for branch deselection (adapts callback props to event handlers)
   */
  static handleBranchDeselectedCallback() {
    this.handleBranchDeselected();
  }
}
({
  getSelectedBranch: BranchService.getSelectedBranch.bind(BranchService),
  selectBranch: BranchService.selectBranch.bind(BranchService),
  handleSelection: BranchService.handleBranchSelection.bind(BranchService),
  clearSelection: BranchService.clearBranchSelection.bind(BranchService)
});
({
  getBranchState: BranchService.getBranchState.bind(BranchService),
  validate: BranchService.validateBranchSelection.bind(BranchService)
});
const branchActionInterface = {
  handleKeyboard: BranchService.handleKeyboardNavigation.bind(BranchService),
  handleBranchSelected: BranchService.handleBranchSelected.bind(BranchService),
  handleBranchDeselected: BranchService.handleBranchDeselected.bind(BranchService),
  handleBranchSelectedCallback: BranchService.handleBranchSelectedCallback.bind(BranchService),
  handleBranchDeselectedCallback: BranchService.handleBranchDeselectedCallback.bind(BranchService)
};
class OutletService {
  /**
   * Get selected outlet
   */
  static getSelectedOutlet() {
    const formData = get(personalFormStore);
    return formData.data.selectedOutlet;
  }
  /**
   * Select an outlet
   */
  static selectOutlet(outlet) {
    try {
      if (!outlet) {
        console.warn("Cannot select outlet: outlet is required");
        return false;
      }
      if (!outlet.available) {
        console.warn(`Cannot select outlet: ${outlet.name} is not available`);
        return false;
      }
      personalFormStore.setOutlet(outlet);
      console.log(`Outlet selected: ${outlet.name}`);
      return true;
    } catch (err) {
      console.error("Error selecting outlet:", err);
      return false;
    }
  }
  /**
   * Handle outlet selection with validation
   */
  static handleOutletSelection(outlet) {
    try {
      if (!outlet.available) {
        console.warn(`Outlet ${outlet.name} is not available for selection`);
        return false;
      }
      const success = this.selectOutlet(outlet);
      if (success) {
        personalFormStore.touchField("selectedOutlet");
      }
      return success;
    } catch (err) {
      console.error("Error handling outlet selection:", err);
      return false;
    }
  }
  /**
   * Clear outlet selection
   */
  static clearOutletSelection() {
    try {
      personalFormStore.setOutlet(null);
      console.log("Outlet selection cleared");
    } catch (err) {
      console.error("Error clearing outlet selection:", err);
    }
  }
  /**
   * Get outlet state snapshot
   */
  static getOutletState() {
    const selectedOutlet2 = this.getSelectedOutlet();
    return {
      selectedOutlet: selectedOutlet2,
      isSelected: !!selectedOutlet2,
      isAvailable: selectedOutlet2?.available ?? false
    };
  }
  /**
   * Validate outlet selection
   */
  static validateOutletSelection() {
    try {
      const selectedOutlet2 = this.getSelectedOutlet();
      if (!selectedOutlet2) {
        console.warn("Outlet validation failed: no outlet selected");
        return false;
      }
      if (!selectedOutlet2.available) {
        console.warn("Outlet validation failed: selected outlet is not available");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating outlet selection:", err);
      return false;
    }
  }
  /**
   * Get outlets for selected branch
   */
  static getOutletsForBranch(branchId) {
    try {
      console.log(`Getting outlets for branch: ${branchId}`);
      return [];
    } catch (err) {
      console.error("Error getting outlets for branch:", err);
      return [];
    }
  }
  /**
   * Handle keyboard navigation for outlet selection
   */
  static handleKeyboardNavigation(event) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.clearOutletSelection();
        return true;
      default:
        return false;
    }
  }
  /**
   * Check if outlet is compatible with selected branch
   */
  static isOutletCompatibleWithBranch(outlet, branchId) {
    try {
      return outlet.branchId === branchId;
    } catch (err) {
      console.error("Error checking outlet compatibility:", err);
      return false;
    }
  }
  /**
   * Event handler for outlet selection from component
   */
  static handleOutletSelected(event) {
    const outlet = event.detail;
    this.handleOutletSelection(outlet);
  }
  /**
   * Event handler for outlet deselection from component
   */
  static handleOutletDeselected() {
    this.clearOutletSelection();
  }
  /**
   * Callback wrapper for outlet selection (adapts callback props to event handlers)
   */
  static handleOutletSelectedCallback(outlet) {
    this.handleOutletSelected({ detail: outlet });
  }
  /**
   * Callback wrapper for outlet deselection (adapts callback props to event handlers)
   */
  static handleOutletDeselectedCallback() {
    this.handleOutletDeselected();
  }
}
({
  getSelectedOutlet: OutletService.getSelectedOutlet.bind(OutletService),
  selectOutlet: OutletService.selectOutlet.bind(OutletService),
  handleSelection: OutletService.handleOutletSelection.bind(OutletService),
  clearSelection: OutletService.clearOutletSelection.bind(OutletService)
});
({
  getOutletState: OutletService.getOutletState.bind(OutletService),
  validate: OutletService.validateOutletSelection.bind(OutletService),
  getOutletsForBranch: OutletService.getOutletsForBranch.bind(OutletService),
  isCompatibleWithBranch: OutletService.isOutletCompatibleWithBranch.bind(OutletService)
});
({
  handleKeyboard: OutletService.handleKeyboardNavigation.bind(OutletService),
  handleOutletSelected: OutletService.handleOutletSelected.bind(OutletService),
  handleOutletDeselected: OutletService.handleOutletDeselected.bind(OutletService),
  handleOutletSelectedCallback: OutletService.handleOutletSelectedCallback.bind(OutletService),
  handleOutletDeselectedCallback: OutletService.handleOutletDeselectedCallback.bind(OutletService)
});
function BranchOutletSelector($$payload, $$props) {
  push();
  var $$store_subs;
  let onBack = fallback($$props["onBack"], null);
  const { handleBranchSelectedCallback, handleBranchDeselectedCallback } = branchActionInterface;
  $$payload.out.push(`<div class="h-full max-h-[65vh] w-full min-w-0 overflow-y-auto pr-3" role="region" aria-label="Branch and outlet selection">`);
  Index$i($$payload, {
    variant: "elegant",
    size: "full",
    padding: "xl",
    scrollable: true,
    class: "enhanced-scrollbar h-full max-h-[65vh] w-full",
    children: ($$payload2) => {
      if (store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch) !== null) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="w-full">`);
        OutletSelector($$payload2, {
          outlets: OUTLET_DUMMY,
          selectedBranch: store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch),
          selectedOutlet: store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet),
          title: "Pilih Outlet",
          subtitle: store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch) ? `Outlet tersedia di ${store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch).name}` : "Pilih outlet yang sesuai dengan kebutuhan Anda",
          onBack: () => personalFormStore.setBranch(null)
        });
        $$payload2.out.push(`<!----></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<div class="w-full">`);
        BranchSelector($$payload2, {
          branches: BRANCH_DUMMY,
          selectedBranch: store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch),
          onBranchSelected: handleBranchSelectedCallback,
          onBranchDeselected: handleBranchDeselectedCallback,
          onBack
        });
        $$payload2.out.push(`<!----></div>`);
      }
      $$payload2.out.push(`<!--]-->`);
    }
  });
  $$payload.out.push(`<!----></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onBack });
  pop();
}
function Personal($$payload, $$props) {
  push();
  var $$store_subs;
  let customerName = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerName;
  let customerEmail = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerEmail;
  let customerPhone = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerPhone;
  let partySize = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).partySize;
  let specialRequests = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).specialRequests;
  const partySizeOptions = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${i + 1 === 1 ? "person" : "people"}`
  }));
  async function handleSubmit() {
    try {
      console.log("Attempting to validate and proceed...");
      const success = await interfaceService.validateAndProceed();
      if (success) {
        console.log("Successfully navigated to next step");
      } else {
        console.log("Validation failed, staying on current step");
      }
    } catch (error2) {
      console.log("Navigation error:", error2);
    }
  }
  customerName = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerName;
  customerEmail = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerEmail;
  customerPhone = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerPhone;
  partySize = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).partySize;
  specialRequests = store_get($$store_subs ??= {}, "$personalFormData", personalFormData).specialRequests;
  personalFormStore.updateField("customerName", customerName, false);
  personalFormStore.updateField("customerEmail", customerEmail, false);
  personalFormStore.updateField("customerPhone", customerPhone, false);
  personalFormStore.updateField("partySize", partySize, false);
  personalFormStore.updateField("specialRequests", specialRequests, false);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 xl:grid-cols-5"><div class="order-2 min-w-0 lg:order-1 xl:col-span-2">`);
    BranchOutletSelector($$payload2, {});
    $$payload2.out.push(`<!----></div> <div class="order-1 min-w-0 lg:order-2 xl:col-span-3">`);
    Index$i($$payload2, {
      variant: "elegant",
      size: "full",
      padding: "xl",
      scrollable: true,
      class: "col-span-2 h-full max-h-[65vh] w-full",
      children: ($$payload3) => {
        $$payload3.out.push(`<div class="space-y-6 pb-4 pr-3" role="region" aria-label="Personal information form"><h2 class="mb-6 text-xl font-semibold text-white">Personal Information</h2> <div class="space-y-6">`);
        Index$j($$payload3, {
          label: "Full Name",
          type: "text",
          placeholder: "Enter your full name",
          required: true,
          variant: "elegant",
          icon: "fas fa-user",
          get value() {
            return customerName;
          },
          set value($$value) {
            customerName = $$value;
            $$settled = false;
          }
        });
        $$payload3.out.push(`<!----> <div class="grid grid-cols-1 gap-4 md:grid-cols-2">`);
        Index$j($$payload3, {
          label: "Email Address",
          type: "email",
          placeholder: "Enter your email address",
          required: true,
          variant: "elegant",
          icon: "fas fa-envelope",
          get value() {
            return customerEmail;
          },
          set value($$value) {
            customerEmail = $$value;
            $$settled = false;
          }
        });
        $$payload3.out.push(`<!----> `);
        Index$j($$payload3, {
          label: "Phone Number",
          type: "tel",
          placeholder: "Enter your phone number",
          required: true,
          variant: "elegant",
          icon: "fas fa-phone",
          get value() {
            return customerPhone;
          },
          set value($$value) {
            customerPhone = $$value;
            $$settled = false;
          }
        });
        $$payload3.out.push(`<!----></div> `);
        Index$k($$payload3, {
          label: "Party Size",
          options: partySizeOptions,
          placeholder: "Select party size",
          required: true,
          variant: "elegant",
          icon: "fas fa-users",
          get value() {
            return partySize;
          },
          set value($$value) {
            partySize = $$value;
            $$settled = false;
          }
        });
        $$payload3.out.push(`<!----> `);
        Index$a($$payload3, {
          label: "Special Requests (Optional)",
          placeholder: "Any special requests or dietary requirements...",
          rows: 3,
          variant: "elegant",
          maxlength: 500,
          resize: "vertical",
          get value() {
            return specialRequests;
          },
          set value($$value) {
            specialRequests = $$value;
            $$settled = false;
          }
        });
        $$payload3.out.push(`<!----> `);
        Index$g($$payload3, {
          variant: "primary",
          type: "button",
          disabled: false,
          onclick: handleSubmit,
          children: ($$payload4) => {
            $$payload4.out.push(`<!---->Next Step`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----></div></div>`);
      }
    });
    $$payload2.out.push(`<!----></div></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const initialData = {
  selectedMethod: null,
  customerNotes: "",
  agreeToTerms: false,
  promoCode: "",
  totalAmount: 0,
  adminFee: 0,
  finalAmount: 0
};
const initialErrors = {};
const initialTouched = {
  selectedMethod: false,
  customerNotes: false,
  agreeToTerms: false,
  promoCode: false,
  totalAmount: false,
  adminFee: false,
  finalAmount: false
};
const initialState = {
  data: initialData,
  errors: initialErrors,
  isValid: false,
  isSubmitting: false,
  touched: initialTouched
};
function createPaymentFormStore() {
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    // Update specific field
    updateField: (field, value, markAsTouched = true) => {
      update((state) => {
        const newData = { ...state.data, [field]: value };
        if (field === "selectedMethod") {
          const method = value;
          newData.adminFee = method?.fee || 0;
          newData.finalAmount = newData.totalAmount + newData.adminFee;
        }
        const newState = {
          ...state,
          data: newData,
          touched: markAsTouched ? { ...state.touched, [field]: true } : state.touched
        };
        return { ...newState, errors: {}, isValid: validateForm(newData) };
      });
    },
    // Set payment method
    setPaymentMethod: (method) => {
      update((state) => {
        const newData = {
          ...state.data,
          selectedMethod: method,
          adminFee: method?.fee || 0,
          finalAmount: state.data.totalAmount + (method?.fee || 0)
        };
        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, selectedMethod: true }
        };
        return { ...newState, errors: {}, isValid: validateForm(newData) };
      });
    },
    // Set total amount (from reservation details)
    setTotalAmount: (amount) => {
      update((state) => {
        const newData = {
          ...state.data,
          totalAmount: amount,
          finalAmount: amount + state.data.adminFee
        };
        return { ...state, data: newData, isValid: validateForm(newData) };
      });
    },
    // Apply promo code
    applyPromoCode: (code) => {
      update((state) => {
        const newData = { ...state.data, promoCode: code };
        const newState = {
          ...state,
          data: newData,
          touched: { ...state.touched, promoCode: true }
        };
        return { ...newState, errors: {}, isValid: validateForm(newData) };
      });
    },
    // Mark field as touched
    touchField: (field) => {
      update((state) => ({
        ...state,
        touched: { ...state.touched, [field]: true }
      }));
    },
    // Validate form
    validateAll: () => {
      update((state) => {
        const errors = validateFormFields(state.data);
        return {
          ...state,
          errors,
          isValid: Object.keys(errors).length === 0
        };
      });
    },
    // Set submitting state
    setSubmitting: (isSubmitting) => {
      update((state) => ({ ...state, isSubmitting }));
    },
    // Reset form
    reset: () => {
      set(initialState);
    },
    // Get form data for submission
    getFormData: () => {
      let currentState;
      subscribe((state) => currentState = state)();
      return currentState.data;
    }
  };
}
function validateForm(data) {
  return data.selectedMethod !== null && data.agreeToTerms;
}
function validateFormFields(data) {
  const errors = {};
  if (!data.selectedMethod) {
    errors.selectedMethod = "Pilih metode pembayaran";
  }
  if (!data.agreeToTerms) {
    errors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
  }
  return errors;
}
const paymentFormStore = createPaymentFormStore();
const paymentFormData = derived(paymentFormStore, ($store) => $store.data);
const paymentFormErrors = derived(paymentFormStore, ($store) => $store.errors);
const paymentFormIsValid = derived(paymentFormStore, ($store) => $store.isValid);
const paymentFormIsSubmitting = derived(paymentFormStore, ($store) => $store.isSubmitting);
derived(paymentFormStore, ($store) => $store.touched);
const selectedPaymentMethod = derived(paymentFormStore, ($store) => $store.data.selectedMethod);
derived(paymentFormStore, ($store) => $store.data.totalAmount);
const paymentAdminFee = derived(paymentFormStore, ($store) => $store.data.adminFee);
const paymentFinalAmount = derived(paymentFormStore, ($store) => $store.data.finalAmount);
derived(paymentFormStore, ($store) => $store.data.agreeToTerms);
class PaymentService {
  /**
   * Get selected payment method
   */
  static getSelectedPaymentMethod() {
    const formData = get(paymentFormStore);
    return formData.data.selectedMethod;
  }
  /**
   * Get available payment methods
   */
  static async getAvailablePaymentMethods() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return defaultPaymentMethods.filter((method) => method.available);
    } catch (err) {
      console.error("Error getting available payment methods:", err);
      return [];
    }
  }
  /**
   * Select a payment method
   */
  static selectPaymentMethod(method) {
    try {
      if (!method) {
        console.warn("Cannot select payment method: method is required");
        return false;
      }
      if (!method.available) {
        console.warn(`Cannot select payment method: ${method.name} is not available`);
        return false;
      }
      paymentFormStore.setPaymentMethod(method);
      console.log(`Payment method selected: ${method.name}`);
      return true;
    } catch (err) {
      console.error("Error selecting payment method:", err);
      return false;
    }
  }
  /**
   * Handle payment method selection with validation
   */
  static handlePaymentMethodSelection(method) {
    try {
      if (!method.available) {
        console.warn(`Payment method ${method.name} is not available for selection`);
        return false;
      }
      const success = this.selectPaymentMethod(method);
      if (success) {
        paymentFormStore.touchField("selectedMethod");
      }
      return success;
    } catch (err) {
      console.error("Error handling payment method selection:", err);
      return false;
    }
  }
  /**
   * Clear payment method selection
   */
  static clearPaymentMethodSelection() {
    try {
      paymentFormStore.setPaymentMethod(null);
      console.log("Payment method selection cleared");
    } catch (err) {
      console.error("Error clearing payment method selection:", err);
    }
  }
  /**
   * Get payment state snapshot
   */
  static getPaymentState() {
    const selectedMethod = this.getSelectedPaymentMethod();
    const formData = get(paymentFormStore);
    return {
      selectedMethod,
      isSelected: !!selectedMethod,
      isAvailable: selectedMethod?.available ?? false,
      totalAmount: formData.data.totalAmount,
      promoCode: formData.data.promoCode,
      agreeToTerms: formData.data.agreeToTerms
    };
  }
  /**
   * Validate payment method selection
   */
  static validatePaymentMethodSelection() {
    try {
      const selectedMethod = this.getSelectedPaymentMethod();
      if (!selectedMethod) {
        console.warn("Payment method validation failed: no method selected");
        return false;
      }
      if (!selectedMethod.available) {
        console.warn("Payment method validation failed: selected method is not available");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating payment method selection:", err);
      return false;
    }
  }
  /**
   * Validate promo code
   */
  static async validatePromoCode(code) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const validCodes = {
        "WELCOME10": { discount: 10, message: "Selamat datang! Diskon 10%" },
        "SAVE20": { discount: 20, message: "Hemat 20% untuk pemesanan ini" },
        "NEWUSER": { discount: 15, message: "Diskon khusus pengguna baru 15%" }
      };
      const promoData = validCodes[code.toUpperCase()];
      if (promoData) {
        return {
          valid: true,
          discount: promoData.discount,
          message: promoData.message
        };
      }
      return {
        valid: false,
        message: "Kode promo tidak valid atau sudah kadaluarsa"
      };
    } catch (err) {
      console.error("Error validating promo code:", err);
      return {
        valid: false,
        message: "Terjadi kesalahan saat memvalidasi kode promo"
      };
    }
  }
  /**
   * Calculate total amount including fees and discounts
   */
  static calculateTotalAmount(baseAmount, adminFee = 0, discountPercent = 0) {
    try {
      const discountAmount = baseAmount * discountPercent / 100;
      const subtotal = baseAmount - discountAmount;
      return subtotal + adminFee;
    } catch (err) {
      console.error("Error calculating total amount:", err);
      return baseAmount;
    }
  }
  /**
   * Format currency for display
   */
  static formatCurrency(amount) {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (err) {
      console.error("Error formatting currency:", err);
      return `Rp ${amount.toLocaleString()}`;
    }
  }
  /**
   * Process payment
   */
  static async processPayment(paymentData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      const success = Math.random() > 0.1;
      if (success) {
        return {
          success: true,
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          message: "Pembayaran berhasil diproses"
        };
      } else {
        return {
          success: false,
          message: "Pembayaran gagal. Silakan coba lagi atau gunakan metode pembayaran lain."
        };
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      return {
        success: false,
        message: "Terjadi kesalahan saat memproses pembayaran"
      };
    }
  }
  /**
   * Get payment method by ID
   */
  static async getPaymentMethodById(id) {
    try {
      const methods = await this.getAvailablePaymentMethods();
      return methods.find((method) => method.id === id) || null;
    } catch (err) {
      console.error("Error getting payment method by ID:", err);
      return null;
    }
  }
  /**
   * Check if payment method supports installments
   */
  static supportsInstallments(method) {
    try {
      return method.type === "credit_card" && method.available;
    } catch (err) {
      console.error("Error checking installment support:", err);
      return false;
    }
  }
  /**
   * Get estimated processing time for payment method
   */
  static getProcessingTime(method) {
    try {
      return method.processingTime || "Instan";
    } catch (err) {
      console.error("Error getting processing time:", err);
      return "Tidak diketahui";
    }
  }
  /**
   * Validate payment form data
   */
  static validatePaymentData(data) {
    const errors = [];
    try {
      if (!data.selectedMethod) {
        errors.push("Metode pembayaran harus dipilih");
      }
      if (!data.agreeToTerms) {
        errors.push("Anda harus menyetujui syarat dan ketentuan");
      }
      if (data.totalAmount <= 0) {
        errors.push("Total pembayaran tidak valid");
      }
      return {
        valid: errors.length === 0,
        errors
      };
    } catch (err) {
      console.error("Error validating payment data:", err);
      return {
        valid: false,
        errors: ["Terjadi kesalahan saat memvalidasi data pembayaran"]
      };
    }
  }
  /**
   * Handle keyboard navigation for payment method selection
   */
  static handleKeyboardNavigation(event) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.clearPaymentMethodSelection();
        return true;
      default:
        return false;
    }
  }
  /**
   * Event handler for payment method selection from component
   */
  static handlePaymentMethodSelected(event) {
    const method = event.detail;
    this.handlePaymentMethodSelection(method);
  }
  /**
   * Event handler for payment method deselection from component
   */
  static handlePaymentMethodDeselected() {
    this.clearPaymentMethodSelection();
  }
  /**
   * Callback wrapper for payment method selection (adapts callback props to event handlers)
   */
  static handlePaymentMethodSelectedCallback(method) {
    this.handlePaymentMethodSelected({ detail: method });
  }
  /**
   * Callback wrapper for payment method deselection (adapts callback props to event handlers)
   */
  static handlePaymentMethodDeselectedCallback() {
    this.handlePaymentMethodDeselected();
  }
  /**
   * Reset payment form
   */
  static resetPaymentForm() {
    try {
      paymentFormStore.reset();
      console.log("Payment form reset");
    } catch (err) {
      console.error("Error resetting payment form:", err);
    }
  }
}
({
  getSelectedPaymentMethod: PaymentService.getSelectedPaymentMethod.bind(PaymentService),
  selectPaymentMethod: PaymentService.selectPaymentMethod.bind(PaymentService),
  handleSelection: PaymentService.handlePaymentMethodSelection.bind(PaymentService),
  clearSelection: PaymentService.clearPaymentMethodSelection.bind(PaymentService)
});
({
  getPaymentState: PaymentService.getPaymentState.bind(PaymentService),
  validate: PaymentService.validatePaymentMethodSelection.bind(PaymentService),
  getAvailablePaymentMethods: PaymentService.getAvailablePaymentMethods.bind(PaymentService),
  getPaymentMethodById: PaymentService.getPaymentMethodById.bind(PaymentService),
  validatePromoCode: PaymentService.validatePromoCode.bind(PaymentService),
  calculateTotalAmount: PaymentService.calculateTotalAmount.bind(PaymentService),
  formatCurrency: PaymentService.formatCurrency.bind(PaymentService)
});
({
  handleKeyboard: PaymentService.handleKeyboardNavigation.bind(PaymentService),
  handlePaymentMethodSelected: PaymentService.handlePaymentMethodSelected.bind(PaymentService),
  handlePaymentMethodDeselected: PaymentService.handlePaymentMethodDeselected.bind(PaymentService),
  handlePaymentMethodSelectedCallback: PaymentService.handlePaymentMethodSelectedCallback.bind(PaymentService),
  handlePaymentMethodDeselectedCallback: PaymentService.handlePaymentMethodDeselectedCallback.bind(PaymentService),
  processPayment: PaymentService.processPayment.bind(PaymentService),
  validatePaymentData: PaymentService.validatePaymentData.bind(PaymentService),
  resetPaymentForm: PaymentService.resetPaymentForm.bind(PaymentService)
});
function Payment($$payload, $$props) {
  push();
  var $$store_subs;
  let totalAmount = fallback($$props["totalAmount"], 0);
  let disabled = fallback($$props["disabled"], false);
  let showPromoCode = fallback($$props["showPromoCode"], true);
  let showTermsCheckbox = fallback($$props["showTermsCheckbox"], true);
  let showNotes = fallback($$props["showNotes"], true);
  let minHeight = fallback($$props["minHeight"], "auto");
  let height = fallback($$props["height"], "auto");
  let maxHeight = fallback($$props["maxHeight"], "40vh");
  let onPaymentMethodSelected = fallback($$props["onPaymentMethodSelected"], void 0);
  let onValidationChange = fallback($$props["onValidationChange"], void 0);
  let onFormSubmit = fallback($$props["onFormSubmit"], void 0);
  let promoCodeInput = "";
  let promoCodeMessage = "";
  let promoCodeValid = false;
  let isValidatingPromo = false;
  async function handleApplyPromoCode() {
    if (!promoCodeInput.trim()) return;
    isValidatingPromo = true;
    promoCodeMessage = "";
    try {
      const result = await PaymentService.validatePromoCode(promoCodeInput.trim());
      if (result.valid) {
        promoCodeValid = true;
        promoCodeMessage = result.message || "Kode promo berhasil diterapkan";
        paymentFormStore.applyPromoCode(promoCodeInput.trim());
      } else {
        promoCodeValid = false;
        promoCodeMessage = result.message || "Kode promo tidak valid";
      }
    } catch (error2) {
      promoCodeValid = false;
      promoCodeMessage = "Gagal memvalidasi kode promo";
    } finally {
      isValidatingPromo = false;
    }
  }
  function handleSubmit() {
    paymentFormStore.validateAll();
    if (store_get($$store_subs ??= {}, "$paymentFormIsValid", paymentFormIsValid)) {
      onFormSubmit?.();
    }
  }
  {
    if (totalAmount !== store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).totalAmount) {
      paymentFormStore.setTotalAmount(totalAmount);
    }
  }
  {
    onValidationChange?.(store_get($$store_subs ??= {}, "$paymentFormIsValid", paymentFormIsValid));
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 xl:grid-cols-5"><div class="order-2 min-w-0 lg:order-1 xl:col-span-2"><div class="space-y-4">`);
    {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="flex items-center justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div> <span class="ml-3 text-gray-300">Memuat metode pembayaran...</span></div>`);
    }
    $$payload2.out.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$paymentFormErrors", paymentFormErrors).selectedMethod) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="flex items-center gap-2 text-red-400 text-sm">`);
      ExclamationCircleSolid($$payload2, { class: "h-4 w-4" });
      $$payload2.out.push(`<!----> <span>${escape_html(store_get($$store_subs ??= {}, "$paymentFormErrors", paymentFormErrors).selectedMethod)}</span></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--></div></div> <div class="order-1 min-w-0 lg:order-2 xl:col-span-3">`);
    Index$i($$payload2, {
      variant: "elegant",
      size: "full",
      padding: "xl",
      scrollable: true,
      class: "col-span-2 h-full max-h-[65vh] w-full",
      children: ($$payload3) => {
        $$payload3.out.push(`<div class="space-y-6 pb-4 pr-3" role="region" aria-label="Payment details form"><h2 class="mb-6 text-xl font-semibold text-white">Payment Details</h2> <div class="space-y-6">`);
        if (showPromoCode) {
          $$payload3.out.push("<!--[-->");
          $$payload3.out.push(`<div class="space-y-4"><div class="flex items-center gap-2">`);
          TagSolid($$payload3, { class: "h-5 w-5 text-orange-400" });
          $$payload3.out.push(`<!----> <h4 class="text-lg font-semibold text-white">Kode Promo</h4></div> <div class="flex gap-3"><div class="flex-1">`);
          Index$j($$payload3, {
            type: "text",
            placeholder: "Masukkan kode promo",
            disabled: disabled || isValidatingPromo,
            class: "w-full",
            get value() {
              return promoCodeInput;
            },
            set value($$value) {
              promoCodeInput = $$value;
              $$settled = false;
            }
          });
          $$payload3.out.push(`<!----></div> `);
          Index$g($$payload3, {
            variant: "primary",
            size: "md",
            disabled: disabled || !promoCodeInput.trim() || isValidatingPromo,
            onclick: handleApplyPromoCode,
            class: "whitespace-nowrap",
            children: ($$payload4) => {
              if (isValidatingPromo) {
                $$payload4.out.push("<!--[-->");
                $$payload4.out.push(`<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>`);
              } else {
                $$payload4.out.push("<!--[!-->");
              }
              $$payload4.out.push(`<!--]--> Terapkan`);
            },
            $$slots: { default: true }
          });
          $$payload3.out.push(`<!----></div> `);
          if (promoCodeMessage) {
            $$payload3.out.push("<!--[-->");
            $$payload3.out.push(`<div${attr_class(`flex items-center gap-2 text-sm ${stringify(promoCodeValid ? "text-green-400" : "text-red-400")}`)}>`);
            CheckCircleSolid($$payload3, { class: "h-4 w-4" });
            $$payload3.out.push(`<!----> <span>${escape_html(promoCodeMessage)}</span></div>`);
          } else {
            $$payload3.out.push("<!--[!-->");
          }
          $$payload3.out.push(`<!--]--></div>`);
        } else {
          $$payload3.out.push("<!--[!-->");
        }
        $$payload3.out.push(`<!--]--> `);
        if (showNotes) {
          $$payload3.out.push("<!--[-->");
          $$payload3.out.push(`<div class="space-y-4"><h4 class="text-lg font-semibold text-white">Catatan Tambahan</h4> <textarea class="w-full min-h-[100px] p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-vertical" placeholder="Tambahkan catatan khusus untuk pesanan Anda (opsional)"${attr("disabled", disabled, true)}>`);
          const $$body = escape_html(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).customerNotes);
          if ($$body) {
            $$payload3.out.push(`${$$body}`);
          }
          $$payload3.out.push(`</textarea></div>`);
        } else {
          $$payload3.out.push("<!--[!-->");
        }
        $$payload3.out.push(`<!--]--> `);
        if (store_get($$store_subs ??= {}, "$selectedPaymentMethod", selectedPaymentMethod)) {
          $$payload3.out.push("<!--[-->");
          $$payload3.out.push(`<div class="space-y-4"><h4 class="text-lg font-semibold text-white">Ringkasan Pembayaran</h4> <div class="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700"><div class="flex justify-between items-center"><span class="text-gray-300">Subtotal</span> <span class="text-white font-medium">${escape_html(PaymentService.formatCurrency(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).totalAmount))}</span></div> `);
          if (store_get($$store_subs ??= {}, "$paymentAdminFee", paymentAdminFee) > 0) {
            $$payload3.out.push("<!--[-->");
            $$payload3.out.push(`<div class="flex justify-between items-center"><span class="text-gray-300">Biaya Admin (${escape_html(store_get($$store_subs ??= {}, "$selectedPaymentMethod", selectedPaymentMethod).name)})</span> <span class="text-yellow-400 font-medium">${escape_html(PaymentService.formatCurrency(store_get($$store_subs ??= {}, "$paymentAdminFee", paymentAdminFee)))}</span></div>`);
          } else {
            $$payload3.out.push("<!--[!-->");
          }
          $$payload3.out.push(`<!--]--> <div class="border-t border-gray-600 pt-3"><div class="flex justify-between items-center"><span class="text-lg font-semibold text-white">Total Pembayaran</span> <span class="text-xl font-bold text-orange-400">${escape_html(PaymentService.formatCurrency(store_get($$store_subs ??= {}, "$paymentFinalAmount", paymentFinalAmount)))}</span></div></div></div></div>`);
        } else {
          $$payload3.out.push("<!--[!-->");
        }
        $$payload3.out.push(`<!--]--> `);
        if (showTermsCheckbox) {
          $$payload3.out.push("<!--[-->");
          $$payload3.out.push(`<div class="space-y-4"><label class="flex items-start gap-3 cursor-pointer"><input type="checkbox"${attr("checked", store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).agreeToTerms, true)}${attr("disabled", disabled, true)} class="mt-1 h-4 w-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"/> <div class="text-sm text-gray-300">Saya menyetujui <a href="/terms" class="text-orange-400 hover:text-orange-300 underline" target="_blank">syarat dan ketentuan</a> serta <a href="/privacy" class="text-orange-400 hover:text-orange-300 underline" target="_blank">kebijakan privasi</a> yang berlaku.</div></label> `);
          if (store_get($$store_subs ??= {}, "$paymentFormErrors", paymentFormErrors).agreeToTerms) {
            $$payload3.out.push("<!--[-->");
            $$payload3.out.push(`<div class="flex items-center gap-2 text-red-400 text-sm">`);
            ExclamationCircleSolid($$payload3, { class: "h-4 w-4" });
            $$payload3.out.push(`<!----> <span>${escape_html(store_get($$store_subs ??= {}, "$paymentFormErrors", paymentFormErrors).agreeToTerms)}</span></div>`);
          } else {
            $$payload3.out.push("<!--[!-->");
          }
          $$payload3.out.push(`<!--]--></div>`);
        } else {
          $$payload3.out.push("<!--[!-->");
        }
        $$payload3.out.push(`<!--]--> <!---->`);
        slot(
          $$payload3,
          $$props,
          "submit",
          {
            handleSubmit,
            isValid: store_get($$store_subs ??= {}, "$paymentFormIsValid", paymentFormIsValid),
            isSubmitting: store_get($$store_subs ??= {}, "$paymentFormIsSubmitting", paymentFormIsSubmitting)
          },
          () => {
            Index$g($$payload3, {
              variant: "primary",
              size: "lg",
              disabled: disabled || !store_get($$store_subs ??= {}, "$paymentFormIsValid", paymentFormIsValid) || store_get($$store_subs ??= {}, "$paymentFormIsSubmitting", paymentFormIsSubmitting),
              onclick: handleSubmit,
              class: "w-full",
              children: ($$payload4) => {
                if (store_get($$store_subs ??= {}, "$paymentFormIsSubmitting", paymentFormIsSubmitting)) {
                  $$payload4.out.push("<!--[-->");
                  $$payload4.out.push(`<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>`);
                } else {
                  $$payload4.out.push("<!--[!-->");
                }
                $$payload4.out.push(`<!--]--> Lanjutkan Pembayaran`);
              },
              $$slots: { default: true }
            });
          }
        );
        $$payload3.out.push(`<!----></div></div>`);
      }
    });
    $$payload2.out.push(`<!----></div></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    totalAmount,
    disabled,
    showPromoCode,
    showTermsCheckbox,
    showNotes,
    minHeight,
    height,
    maxHeight,
    onPaymentMethodSelected,
    onValidationChange,
    onFormSubmit
  });
  pop();
}
function Summary($$payload, $$props) {
  push();
  var $$store_subs;
  let isComplete;
  let reservationDate = fallback($$props["reservationDate"], "");
  let reservationTime = fallback($$props["reservationTime"], "");
  let disabled = fallback($$props["disabled"], false);
  function getTypeIcon(type) {
    switch (type) {
      case "indoor":
        return HomeSolid;
      case "outdoor":
        return BuildingSolid;
      case "private":
        return UsersSolid;
      default:
        return HomeSolid;
    }
  }
  function getTypeLabel(type) {
    switch (type) {
      case "indoor":
        return "Indoor";
      case "outdoor":
        return "Outdoor";
      case "private":
        return "Private Room";
      default:
        return "Indoor";
    }
  }
  function getPriceRangeColor(priceRange) {
    switch (priceRange) {
      case "Standard":
        return "text-green-400";
      case "Premium":
        return "text-yellow-400";
      case "Luxury":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  }
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  function handleConfirmReservation() {
    if (isComplete && store_get($$store_subs ??= {}, "$paymentFormIsValid", paymentFormIsValid)) ;
  }
  isComplete = store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch) && store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet) && store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerName && store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerEmail && store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerPhone && store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).selectedMethod;
  $$payload.out.push(`<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 xl:grid-cols-5"><div class="order-2 min-w-0 lg:order-1 xl:col-span-2">`);
  Index$i($$payload, {
    variant: "elegant",
    size: "full",
    padding: "xl",
    class: "h-full w-full",
    children: ($$payload2) => {
      $$payload2.out.push(`<div class="space-y-6"><div class="border-b border-gray-700 pb-4 text-center"><h3 class="mb-2 text-2xl font-bold text-white">Review Reservasi</h3> <p class="text-gray-300">Periksa kembali detail reservasi Anda</p></div> <div class="custom-scrollbar max-h-[50vh] space-y-6 overflow-y-auto pr-2" role="region" aria-label="Reservation review"><div class="space-y-3"><div class="flex items-center justify-between"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
      CheckCircleSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
      $$payload2.out.push(`<!----> Cabang</h4> <button class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"${attr("disabled", disabled, true)}>`);
      EditOutline($$payload2, { class: "h-3 w-3" });
      $$payload2.out.push(`<!----> <span class="text-xs">Edit</span></button></div> `);
      if (store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch)) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="rounded-lg border border-gray-700 bg-white/5 p-4"><h5 class="font-semibold text-white">${escape_html(store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch).name)}</h5> <div class="mt-2 flex items-start gap-2 text-gray-300">`);
        MapPinSolid($$payload2, { class: "mt-0.5 h-4 w-4 flex-shrink-0" });
        $$payload2.out.push(`<!----> <span class="text-sm">${escape_html(store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch).address)}</span></div> `);
        if (store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch).phone) {
          $$payload2.out.push("<!--[-->");
          $$payload2.out.push(`<div class="mt-2 flex items-center gap-2 text-gray-300">`);
          PhoneSolid($$payload2, { class: "h-4 w-4 flex-shrink-0" });
          $$payload2.out.push(`<!----> <span class="text-sm">${escape_html(store_get($$store_subs ??= {}, "$selectedBranch", selectedBranch).phone)}</span></div>`);
        } else {
          $$payload2.out.push("<!--[!-->");
        }
        $$payload2.out.push(`<!--]--></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-3"><p class="text-sm text-red-400">Cabang belum dipilih</p></div>`);
      }
      $$payload2.out.push(`<!--]--></div> <div class="space-y-3"><div class="flex items-center justify-between"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
      CheckCircleSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
      $$payload2.out.push(`<!----> Outlet</h4> <button class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"${attr("disabled", disabled, true)}>`);
      EditOutline($$payload2, { class: "h-3 w-3" });
      $$payload2.out.push(`<!----> <span class="text-xs">Edit</span></button></div> `);
      if (store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet)) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="rounded-lg border border-gray-700 bg-white/5 p-4"><div class="flex items-start justify-between"><div class="flex items-center gap-2"><!---->`);
        getTypeIcon(store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet).type)?.($$payload2, { class: "h-5 w-5 flex-shrink-0 text-orange-400" });
        $$payload2.out.push(`<!----> <div><h5 class="font-semibold text-white">${escape_html(store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet).name)}</h5> <p class="text-sm text-gray-400">${escape_html(getTypeLabel(store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet).type))}</p></div></div> `);
        if (store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet).priceRange) {
          $$payload2.out.push("<!--[-->");
          $$payload2.out.push(`<span${attr_class(`rounded-full bg-gray-800 px-2 py-1 text-xs font-medium ${stringify(getPriceRangeColor(store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet).priceRange))}`)}>${escape_html(store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet).priceRange)}</span>`);
        } else {
          $$payload2.out.push("<!--[!-->");
        }
        $$payload2.out.push(`<!--]--></div> <div class="mt-2 flex items-center gap-2 text-gray-300">`);
        UsersSolid($$payload2, { class: "h-4 w-4 flex-shrink-0" });
        $$payload2.out.push(`<!----> <span class="text-sm">Kapasitas: ${escape_html(store_get($$store_subs ??= {}, "$selectedOutlet", selectedOutlet).capacity)} orang</span></div></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-3"><p class="text-sm text-red-400">Outlet belum dipilih</p></div>`);
      }
      $$payload2.out.push(`<!--]--></div> <div class="space-y-3"><div class="flex items-center justify-between"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
      CalendarMonthSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
      $$payload2.out.push(`<!----> Tanggal &amp; Waktu</h4> <button class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"${attr("disabled", disabled, true)}>`);
      EditOutline($$payload2, { class: "h-3 w-3" });
      $$payload2.out.push(`<!----> <span class="text-xs">Edit</span></button></div> <div class="rounded-lg border border-gray-700 bg-white/5 p-4"><div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><div class="flex items-center gap-2">`);
      CalendarMonthSolid($$payload2, { class: "h-4 w-4 flex-shrink-0 text-orange-400" });
      $$payload2.out.push(`<!----> <div><p class="text-xs text-gray-400">Tanggal</p> <p class="text-sm font-medium text-white">${escape_html(reservationDate ? formatDate(reservationDate) : "Belum dipilih")}</p></div></div> <div class="flex items-center gap-2">`);
      ClockSolid($$payload2, { class: "h-4 w-4 flex-shrink-0 text-orange-400" });
      $$payload2.out.push(`<!----> <div><p class="text-xs text-gray-400">Waktu</p> <p class="text-sm font-medium text-white">${escape_html(reservationTime ? formatTime(reservationTime) : "Belum dipilih")}</p></div></div> <div class="flex items-center gap-2 sm:col-span-2">`);
      UsersSolid($$payload2, { class: "h-4 w-4 flex-shrink-0 text-orange-400" });
      $$payload2.out.push(`<!----> <div><p class="text-xs text-gray-400">Jumlah Tamu</p> <p class="text-sm font-medium text-white">${escape_html(store_get($$store_subs ??= {}, "$personalFormData", personalFormData).partySize)} orang</p></div></div></div></div></div> <div class="space-y-3"><div class="flex items-center justify-between"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
      UsersSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
      $$payload2.out.push(`<!----> Informasi Pribadi</h4> <button class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"${attr("disabled", disabled, true)}>`);
      EditOutline($$payload2, { class: "h-3 w-3" });
      $$payload2.out.push(`<!----> <span class="text-xs">Edit</span></button></div> <div class="rounded-lg border border-gray-700 bg-white/5 p-4"><div class="grid grid-cols-1 gap-3"><div><p class="text-xs text-gray-400">Nama Lengkap</p> <p class="text-sm font-medium text-white">${escape_html(store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerName || "Belum diisi")}</p></div> <div><p class="text-xs text-gray-400">Email</p> <p class="text-sm font-medium text-white">${escape_html(store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerEmail || "Belum diisi")}</p></div> <div><p class="text-xs text-gray-400">Nomor Telepon</p> <p class="text-sm font-medium text-white">${escape_html(store_get($$store_subs ??= {}, "$personalFormData", personalFormData).customerPhone || "Belum diisi")}</p></div> `);
      if (store_get($$store_subs ??= {}, "$personalFormData", personalFormData).specialRequests) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div><p class="text-xs text-gray-400">Permintaan Khusus</p> <p class="text-sm font-medium text-white">${escape_html(store_get($$store_subs ??= {}, "$personalFormData", personalFormData).specialRequests)}</p></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--></div></div></div></div></div>`);
    }
  });
  $$payload.out.push(`<!----></div> <div class="order-1 min-w-0 lg:order-2 xl:col-span-3">`);
  Index$i($$payload, {
    variant: "elegant",
    size: "full",
    padding: "xl",
    scrollable: true,
    class: "h-full max-h-[65vh] w-full",
    children: ($$payload2) => {
      $$payload2.out.push(`<div class="space-y-6 pb-4 pr-3" role="region" aria-label="Payment confirmation"><div class="border-b border-gray-700 pb-4 text-center"><h2 class="mb-2 text-2xl font-bold text-white">Konfirmasi Pembayaran</h2> <p class="text-gray-300">Review detail pembayaran dan konfirmasi reservasi</p></div> <div class="space-y-6"><div class="space-y-4"><div class="flex items-center justify-between"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
      CreditCardSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
      $$payload2.out.push(`<!----> Metode Pembayaran</h4> <button class="flex items-center gap-1 text-orange-400 transition-colors hover:text-orange-300"${attr("disabled", disabled, true)}>`);
      EditOutline($$payload2, { class: "h-3 w-3" });
      $$payload2.out.push(`<!----> <span class="text-xs">Edit</span></button></div> `);
      if (store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).selectedMethod) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="rounded-lg border border-gray-700 bg-white/5 p-4"><div class="flex items-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">`);
        CreditCardSolid($$payload2, { class: "h-6 w-6 text-orange-400" });
        $$payload2.out.push(`<!----></div> <div><h5 class="font-semibold text-white">${escape_html(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).selectedMethod.name)}</h5> <p class="text-sm text-gray-400">${escape_html(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).selectedMethod.description)}</p></div></div></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4"><p class="text-sm text-red-400">Metode pembayaran belum dipilih</p></div>`);
      }
      $$payload2.out.push(`<!--]--></div> `);
      if (store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).promoCode) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="space-y-4"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
        TagSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
        $$payload2.out.push(`<!----> Kode Promo</h4> <div class="rounded-lg border border-green-500/30 bg-green-500/10 p-4"><div class="flex items-center gap-3">`);
        CheckCircleSolid($$payload2, { class: "h-5 w-5 text-green-400" });
        $$payload2.out.push(`<!----> <div><p class="font-semibold text-green-400">${escape_html(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).promoCode)}</p> <p class="text-sm text-green-300">Kode promo berhasil diterapkan</p></div></div></div></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).customerNotes) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="space-y-4"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
        FileLinesSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
        $$payload2.out.push(`<!----> Catatan Tambahan</h4> <div class="rounded-lg border border-gray-700 bg-white/5 p-4"><p class="text-sm text-gray-300">${escape_html(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).customerNotes)}</p></div></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--> <div class="space-y-4"><h4 class="flex items-center gap-2 text-lg font-semibold text-white">`);
      CheckCircleSolid($$payload2, { class: "h-5 w-5 text-orange-500" });
      $$payload2.out.push(`<!----> Ringkasan Pembayaran</h4> <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-6"><div class="space-y-4"><div class="flex justify-between items-center"><span class="text-gray-300">Subtotal</span> <span class="text-white font-medium">${escape_html(PaymentService.formatCurrency(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).totalAmount))}</span></div> `);
      if (store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).adminFee > 0) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="flex justify-between items-center"><span class="text-gray-300">Biaya Admin (${escape_html(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).selectedMethod?.name)})</span> <span class="text-yellow-400 font-medium">${escape_html(PaymentService.formatCurrency(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).adminFee))}</span></div>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--> <div class="border-t border-gray-600 pt-4"><div class="flex justify-between items-center"><span class="text-xl font-semibold text-white">Total Pembayaran</span> <span class="text-2xl font-bold text-orange-400">${escape_html(PaymentService.formatCurrency(store_get($$store_subs ??= {}, "$paymentFormData", paymentFormData).finalAmount))}</span></div></div></div></div></div> <div class="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4"><div class="flex items-start gap-3">`);
      CheckCircleSolid($$payload2, { class: "mt-0.5 h-5 w-5 text-blue-400" });
      $$payload2.out.push(`<!----> <div class="text-sm text-blue-300"><p class="font-medium">Syarat dan Ketentuan</p> <p class="mt-1">Anda telah menyetujui syarat dan ketentuan serta kebijakan privasi yang berlaku.</p></div></div></div> `);
      if (isComplete) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-6"><div class="mb-4 flex items-center gap-3">`);
        CheckCircleSolid($$payload2, { class: "h-6 w-6 text-green-500" });
        $$payload2.out.push(`<!----> <h5 class="text-lg font-semibold text-green-400">Siap untuk Konfirmasi</h5></div> <p class="text-sm text-green-300">Semua informasi telah lengkap. Klik tombol di bawah untuk mengkonfirmasi reservasi Anda.</p></div> `);
        Index$g($$payload2, {
          variant: "primary",
          size: "lg",
          disabled: disabled || !store_get($$store_subs ??= {}, "$paymentFormIsValid", paymentFormIsValid) || store_get($$store_subs ??= {}, "$paymentFormIsSubmitting", paymentFormIsSubmitting),
          onclick: handleConfirmReservation,
          class: "w-full",
          children: ($$payload3) => {
            if (store_get($$store_subs ??= {}, "$paymentFormIsSubmitting", paymentFormIsSubmitting)) {
              $$payload3.out.push("<!--[-->");
              $$payload3.out.push(`<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>`);
            } else {
              $$payload3.out.push("<!--[!-->");
            }
            $$payload3.out.push(`<!--]--> `);
            CheckCircleSolid($$payload3, { class: "h-5 w-5 mr-2" });
            $$payload3.out.push(`<!----> Konfirmasi Reservasi`);
          },
          $$slots: { default: true }
        });
        $$payload2.out.push(`<!---->`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<div class="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6"><div class="mb-4 flex items-center gap-3">`);
        EditOutline($$payload2, { class: "h-6 w-6 text-yellow-500" });
        $$payload2.out.push(`<!----> <h5 class="text-lg font-semibold text-yellow-400">Informasi Belum Lengkap</h5></div> <p class="text-sm text-yellow-300">Mohon lengkapi semua informasi yang diperlukan sebelum melanjutkan konfirmasi.</p></div> `);
        Index$g($$payload2, {
          variant: "warning",
          size: "lg",
          disabled: true,
          class: "w-full",
          children: ($$payload3) => {
            EditOutline($$payload3, { class: "h-5 w-5 mr-2" });
            $$payload3.out.push(`<!----> Lengkapi Informasi Terlebih Dahulu`);
          },
          $$slots: { default: true }
        });
        $$payload2.out.push(`<!---->`);
      }
      $$payload2.out.push(`<!--]--></div></div>`);
    }
  });
  $$payload.out.push(`<!----></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { reservationDate, reservationTime, disabled });
  pop();
}
function Index($$payload, $$props) {
  push();
  var $$store_subs;
  let stepperSteps;
  async function handleConfirmReservation() {
    try {
      console.log("Index: Handling confirm reservation...");
      const success = await interfaceService.validateAndProceed();
      if (success) {
        console.log("Index: Successfully moved to next step");
      } else {
        console.log("Index: Failed to move to next step");
      }
    } catch (error2) {
      console.log("Index: Error in confirm reservation:", error2);
    }
  }
  stepperSteps = store_get($$store_subs ??= {}, "$steps", steps).map((step) => ({
    id: step.id.toString(),
    title: step.label,
    completed: step.status === "completed",
    active: step.status === "current",
    disabled: false
  }));
  $$payload.out.push(`<section class="relative min-h-screen overflow-hidden" id="booking">`);
  Dining($$payload);
  $$payload.out.push(`<!----> <div class="relative px-12 mx-auto flex min-h-screen w-full flex-col items-end justify-center"><div class="relative z-20 my-auto flex w-full flex-col gap-8 px-4"><div class="my-auto flex w-full justify-center">`);
  Stepper($$payload, {
    steps: stepperSteps,
    currentStep: store_get($$store_subs ??= {}, "$currentStep", currentStep)?.id || 0,
    variant: "elegant",
    orientation: "horizontal",
    type: "numbered",
    clickable: false,
    showConnector: true
  });
  $$payload.out.push(`<!----></div> `);
  if (store_get($$store_subs ??= {}, "$currentStep", currentStep)?.label === StepLabel.Personal) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="w-full mx-auto h-full">`);
    Personal($$payload);
    $$payload.out.push(`<!----></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (store_get($$store_subs ??= {}, "$currentStep", currentStep)?.label === StepLabel.Payment) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="w-full mx-auto h-full">`);
      Payment($$payload, { totalAmount: 25e4, onFormSubmit: handleConfirmReservation });
      $$payload.out.push(`<!----></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$currentStep", currentStep)?.label === StepLabel.Summary) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="w-full mx-auto h-full">`);
        Summary($$payload, { reservationDate: "2024-01-15", reservationTime: "19:00" });
        $$payload.out.push(`<!----></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$currentStep", currentStep)?.label === StepLabel.Receipt) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="mx-auto max-w-xl text-center"><div class="rounded-lg border border-green-500/30 bg-green-500/10 p-8"><div class="mb-6"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500"><svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div> <h2 class="mb-4 text-3xl font-bold text-green-400">Reservasi Berhasil!</h2> <p class="mb-6 text-green-300">Terima kasih! Reservasi Anda telah berhasil dikonfirmasi. Kami akan mengirimkan
								detail reservasi ke email Anda.</p></div> <div class="space-y-4"><button class="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600">Buat Reservasi Baru</button> <button class="w-full rounded-lg border border-green-500 px-6 py-3 font-semibold text-green-400 transition-colors hover:bg-green-500/10">Cetak Konfirmasi</button></div></div></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
          $$payload.out.push(`<div class="mx-auto max-w-4xl text-center"><h2 class="mb-4 text-3xl font-bold text-white">Welcome to ABSteak Reservation</h2> <p class="mb-8 text-gray-300">Please follow the steps to complete your reservation.</p></div>`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div></div></section>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const anchors = [
  {
    id: "hero",
    name: "Hero",
    component: Index$5
  },
  {
    id: "video-highlight",
    name: "About",
    component: Index$4
  },
  {
    id: "experience",
    name: "Story",
    component: Index$3
  },
  {
    id: "chef",
    name: "Chef",
    component: Index$2
  },
  {
    id: "menu",
    name: "Menu",
    component: Index$1
  },
  {
    id: "booking",
    name: "Reserve",
    component: Index
  }
];
const navigationConfig = {
  // All available sections (user can scroll to all of these)
  allSections: [
    "hero",
    "video-highlight",
    "experience",
    "chef",
    "menu",
    "booking",
    "footer"
  ],
  // Only these sections will appear in indicator
  // Example: showing only 2 sections in indicator
  indicatorSections: [
    "hero",
    "video-highlight",
    "experience",
    "chef",
    "menu",
    "booking"
  ]
};
function getIndicatorSections(allSections) {
  if (!allSections || !Array.isArray(allSections)) {
    return [];
  }
  return allSections.filter(
    (section) => navigationConfig.indicatorSections.includes(section.id)
  );
}
function getAllSections(allSections) {
  if (!allSections || !Array.isArray(allSections)) {
    return [];
  }
  return allSections.filter(
    (section) => navigationConfig.allSections.includes(section.id)
  );
}
const visibility$1 = createStateVisibility(ComponentId.ScrollIndicator, { hideDelay: 1500, initialVisible: false });
const { isDisplay: isDisplay$1 } = visibility$1;
const destroyVisibilityManager$1 = visibility$1.destroy;
function ScrollIndicator($$payload, $$props) {
  push();
  var $$store_subs;
  onDestroy(() => destroyVisibilityManager$1());
  if (store_get($$store_subs ??= {}, "$isDisplay", isDisplay$1)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<nav${attr_class(`fixed bottom-2 left-1/2 z-20 -translate-x-1/2`)}><div class="flex items-center justify-center overflow-hidden"><div class="flex h-14 w-14 animate-pulse items-center justify-center text-lg text-white transition-all duration-300" aria-label="Scroll to next section">`);
    ScrollMouse($$payload, { size: "sm", color: "warning" });
    $$payload.out.push(`<!----></div></div></nav>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const visibility = createStateVisibility(ComponentId.BackToTop, { hideDelay: 1500, initialVisible: false });
const { isDisplay } = visibility;
const destroyVisibilityManager = visibility.destroy;
function BackToTop($$payload, $$props) {
  push();
  var $$store_subs;
  onDestroy(() => destroyVisibilityManager());
  if (store_get($$store_subs ??= {}, "$isDisplay", isDisplay)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<nav class="w-1/8 hover:scale-130 fixed bottom-0 left-1/2 z-20 -translate-x-1/2 transition-all duration-300"><div${attr_class(`flex items-center justify-center overflow-hidden rounded-t-2xl border border-white/20 shadow-lg backdrop-blur-lg border border-b-0 border-yellow-600 hover:bg-yellow-600 group-hover:text-white`)}><button class="w-full h-12 flex items-center text-center justify-center text-lg text-white transition-all duration-300 hover:bg-white/20" title="Back to Top" aria-label="Scroll back to top">`);
    ChevronUpOutline($$payload, { class: "h-6 w-6" });
    $$payload.out.push(`<!----></button></div></nav>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function ChatBotFAB($$payload, $$props) {
  push();
  let open = false;
  let input = "";
  let messages = [{ from: "bot", text: "Hi! How can I help you?" }];
  let activeMenu = "CS";
  function toggleChat() {
    open = !open;
  }
  async function send() {
    if (input.trim()) {
      messages = [...messages, { from: "user", text: input.trim() }];
      const userInput = input;
      input = "";
      setTimeout(
        () => {
          let response = getBotResponse(userInput);
          messages = [...messages, { from: "bot", text: response }];
        },
        700
      );
    }
  }
  function getBotResponse(text) {
    text = text.toLowerCase();
    if (text.includes("hello") || text.includes("hi")) {
      return "Hello there! How can I help you today?";
    } else if (text.includes("menu") || text.includes("food")) {
      return "Our menu features a variety of delicious dishes. Would you like to see our specials?";
    } else if (text.includes("reservation") || text.includes("book") || text.includes("table")) {
      return "You can make a reservation by calling us at (123) 456-7890 or through our website.";
    } else if (text.includes("hour") || text.includes("open")) {
      return "We are open Monday-Friday 11am-10pm, and weekends 10am-11pm.";
    } else if (text.includes("location") || text.includes("address") || text.includes("where")) {
      return "We are located at 123 Delicious Street, Foodville.";
    } else if (text.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "I'm here to help with menu information, reservations, hours, and locations. How can I assist you?";
    }
  }
  $$payload.out.push(`<div class="fixed bottom-6 right-6 z-50 svelte-60gzky">`);
  if (
    // Set up event listeners for escape key and click outside
    // Add event listeners
    // Cleanup function
    !open
  ) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="chat-button-container svelte-60gzky">`);
    Index$g($$payload, {
      variant: "primary",
      circle: true,
      size: "lg",
      className: "shadow-lg hover:scale-110 transition-transform duration-200",
      onclick: toggleChat,
      "aria-label": "Open chat",
      children: ($$payload2) => {
        MessageDotsSolid($$payload2, {});
      },
      $$slots: { default: true }
    });
    $$payload.out.push(`<!----></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (open) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(["CS", "Menu", "Dine In", "Dine Out"]);
    $$payload.out.push(`<div class="chat-dialog w-92 border-primary-200 fixed bottom-4 right-4 z-50 flex h-[35rem] max-w-[95vw] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl svelte-60gzky"><div class="from-primary-600 to-primary-500 relative h-32 overflow-hidden rounded-t-2xl bg-gradient-to-r svelte-60gzky"><div class="absolute inset-0 bg-cover bg-center opacity-30 svelte-60gzky" style="background-image: url('/assets/chat_bot_bg.png')"></div> <div class="relative z-10 flex h-full items-start justify-end px-4 py-3 svelte-60gzky"><a href="#" class="transform transition duration-300 hover:scale-110"><img src="https://ui-avatars.com/api/?name=Samule&amp;background=663618&amp;color=f0e9e9&amp;rounded=true" class="h-12 w-12" alt="" srcset=""/></a></div></div> <div class="bg-primary-50 border-primary-100 border-b px-4 py-3 svelte-60gzky"><div class="grid grid-cols-4 gap-2 svelte-60gzky"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let menuItem = each_array[$$index];
      $$payload.out.push(`<button${attr_class("transform rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 hover:scale-105 svelte-60gzky", void 0, {
        "bg-primary-500": activeMenu === menuItem,
        "text-white": activeMenu === menuItem,
        "bg-white": activeMenu !== menuItem,
        "text-primary-600": activeMenu !== menuItem,
        "shadow-md": activeMenu === menuItem,
        "border": activeMenu !== menuItem,
        "border-primary-200": activeMenu !== menuItem
      })}>${escape_html(menuItem)}</button>`);
    }
    $$payload.out.push(`<!--]--></div></div> `);
    Index$e($$payload, {
      messages,
      containerClass: "flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50 to-white",
      botAvatarConfig: {
        type: "icon",
        icon: "lightning",
        backgroundColor: "bg-gradient-to-br from-primary-500 to-primary-600",
        iconColor: "text-white"
      },
      userMessageClass: "px-4 py-3 rounded-2xl rounded-tr-md mb-1 max-w-[85%] text-sm bg-white text-gray-800 shadow-lg border border-primary-200 backdrop-blur-sm",
      botMessageClass: "px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-primary-400",
      animationDelay: 50,
      animationDuration: 300
    });
    $$payload.out.push(`<!----> <div class="border-primary-100 flex items-center gap-3 rounded-b-2xl border-t bg-white px-4 py-4 shadow-inner svelte-60gzky"><input type="text" class="border-primary-300 focus:ring-primary-400 bg-primary-50 placeholder-primary-400 flex-1 rounded-full border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 svelte-60gzky" placeholder="Type your message..."${attr("value", input)}/> `);
    Index$g($$payload, {
      variant: "primary",
      circle: true,
      size: "md",
      className: "bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg",
      onclick: send,
      disabled: !input.trim(),
      "aria-label": "Send",
      children: ($$payload2) => {
        $$payload2.out.push(`<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`);
      },
      $$slots: { default: true }
    });
    $$payload.out.push(`<!----></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  const allSections = anchors.map((anchor) => {
    if (anchor.id === "menu") {
      return { ...anchor, component: Index$1 };
    }
    return anchor;
  });
  const sectionsForScrolling = getAllSections(allSections);
  const sectionsForIndicator = getIndicatorSections(allSections);
  viewportStore.setSections(sectionsForScrolling);
  const indicator = useIndicatorSystem({
    hideDelay: 3e3,
    mouseAreaPercentage: 0.8,
    indicatorAreaRadius: 100
  });
  const { visible: indicatorVisible, startMouseDetector } = indicator;
  modalStore.subscribe((modal) => {
    if (modal.isOpen) {
      viewportStore.disableScroll();
      indicator.hide();
    } else {
      viewportStore.enableScroll();
      indicator.showAndStartTimer();
    }
  });
  (() => {
    const currentSectionId = store_get($$store_subs ??= {}, "$viewportState", viewportState).section.currentSection;
    return sectionsForScrolling.findIndex((s) => s.id === currentSectionId);
  })();
  (() => {
    const currentSectionId = store_get($$store_subs ??= {}, "$viewportState", viewportState).section.currentSection;
    return sectionsForIndicator.findIndex((s) => s.id === currentSectionId);
  })();
  NavBar($$payload);
  $$payload.out.push(`<!----> `);
  Schedule($$payload);
  $$payload.out.push(`<!----> `);
  LanguageSwitcher($$payload);
  $$payload.out.push(`<!----> <!---->`);
  slot($$payload, $$props, "default", {}, null);
  $$payload.out.push(`<!----> `);
  ChatBotFAB($$payload);
  $$payload.out.push(`<!----> `);
  Highlight($$payload);
  $$payload.out.push(`<!---->   `);
  ScrollIndicator($$payload);
  $$payload.out.push(`<!----> `);
  BackToTop($$payload);
  $$payload.out.push(`<!---->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
