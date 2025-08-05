import { f as fallback, t as attr_class, w as clsx, v as attr, e as escape_html, x as stringify, b as bind_props, p as pop, c as push, m as ensure_array_like, h as head } from "../../../chunks/index2.js";
import { f as fly, s as scale, b as blur, a as fade, c as slide } from "../../../chunks/index5.js";
import { b as backOut, a as bounceOut, e as elasticOut, q as quintOut } from "../../../chunks/index6.js";
function Index($$payload, $$props) {
  push();
  let toastClasses;
  let message = fallback($$props["message"], "");
  let type = fallback($$props["type"], "info");
  let dismissible = fallback($$props["dismissible"], true);
  let autohide = fallback($$props["autohide"], true);
  let timeout = fallback($$props["timeout"], 3e3);
  let position = fallback($$props["position"], "top-right");
  let size = fallback($$props["size"], "md");
  let variant = fallback($$props["variant"], "elegant");
  let animation = fallback($$props["animation"], "slide");
  let animationDuration = fallback($$props["animationDuration"], 400);
  let animationEasing = fallback($$props["animationEasing"], "quintOut");
  let onclose = fallback($$props["onclose"], void 0);
  let visible = true;
  let id = "";
  if (autohide && timeout > 0) {
    setTimeout(
      () => {
        visible = false;
        onclose?.();
      },
      timeout
    );
  }
  const typeConfig = {
    success: {
      bgColor: "bg-emerald-500/90",
      borderColor: "border-emerald-400",
      textColor: "text-white",
      iconColor: "text-emerald-100",
      glowColor: "shadow-emerald-500/25",
      icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
    },
    error: {
      bgColor: "bg-red-500/90",
      borderColor: "border-red-400",
      textColor: "text-white",
      iconColor: "text-red-100",
      glowColor: "shadow-red-500/25",
      icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
    },
    warning: {
      bgColor: "bg-amber-500/90",
      borderColor: "border-amber-400",
      textColor: "text-white",
      iconColor: "text-amber-100",
      glowColor: "shadow-amber-500/25",
      icon: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
    },
    info: {
      bgColor: "bg-blue-500/90",
      borderColor: "border-blue-400",
      textColor: "text-white",
      iconColor: "text-blue-100",
      glowColor: "shadow-blue-500/25",
      icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
    }
  };
  const sizeConfig = {
    sm: {
      padding: "px-3 py-2",
      iconSize: "w-4 h-4",
      textSize: "text-sm",
      closeSize: "w-6 h-6",
      closeIconSize: "w-3 h-3"
    },
    md: {
      padding: "px-4 py-3",
      iconSize: "w-5 h-5",
      textSize: "text-base",
      closeSize: "w-8 h-8",
      closeIconSize: "w-4 h-4"
    },
    lg: {
      padding: "px-6 py-4",
      iconSize: "w-6 h-6",
      textSize: "text-lg",
      closeSize: "w-10 h-10",
      closeIconSize: "w-5 h-5"
    }
  };
  const positionClasses = {
    "top-left": "fixed top-5 left-5 z-50",
    "top-right": "fixed top-5 right-5 z-50",
    "bottom-left": "fixed bottom-5 left-5 z-50",
    "bottom-right": "fixed bottom-5 right-5 z-50"
  };
  const easingMap = { quintOut, elasticOut, bounceOut, backOut };
  const getAnimationConfig = () => {
    const easing = easingMap[animationEasing];
    const duration = animationDuration;
    switch (animation) {
      case "fly":
        return {
          transition: fly,
          params: {
            y: position.includes("top") ? -50 : 50,
            x: position.includes("left") ? -50 : position.includes("right") ? 50 : 0,
            duration,
            easing
          }
        };
      case "slide":
        return { transition: slide, params: { duration, easing } };
      case "fade":
        return { transition: fade, params: { duration, easing } };
      case "scale":
        return { transition: scale, params: { duration, easing, start: 0.8 } };
      case "blur":
        return { transition: blur, params: { duration, easing, amount: 10 } };
      case "bounce":
        return {
          transition: scale,
          params: { duration: duration * 1.2, easing: bounceOut, start: 0.3 }
        };
      case "elastic":
        return {
          transition: scale,
          params: { duration: duration * 1.5, easing: elasticOut, start: 0.1 }
        };
      case "flip":
        return {
          transition: fly,
          params: { y: position.includes("top") ? -100 : 100, duration, easing }
        };
      default:
        return {
          transition: fly,
          params: { y: position.includes("top") ? -50 : 50, duration, easing }
        };
    }
  };
  toastClasses = [
    "flex items-center gap-3 rounded-xl border backdrop-blur-md",
    "transition-all duration-300 ease-out",
    "shadow-lg",
    typeConfig[type].bgColor,
    typeConfig[type].borderColor,
    typeConfig[type].textColor,
    typeConfig[type].glowColor,
    sizeConfig[size].padding,
    sizeConfig[size].textSize,
    variant === "elegant" ? "elegant-toast" : "",
    variant === "minimal" ? "minimal-toast" : "",
    animation === "flip" ? "transform-gpu" : ""
  ].filter(Boolean).join(" ");
  getAnimationConfig();
  if (visible) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div${attr_class(clsx(positionClasses[position]))}><!---->`);
    {
      if (animation === "slide") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div${attr("id", id)}${attr_class(clsx(toastClasses))} role="alert" aria-live="polite"><div class="flex-shrink-0"><svg${attr_class(`${stringify(sizeConfig[size].iconSize)} ${stringify(typeConfig[type].iconColor)}`)} fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"${attr("d", typeConfig[type].icon)} clip-rule="evenodd"></path></svg></div> <div class="flex-1 font-medium">${escape_html(message)}</div> `);
        if (dismissible) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button type="button"${attr_class(`flex-shrink-0 ${stringify(sizeConfig[size].closeSize)} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50`)} aria-label="Close notification"><svg${attr_class(sizeConfig[size].closeIconSize)} fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg></button>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
        if (animation === "fade") {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div${attr("id", id)}${attr_class(clsx(toastClasses))} role="alert" aria-live="polite"><div class="flex-shrink-0"><svg${attr_class(`${stringify(sizeConfig[size].iconSize)} ${stringify(typeConfig[type].iconColor)}`)} fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"${attr("d", typeConfig[type].icon)} clip-rule="evenodd"></path></svg></div> <div class="flex-1 font-medium">${escape_html(message)}</div> `);
          if (dismissible) {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`<button type="button"${attr_class(`flex-shrink-0 ${stringify(sizeConfig[size].closeSize)} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50`)} aria-label="Close notification"><svg${attr_class(sizeConfig[size].closeIconSize)} fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg></button>`);
          } else {
            $$payload.out.push("<!--[!-->");
          }
          $$payload.out.push(`<!--]--></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
          if (animation === "scale" || animation === "bounce" || animation === "elastic") {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`<div${attr("id", id)}${attr_class(clsx(toastClasses))} role="alert" aria-live="polite"><div class="flex-shrink-0"><svg${attr_class(`${stringify(sizeConfig[size].iconSize)} ${stringify(typeConfig[type].iconColor)}`)} fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"${attr("d", typeConfig[type].icon)} clip-rule="evenodd"></path></svg></div> <div class="flex-1 font-medium">${escape_html(message)}</div> `);
            if (dismissible) {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`<button type="button"${attr_class(`flex-shrink-0 ${stringify(sizeConfig[size].closeSize)} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50`)} aria-label="Close notification"><svg${attr_class(sizeConfig[size].closeIconSize)} fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg></button>`);
            } else {
              $$payload.out.push("<!--[!-->");
            }
            $$payload.out.push(`<!--]--></div>`);
          } else {
            $$payload.out.push("<!--[!-->");
            if (animation === "blur") {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`<div${attr("id", id)}${attr_class(clsx(toastClasses))} role="alert" aria-live="polite"><div class="flex-shrink-0"><svg${attr_class(`${stringify(sizeConfig[size].iconSize)} ${stringify(typeConfig[type].iconColor)}`)} fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"${attr("d", typeConfig[type].icon)} clip-rule="evenodd"></path></svg></div> <div class="flex-1 font-medium">${escape_html(message)}</div> `);
              if (dismissible) {
                $$payload.out.push("<!--[-->");
                $$payload.out.push(`<button type="button"${attr_class(`flex-shrink-0 ${stringify(sizeConfig[size].closeSize)} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50`)} aria-label="Close notification"><svg${attr_class(sizeConfig[size].closeIconSize)} fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg></button>`);
              } else {
                $$payload.out.push("<!--[!-->");
              }
              $$payload.out.push(`<!--]--></div>`);
            } else {
              $$payload.out.push("<!--[!-->");
              $$payload.out.push(`<div${attr("id", id)}${attr_class(clsx(toastClasses))} role="alert" aria-live="polite"><div class="flex-shrink-0"><svg${attr_class(`${stringify(sizeConfig[size].iconSize)} ${stringify(typeConfig[type].iconColor)}`)} fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"${attr("d", typeConfig[type].icon)} clip-rule="evenodd"></path></svg></div> <div class="flex-1 font-medium">${escape_html(message)}</div> `);
              if (dismissible) {
                $$payload.out.push("<!--[-->");
                $$payload.out.push(`<button type="button"${attr_class(`flex-shrink-0 ${stringify(sizeConfig[size].closeSize)} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50`)} aria-label="Close notification"><svg${attr_class(sizeConfig[size].closeIconSize)} fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg></button>`);
              } else {
                $$payload.out.push("<!--[!-->");
              }
              $$payload.out.push(`<!--]--></div>`);
            }
            $$payload.out.push(`<!--]-->`);
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!----></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, {
    message,
    type,
    dismissible,
    autohide,
    timeout,
    position,
    size,
    variant,
    animation,
    animationDuration,
    animationEasing,
    onclose
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  let toasts = [];
  const animations = [
    "fly",
    "slide",
    "fade",
    "scale",
    "blur",
    "bounce",
    "elastic",
    "flip"
  ];
  const types = ["success", "error", "warning", "info"];
  const positions = ["top-right", "top-left", "bottom-right", "bottom-left"];
  const sizes = ["sm", "md", "lg"];
  function removeToast(id) {
    toasts = toasts.filter((toast) => toast.id !== id);
  }
  const each_array = ensure_array_like(animations);
  const each_array_1 = ensure_array_like(types);
  const each_array_2 = ensure_array_like(positions);
  const each_array_3 = ensure_array_like(sizes);
  const each_array_5 = ensure_array_like(toasts);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Toast Animation Demo</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8"><div class="max-w-6xl mx-auto"><div class="text-center mb-12"><h1 class="text-4xl font-bold text-white mb-4">🍞 Toast Animation Demo</h1> <p class="text-gray-300 text-lg">Test berbagai animasi dan konfigurasi Toast component</p></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"><h2 class="text-2xl font-semibold text-white mb-6">🎬 Animations</h2> <div class="grid grid-cols-2 gap-3"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let animation = each_array[$$index];
    $$payload.out.push(`<button class="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all duration-200 border border-blue-400/30 hover:border-blue-400/50">${escape_html(animation)}</button>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"><h2 class="text-2xl font-semibold text-white mb-6">🎨 Types</h2> <div class="grid grid-cols-2 gap-3"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let type = each_array_1[$$index_1];
    $$payload.out.push(`<button class="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-all duration-200 border border-emerald-400/30 hover:border-emerald-400/50">${escape_html(type)}</button>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"><h2 class="text-2xl font-semibold text-white mb-6">📍 Positions</h2> <div class="grid grid-cols-2 gap-3"><!--[-->`);
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let position = each_array_2[$$index_2];
    $$payload.out.push(`<button class="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50">${escape_html(position)}</button>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"><h2 class="text-2xl font-semibold text-white mb-6">📏 Sizes</h2> <div class="grid grid-cols-3 gap-3"><!--[-->`);
  for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
    let size = each_array_3[$$index_3];
    $$payload.out.push(`<button class="px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg transition-all duration-200 border border-amber-400/30 hover:border-amber-400/50">${escape_html(size)}</button>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"><h2 class="text-2xl font-semibold text-white mb-6">🎛️ Controls</h2> <div class="flex flex-wrap gap-4"><button class="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-200 border border-red-400/30 hover:border-red-400/50">Clear All Toasts</button> <button class="px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-lg transition-all duration-200 border border-indigo-400/30 hover:border-indigo-400/50">Random Toast</button></div></div> <div class="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"><h2 class="text-2xl font-semibold text-white mb-4">📊 Active Toasts: ${escape_html(toasts.length)}</h2> `);
  if (toasts.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_4 = ensure_array_like(toasts);
    $$payload.out.push(`<div class="space-y-2"><!--[-->`);
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let toast = each_array_4[$$index_4];
      $$payload.out.push(`<div class="flex items-center justify-between bg-white/5 rounded-lg p-3"><span class="text-gray-300">${escape_html(toast.message)} - ${escape_html(toast.type)} - ${escape_html(toast.animation)} - ${escape_html(toast.position)} - ${escape_html(toast.size)}</span> <button class="text-red-400 hover:text-red-300 transition-colors">✕</button></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<p class="text-gray-400">No active toasts</p>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <!--[-->`);
  for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
    let toast = each_array_5[$$index_5];
    Index($$payload, {
      message: toast.message,
      type: toast.type,
      animation: toast.animation,
      position: toast.position,
      size: toast.size,
      animationDuration: 600,
      animationEasing: "elasticOut",
      autohide: true,
      timeout: 5e3,
      dismissible: true,
      onclose: () => removeToast(toast.id)
    });
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
export {
  _page as default
};
