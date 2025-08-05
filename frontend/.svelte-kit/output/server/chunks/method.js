import { c as push, g as getContext, a as spread_attributes, w as clsx, A as clsx$1, v as attr, e as escape_html, p as pop, t as attr_class } from "./index2.js";
import { U as UI_TRANSITIONS } from "./base2.js";
import "./Index.svelte_svelte_type_style_lang2.js";
import { t as twMerge } from "./CheckCircleSolid.js";
function BuildingSolid($$payload, $$props) {
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
    ariaLabel = "building solid",
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
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M4 4a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2v14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2V5a1 1 0 0 1-1-1Zm5 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Zm-5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Zm-3 4a2 2 0 0 0-2 2v3h2v-3h2v3h2v-3a2 2 0 0 0-2-2h-2Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function CashSolid($$payload, $$props) {
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
    ariaLabel = "cash solid",
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
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M7 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M2 11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd"></path><path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`);
  pop();
}
function CreditCardSolid($$payload, $$props) {
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
    ariaLabel = "credit card solid",
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
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm0 6h16v6H4v-6Z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M5 14a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm5 0a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function WalletSolid($$payload, $$props) {
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
    ariaLabel = "wallet solid",
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
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function Index($$payload, $$props) {
  push();
  let {
    children,
    variant = "liquid",
    size = "md",
    padding = "lg",
    shadow = true,
    rounded = "2xl",
    border = true,
    backdrop = true,
    scrollable = false,
    class: className = ""
  } = $$props;
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "w-full"
  };
  const paddingClasses = { none: "p-0", sm: "p-4", md: "p-6", lg: "p-8", xl: "p-10" };
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full"
  };
  const containerClasses = [
    // Base container styles
    "relative",
    scrollable ? "overflow-y-auto" : "overflow-hidden",
    roundedClasses[rounded],
    paddingClasses[padding],
    sizeClasses[size],
    // Scrollable styles
    scrollable && "enhanced-scrollbar",
    scrollable && variant === "elegant" && "elegant-variant",
    // Variant-specific styles
    variant === "elegant" && "bg-black/10",
    variant === "default" && "bg-white",
    variant === "minimal" && "bg-primary-700/20",
    variant === "liquid" && "bg-white/[0.08]",
    // Backdrop blur - enhanced for liquid variant
    backdrop && variant === "liquid" && "backdrop-blur-xl backdrop-saturate-150",
    backdrop && variant !== "liquid" && "backdrop-blur-md",
    // Border - enhanced for liquid variant
    border && variant === "elegant" && "border border-white/20",
    border && variant === "default" && "border border-gray-300",
    border && variant === "minimal" && "border border-primary-600",
    border && variant === "liquid" && "border border-white/[0.15]",
    // Shadow - enhanced for liquid variant
    shadow && variant === "liquid" && "shadow-2xl shadow-black/10",
    shadow && variant !== "liquid" && "shadow-2xl",
    // Transitions - enhanced for liquid variant
    variant === "liquid" && "transition-all duration-500 ease-out hover:bg-white/[0.12] hover:border-white/[0.25] hover:shadow-3xl hover:shadow-black/20",
    variant !== "liquid" && UI_TRANSITIONS.base,
    // Custom classes
    className
  ].filter(Boolean).join(" ");
  $$payload.out.push(`<div${attr_class(clsx(containerClasses), "svelte-1c94tl3")}>`);
  if (variant === "liquid") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="absolute inset-0 -z-10 svelte-1c94tl3"><div class="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 rounded-full blur-xl animate-pulse svelte-1c94tl3" style="animation-duration: 4s; animation-delay: 0s;"></div> <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-cyan-400/25 via-blue-400/15 to-indigo-400/25 rounded-full blur-lg animate-pulse svelte-1c94tl3" style="animation-duration: 6s; animation-delay: 2s;"></div> <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-violet-400/20 via-fuchsia-400/15 to-pink-400/20 rounded-full blur-md animate-pulse svelte-1c94tl3" style="animation-duration: 8s; animation-delay: 4s;"></div> <div class="absolute top-1/4 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce svelte-1c94tl3" style="animation-duration: 3s; animation-delay: 1s;"></div> <div class="absolute bottom-1/4 left-1/4 w-1 h-1 bg-blue-300/50 rounded-full animate-bounce svelte-1c94tl3" style="animation-duration: 4s; animation-delay: 2.5s;"></div></div> <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] pointer-events-none svelte-1c94tl3"></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="relative z-10 svelte-1c94tl3">`);
  children($$payload);
  $$payload.out.push(`<!----></div></div>`);
  pop();
}
function getMethodIcon(method) {
  switch (method.type) {
    case "credit_card":
    case "debit_card":
      return CreditCardSolid;
    case "e_wallet":
      return WalletSolid;
    case "bank_transfer":
      return BuildingSolid;
    case "cash":
      return CashSolid;
    default:
      return CreditCardSolid;
  }
}
function getMethodClasses(method, isSelected, disabled = false) {
  const baseClasses = "relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group";
  if (!method.available) {
    return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
  }
  if (disabled) {
    return `${baseClasses} border-gray-600 bg-gray-800/50 opacity-50 cursor-not-allowed`;
  }
  if (isSelected) {
    return `${baseClasses} border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-[1.02]`;
  }
  return `${baseClasses} border-gray-700 bg-white/5 hover:border-orange-400 hover:bg-orange-400/5 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-400/10`;
}
function formatFee(fee) {
  if (!fee || fee === 0) return "Gratis";
  return `Rp ${fee.toLocaleString("id-ID")}`;
}
function getTypeLabel(type) {
  switch (type) {
    case "credit_card":
      return "Kartu Kredit";
    case "debit_card":
      return "Kartu Debit";
    case "e_wallet":
      return "E-Wallet";
    case "bank_transfer":
      return "Transfer Bank";
    case "cash":
      return "Tunai";
    default:
      return "Lainnya";
  }
}
function groupMethodsByType(methods) {
  return methods.reduce((acc, method) => {
    if (!acc[method.type]) {
      acc[method.type] = [];
    }
    acc[method.type].push(method);
    return acc;
  }, {});
}
function isMethodSelected(method, selectedMethod) {
  return selectedMethod?.id === method.id;
}
const defaultPaymentMethods = [
  {
    id: "credit-visa",
    name: "Visa Credit Card",
    type: "credit_card",
    icon: "visa",
    description: "Pembayaran dengan kartu kredit Visa",
    fee: 0,
    available: true,
    processingTime: "Instant"
  },
  {
    id: "credit-mastercard",
    name: "Mastercard",
    type: "credit_card",
    icon: "mastercard",
    description: "Pembayaran dengan kartu kredit Mastercard",
    fee: 0,
    available: true,
    processingTime: "Instant"
  },
  {
    id: "debit-bca",
    name: "BCA Debit",
    type: "debit_card",
    icon: "bca",
    description: "Pembayaran dengan kartu debit BCA",
    fee: 2500,
    available: true,
    processingTime: "Instant"
  },
  {
    id: "ewallet-gopay",
    name: "GoPay",
    type: "e_wallet",
    icon: "gopay",
    description: "Pembayaran dengan GoPay e-wallet",
    fee: 0,
    available: true,
    processingTime: "Instant"
  },
  {
    id: "ewallet-ovo",
    name: "OVO",
    type: "e_wallet",
    icon: "ovo",
    description: "Pembayaran dengan OVO e-wallet",
    fee: 0,
    available: true,
    processingTime: "Instant"
  },
  {
    id: "ewallet-dana",
    name: "DANA",
    type: "e_wallet",
    icon: "dana",
    description: "Pembayaran dengan DANA e-wallet",
    fee: 0,
    available: true,
    processingTime: "Instant"
  },
  {
    id: "bank-bca",
    name: "Bank Transfer BCA",
    type: "bank_transfer",
    icon: "bca",
    description: "Transfer bank melalui BCA",
    fee: 6500,
    available: true,
    processingTime: "1-3 menit"
  },
  {
    id: "bank-mandiri",
    name: "Bank Transfer Mandiri",
    type: "bank_transfer",
    icon: "mandiri",
    description: "Transfer bank melalui Mandiri",
    fee: 6500,
    available: true,
    processingTime: "1-3 menit"
  },
  {
    id: "cash-payment",
    name: "Bayar di Tempat",
    type: "cash",
    icon: "cash",
    description: "Pembayaran tunai di restoran",
    fee: 0,
    available: true,
    processingTime: "Saat kedatangan"
  }
];
export {
  BuildingSolid as B,
  CreditCardSolid as C,
  Index as I,
  getMethodIcon as a,
  getMethodClasses as b,
  getTypeLabel as c,
  defaultPaymentMethods as d,
  formatFee as f,
  groupMethodsByType as g,
  isMethodSelected as i
};
