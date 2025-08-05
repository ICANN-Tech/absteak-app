import { L as Logo } from "../../../chunks/Logo.js";
import { s as sanitize_props, r as rest_props, f as fallback, a as spread_attributes, b as bind_props, p as pop, c as push } from "../../../chunks/index2.js";
function MapMarker($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className"]);
  push();
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  }[size];
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass} ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"></path></svg>`);
  bind_props($$props, { size, className });
  pop();
}
function Instagram($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className"]);
  push();
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  }[size];
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass} ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}><path fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"></path></svg>`);
  bind_props($$props, { size, className });
  pop();
}
function Facebook($$payload, $$props) {
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
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass}  ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}><path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"></path></svg>`);
  bind_props($$props, { size, color, className });
  pop();
}
function Twitter($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className"]);
  push();
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  }[size];
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass} ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}><path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.310l-4.934-6.89Z"></path></svg>`);
  bind_props($$props, { size, className });
  pop();
}
function Youtube($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className"]);
  push();
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  }[size];
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass} ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}><path fill-rule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clip-rule="evenodd"></path></svg>`);
  bind_props($$props, { size, className });
  pop();
}
function Telephone($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className"]);
  push();
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  }[size];
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass} ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"></path></svg>`);
  bind_props($$props, { size, className });
  pop();
}
function Email($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["size", "className"]);
  push();
  let size = fallback($$props["size"], "md");
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  }[size];
  let className = fallback($$props["className"], "");
  $$payload.out.push(`<svg${spread_attributes(
    {
      class: `${sizeClass} ${className}`,
      ...$$restProps,
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24"
    },
    null,
    void 0,
    void 0,
    3
  )}><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"></path></svg>`);
  bind_props($$props, { size, className });
  pop();
}
function _page($$payload) {
  $$payload.out.push(`<div class="p-8 space-y-8"><h1 class="text-3xl font-bold text-center mb-8">Icon Components Demo</h1> <div class="grid grid-cols-2 md:grid-cols-4 gap-8"><div class="flex flex-col items-center space-y-2">`);
  Logo($$payload, { size: "lg", className: "text-blue-600" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">Logo</span></div> <div class="flex flex-col items-center space-y-2">`);
  MapMarker($$payload, { size: "lg", className: "text-red-600" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">Map Marker</span></div> <div class="flex flex-col items-center space-y-2">`);
  Instagram($$payload, { size: "lg", className: "text-pink-600" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">Instagram</span></div> <div class="flex flex-col items-center space-y-2">`);
  Facebook($$payload, { size: "lg", className: "text-blue-700" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">Facebook</span></div> <div class="flex flex-col items-center space-y-2">`);
  Twitter($$payload, { size: "lg", className: "text-black" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">Twitter/X</span></div> <div class="flex flex-col items-center space-y-2">`);
  Youtube($$payload, { size: "lg", className: "text-red-600" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">YouTube</span></div> <div class="flex flex-col items-center space-y-2">`);
  Telephone($$payload, { size: "lg", className: "text-green-600" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">Telephone</span></div> <div class="flex flex-col items-center space-y-2">`);
  Email($$payload, { size: "lg", className: "text-gray-600" });
  $$payload.out.push(`<!----> <span class="text-sm font-medium">Email</span></div></div> <div class="mt-12"><h2 class="text-2xl font-bold mb-4">Size Variations</h2> <div class="flex items-center space-x-4"><div class="flex flex-col items-center space-y-2">`);
  MapMarker($$payload, { size: "sm", className: "text-red-600" });
  $$payload.out.push(`<!----> <span class="text-xs">Small</span></div> <div class="flex flex-col items-center space-y-2">`);
  MapMarker($$payload, { size: "md", className: "text-red-600" });
  $$payload.out.push(`<!----> <span class="text-xs">Medium</span></div> <div class="flex flex-col items-center space-y-2">`);
  MapMarker($$payload, { size: "lg", className: "text-red-600" });
  $$payload.out.push(`<!----> <span class="text-xs">Large</span></div> <div class="flex flex-col items-center space-y-2">`);
  MapMarker($$payload, { size: "xl", className: "text-red-600" });
  $$payload.out.push(`<!----> <span class="text-xs">XL</span></div> <div class="flex flex-col items-center space-y-2">`);
  MapMarker($$payload, { size: "2xl", className: "text-red-600" });
  $$payload.out.push(`<!----> <span class="text-xs">2XL</span></div></div></div></div>`);
}
export {
  _page as default
};
