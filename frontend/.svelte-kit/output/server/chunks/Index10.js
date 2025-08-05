import { c as push, g as getContext, a as spread_attributes, w as clsx, A as clsx$1, v as attr, e as escape_html, p as pop, B as element, s as sanitize_props, r as rest_props, f as fallback, C as spread_props, b as bind_props, o as slot } from "./index2.js";
import { t as twMerge } from "./CheckCircleSolid.js";
import { b as button } from "./Index.svelte_svelte_type_style_lang.js";
import { g as getTheme } from "./themeUtils.js";
function ExclamationCircleSolid($$payload, $$props) {
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
    ariaLabel = "exclamation circle solid",
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
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function Button($$payload, $$props) {
  push();
  const group = getContext("group");
  const ctxDisabled = getContext("disabled");
  let {
    children,
    pill,
    outline = false,
    size = "md",
    color,
    shadow = false,
    tag = "button",
    disabled,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const theme = getTheme("button");
  let actualSize = group ? "sm" : size;
  let actualColor = color ?? (group ? outline ? "dark" : "alternative" : "primary");
  let isDisabled = Boolean(ctxDisabled) || Boolean(disabled);
  const { base, outline: outline_, shadow: shadow_ } = button({
    color: actualColor,
    size: actualSize,
    disabled: isDisabled,
    pill,
    group: !!group
  });
  let btnCls = base({
    class: clsx$1(outline && outline_(), shadow && shadow_(), theme?.base, className)
  });
  if (restProps.href === void 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button${spread_attributes(
      {
        type: "button",
        ...restProps,
        class: clsx(btnCls),
        disabled: isDisabled
      },
      null
    )}>`);
    children?.($$payload);
    $$payload.out.push(`<!----></button>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (restProps.href) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<a${spread_attributes({ ...restProps, class: clsx(btnCls), role: "button" }, null)}>`);
      children?.($$payload);
      $$payload.out.push(`<!----></a>`);
    } else {
      $$payload.out.push("<!--[!-->");
      element(
        $$payload,
        tag,
        () => {
          $$payload.out.push(`${spread_attributes({ ...restProps, class: clsx(btnCls) }, null)}`);
        },
        () => {
          children?.($$payload);
          $$payload.out.push(`<!---->`);
        }
      );
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
function Index($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "variant",
    "type",
    "disabled",
    "className",
    "href",
    "pill",
    "size",
    "circle"
  ]);
  push();
  let resolvedColor, isPill, circleClasses, combinedClassName;
  let variant = fallback($$props["variant"], "primary");
  let type = fallback($$props["type"], "button");
  let disabled = fallback($$props["disabled"], false);
  let className = fallback($$props["className"], "");
  let href = fallback($$props["href"], void 0);
  let pill = fallback($$props["pill"], false);
  let size = fallback($$props["size"], "md");
  let circle = fallback($$props["circle"], false);
  const colorMap = {
    primary: "primary",
    danger: "red",
    success: "green",
    warning: "yellow",
    info: "cyan"
  };
  const circleSizeMap = {
    xs: "w-8 h-8",
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };
  resolvedColor = colorMap[variant];
  isPill = pill || circle;
  circleClasses = circle ? `${circleSizeMap[size]} flex items-center justify-center` : "";
  combinedClassName = `${className} ${circleClasses}`.trim();
  if (href) {
    $$payload.out.push("<!--[-->");
    Button($$payload, spread_props([
      {
        href,
        color: resolvedColor,
        disabled,
        pill: isPill,
        size: circle ? void 0 : size,
        class: combinedClassName
      },
      $$restProps,
      {
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->`);
          slot($$payload2, $$props, "default", {}, null);
          $$payload2.out.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  } else {
    $$payload.out.push("<!--[!-->");
    Button($$payload, spread_props([
      {
        type,
        color: resolvedColor,
        disabled,
        pill: isPill,
        size: circle ? void 0 : size,
        class: combinedClassName
      },
      $$restProps,
      {
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->`);
          slot($$payload2, $$props, "default", {}, null);
          $$payload2.out.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { variant, type, disabled, className, href, pill, size, circle });
  pop();
}
export {
  ExclamationCircleSolid as E,
  Index as I
};
