import { c as push, g as getContext, a as spread_attributes, w as clsx, A as clsx$1, v as attr, e as escape_html, p as pop, f as fallback, t as attr_class, x as stringify, b as bind_props, h as head } from "../../../chunks/index2.js";
import { I as Index, E as ExclamationCircleSolid } from "../../../chunks/Index10.js";
import "../../../chunks/Index.svelte_svelte_type_style_lang.js";
import "../../../chunks/Index.svelte_svelte_type_style_lang2.js";
import "../../../chunks/initialize.js";
import { t as twMerge, C as CheckCircleSolid } from "../../../chunks/CheckCircleSolid.js";
function ArrowDownToBracketOutline($$payload, $$props) {
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
    ariaLabel = "arrow down to bracket outline",
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
  $$payload.out.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"></path></svg>`);
  pop();
}
function CloseCircleSolid($$payload, $$props) {
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
    ariaLabel = "close circle solid",
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
  $$payload.out.push(`<!--]--><path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"></path></svg>`);
  pop();
}
function FileExportOutline($$payload, $$props) {
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
    ariaLabel = "file export outline",
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
  $$payload.out.push(`<!--]--><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"${attr("stroke-width", strokeWidth)} d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"></path></svg>`);
  pop();
}
function Receipt($$payload, $$props) {
  push();
  let config, displayTitle, displayMessage;
  let status = fallback($$props["status"], "success");
  let title = fallback($$props["title"], "");
  let message = fallback($$props["message"], "");
  let reservationId = fallback($$props["reservationId"], "");
  let showActions = fallback($$props["showActions"], true);
  let showDownload = fallback($$props["showDownload"], true);
  let showPrint = fallback($$props["showPrint"], true);
  let showNewReservation = fallback($$props["showNewReservation"], true);
  let onnewreservation = fallback($$props["onnewreservation"], void 0);
  let onprint = fallback($$props["onprint"], void 0);
  let ondownload = fallback($$props["ondownload"], void 0);
  let onexport = fallback($$props["onexport"], void 0);
  let onretry = fallback($$props["onretry"], void 0);
  let oncontactsupport = fallback($$props["oncontactsupport"], void 0);
  const statusConfig = {
    success: {
      icon: CheckCircleSolid,
      iconBg: "bg-green-500",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/10",
      titleColor: "text-green-400",
      messageColor: "text-green-300",
      buttonPrimary: "success",
      buttonSecondary: "success",
      defaultTitle: "Reservasi Berhasil!",
      defaultMessage: "Terima kasih! Reservasi Anda telah berhasil dikonfirmasi. Kami akan mengirimkan detail reservasi ke email Anda."
    },
    warning: {
      icon: ExclamationCircleSolid,
      iconBg: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      bgColor: "bg-yellow-500/10",
      titleColor: "text-yellow-400",
      messageColor: "text-yellow-300",
      buttonPrimary: "warning",
      buttonSecondary: "warning",
      defaultTitle: "Reservasi Tertunda",
      defaultMessage: "Reservasi Anda sedang diproses. Mohon tunggu konfirmasi lebih lanjut melalui email atau telepon."
    },
    failed: {
      icon: CloseCircleSolid,
      iconBg: "bg-red-500",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/10",
      titleColor: "text-red-400",
      messageColor: "text-red-300",
      buttonPrimary: "danger",
      buttonSecondary: "danger",
      defaultTitle: "Reservasi Gagal",
      defaultMessage: "Maaf, terjadi kesalahan dalam memproses reservasi Anda. Silakan coba lagi atau hubungi customer service."
    }
  };
  config = statusConfig[status];
  displayTitle = title || config.defaultTitle;
  displayMessage = message || config.defaultMessage;
  $$payload.out.push(`<div class="mx-auto max-w-xl text-center"><div${attr_class(`rounded-lg border ${stringify(config.borderColor)} ${stringify(config.bgColor)} p-8`)}><div class="mb-6"><div${attr_class(`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${stringify(config.iconBg)}`)}><!---->`);
  config.icon?.($$payload, { class: "h-8 w-8 text-white" });
  $$payload.out.push(`<!----></div> <h2${attr_class(`mb-4 text-3xl font-bold ${stringify(config.titleColor)}`)}>${escape_html(displayTitle)}</h2> <p${attr_class(`mb-6 ${stringify(config.messageColor)}`)}>${escape_html(displayMessage)}</p> `);
  if (reservationId) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="mb-4 rounded-lg bg-black/20 p-3"><p class="text-sm text-gray-300">ID Reservasi</p> <p${attr_class(`font-mono text-lg font-semibold ${stringify(config.titleColor)}`)}>${escape_html(reservationId)}</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> `);
  if (showActions) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="space-y-4"><div class="space-y-3">`);
    if (status === "success") {
      $$payload.out.push("<!--[-->");
      if (showNewReservation) {
        $$payload.out.push("<!--[-->");
        Index($$payload, {
          variant: config.buttonPrimary,
          class: "w-full",
          children: ($$payload2) => {
            $$payload2.out.push(`<!---->Buat Reservasi Baru`);
          },
          $$slots: { default: true }
        });
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (status === "warning") {
        $$payload.out.push("<!--[-->");
        Index($$payload, {
          variant: config.buttonPrimary,
          class: "w-full",
          children: ($$payload2) => {
            $$payload2.out.push(`<!---->Hubungi Customer Service`);
          },
          $$slots: { default: true }
        });
      } else {
        $$payload.out.push("<!--[!-->");
        if (status === "failed") {
          $$payload.out.push("<!--[-->");
          Index($$payload, {
            variant: config.buttonPrimary,
            class: "w-full",
            children: ($$payload2) => {
              $$payload2.out.push(`<!---->Coba Lagi`);
            },
            $$slots: { default: true }
          });
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></div> <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">`);
    if (showPrint) {
      $$payload.out.push("<!--[-->");
      Index($$payload, {
        variant: "info",
        class: "w-full border border-current bg-transparent hover:bg-current/10",
        children: ($$payload2) => {
          FileExportOutline($$payload2, { class: "mr-2 h-4 w-4" });
          $$payload2.out.push(`<!----> Cetak`);
        },
        $$slots: { default: true }
      });
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (showDownload) {
      $$payload.out.push("<!--[-->");
      Index($$payload, {
        variant: "info",
        class: "w-full border border-current bg-transparent hover:bg-current/10",
        children: ($$payload2) => {
          ArrowDownToBracketOutline($$payload2, { class: "mr-2 h-4 w-4" });
          $$payload2.out.push(`<!----> Unduh`);
        },
        $$slots: { default: true }
      });
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> `);
    if (status === "failed") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="pt-2">`);
      Index($$payload, {
        variant: "info",
        class: "w-full border border-current bg-transparent hover:bg-current/10",
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->Hubungi Customer Service`);
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (status === "warning" && showNewReservation) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="pt-2">`);
      Index($$payload, {
        variant: "info",
        class: "w-full border border-current bg-transparent hover:bg-current/10",
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->Buat Reservasi Baru`);
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> `);
  if (status === "warning") {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="mt-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-4"><p class="text-sm text-yellow-200"><strong>Catatan:</strong> Proses konfirmasi biasanya memakan waktu 5-10 menit. 
				Jika tidak ada konfirmasi dalam 30 menit, silakan hubungi customer service.</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (status === "failed") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="mt-4 rounded-lg bg-red-500/5 border border-red-500/20 p-4"><p class="text-sm text-red-200"><strong>Bantuan:</strong> Jika masalah terus berlanjut, silakan hubungi customer service 
				di <span class="font-semibold">+62 21 1234 5678</span> atau email <span class="font-semibold">support@absteak.com</span></p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (status === "success") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="mt-4 rounded-lg bg-green-500/5 border border-green-500/20 p-4"><p class="text-sm text-green-200"><strong>Informasi:</strong> Silakan datang 15 menit sebelum waktu reservasi. 
				Tunjukkan ID reservasi atau email konfirmasi kepada staff kami.</p></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, {
    status,
    title,
    message,
    reservationId,
    showActions,
    showDownload,
    showPrint,
    showNewReservation,
    onnewreservation,
    onprint,
    ondownload,
    onexport,
    onretry,
    oncontactsupport
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  let currentStatus = "success";
  function handleNewReservation() {
    console.log("New reservation clicked");
    alert("Navigating to new reservation...");
  }
  function handlePrint() {
    console.log("Print clicked");
  }
  function handleDownload() {
    console.log("Download clicked");
    alert("Downloading receipt...");
  }
  function handleRetry() {
    console.log("Retry clicked");
    alert("Retrying reservation...");
  }
  function handleContactSupport() {
    console.log("Contact support clicked");
    alert("Opening customer service contact...");
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Receipt Component Demo - ABSteak</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8"><div class="mx-auto max-w-4xl"><div class="mb-8 text-center"><h1 class="mb-4 text-4xl font-bold text-white">Receipt Component Demo</h1> <p class="text-gray-300">Demonstrasi komponen Receipt dengan berbagai status</p></div> <div class="mb-8 flex justify-center space-x-4">`);
  Index($$payload, {
    variant: "success",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Success`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Index($$payload, {
    variant: "info",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Warning`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Index($$payload, {
    variant: "info",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Failed`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div> `);
  {
    $$payload.out.push("<!--[-->");
    Receipt($$payload, {
      status: currentStatus,
      reservationId: `RSV-2024-${stringify(Math.random().toString(36).substr(2, 6).toUpperCase())}`,
      onnewreservation: handleNewReservation,
      onprint: handlePrint,
      ondownload: handleDownload,
      onretry: handleRetry,
      oncontactsupport: handleContactSupport
    });
  }
  $$payload.out.push(`<!--]--> <div class="mt-12 rounded-lg bg-gray-800/50 p-6"><h2 class="mb-4 text-2xl font-semibold text-white">Component Features</h2> <div class="grid gap-6 md:grid-cols-3"><div class="rounded-lg bg-green-500/10 border border-green-500/30 p-4"><h3 class="mb-2 font-semibold text-green-400">Success State</h3> <ul class="space-y-1 text-sm text-green-300"><li>• Konfirmasi reservasi berhasil</li> <li>• Tombol buat reservasi baru</li> <li>• Opsi cetak dan unduh</li> <li>• Informasi kedatangan</li></ul></div> <div class="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4"><h3 class="mb-2 font-semibold text-yellow-400">Warning State</h3> <ul class="space-y-1 text-sm text-yellow-300"><li>• Reservasi sedang diproses</li> <li>• Tombol hubungi customer service</li> <li>• Opsi buat reservasi baru</li> <li>• Informasi waktu tunggu</li></ul></div> <div class="rounded-lg bg-red-500/10 border border-red-500/30 p-4"><h3 class="mb-2 font-semibold text-red-400">Failed State</h3> <ul class="space-y-1 text-sm text-red-300"><li>• Reservasi gagal diproses</li> <li>• Tombol coba lagi</li> <li>• Opsi hubungi customer service</li> <li>• Informasi kontak bantuan</li></ul></div></div></div> <div class="mt-8 rounded-lg bg-gray-800/50 p-6"><h2 class="mb-4 text-2xl font-semibold text-white">Available Props</h2> <div class="overflow-x-auto"><table class="w-full text-sm text-gray-300"><thead><tr class="border-b border-gray-600"><th class="py-2 text-left">Prop</th><th class="py-2 text-left">Type</th><th class="py-2 text-left">Default</th><th class="py-2 text-left">Description</th></tr></thead><tbody class="space-y-2"><tr class="border-b border-gray-700"><td class="py-2 font-mono text-blue-400">status</td><td class="py-2">'success' | 'warning' | 'failed'</td><td class="py-2">'success'</td><td class="py-2">Status receipt yang menentukan tampilan dan perilaku</td></tr><tr class="border-b border-gray-700"><td class="py-2 font-mono text-blue-400">title</td><td class="py-2">string</td><td class="py-2">''</td><td class="py-2">Judul custom (opsional, akan menggunakan default jika kosong)</td></tr><tr class="border-b border-gray-700"><td class="py-2 font-mono text-blue-400">message</td><td class="py-2">string</td><td class="py-2">''</td><td class="py-2">Pesan custom (opsional, akan menggunakan default jika kosong)</td></tr><tr class="border-b border-gray-700"><td class="py-2 font-mono text-blue-400">reservationId</td><td class="py-2">string</td><td class="py-2">''</td><td class="py-2">ID reservasi yang akan ditampilkan</td></tr><tr class="border-b border-gray-700"><td class="py-2 font-mono text-blue-400">showActions</td><td class="py-2">boolean</td><td class="py-2">true</td><td class="py-2">Menampilkan atau menyembunyikan tombol aksi</td></tr><tr class="border-b border-gray-700"><td class="py-2 font-mono text-blue-400">showDownload</td><td class="py-2">boolean</td><td class="py-2">true</td><td class="py-2">Menampilkan tombol unduh</td></tr><tr class="border-b border-gray-700"><td class="py-2 font-mono text-blue-400">showPrint</td><td class="py-2">boolean</td><td class="py-2">true</td><td class="py-2">Menampilkan tombol cetak</td></tr><tr><td class="py-2 font-mono text-blue-400">showNewReservation</td><td class="py-2">boolean</td><td class="py-2">true</td><td class="py-2">Menampilkan tombol buat reservasi baru</td></tr></tbody></table></div></div> <div class="mt-8 rounded-lg bg-gray-800/50 p-6"><h2 class="mb-4 text-2xl font-semibold text-white">Available Event Callbacks (Svelte 5)</h2> <div class="grid gap-4 md:grid-cols-2"><div><h3 class="mb-2 font-semibold text-gray-200">User Actions</h3> <ul class="space-y-1 text-sm text-gray-300"><li><code class="text-blue-400">onnewreservation</code> - Buat reservasi baru</li> <li><code class="text-blue-400">onprint</code> - Cetak receipt</li> <li><code class="text-blue-400">ondownload</code> - Unduh receipt</li> <li><code class="text-blue-400">onretry</code> - Coba lagi (failed state)</li></ul></div> <div><h3 class="mb-2 font-semibold text-gray-200">Support Actions</h3> <ul class="space-y-1 text-sm text-gray-300"><li><code class="text-blue-400">oncontactsupport</code> - Hubungi customer service</li> <li><code class="text-blue-400">onexport</code> - Export receipt (dengan format)</li></ul></div></div></div></div></div>`);
  pop();
}
export {
  _page as default
};
