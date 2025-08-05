import { t as attr_class, e as escape_html, x as stringify, i as store_get, u as unsubscribe_stores, p as pop, c as push, m as ensure_array_like } from "../../../chunks/index2.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import { createAreaBasedStateVisibility, unlockVisibility, isVisibilityLocked, getVisibilityLockedValue } from "../../../chunks/visibility.js";
function SetShowComponentTest($$payload, $$props) {
  push();
  var $$store_subs;
  const visibility = createAreaBasedStateVisibility("test-component", {
    targetArea: "center",
    proximityRadius: 100,
    areaOffset: 0,
    initialVisible: false,
    hideDelay: 1e3
  });
  const {
    isDisplay: isVisible,
    finalVisible,
    showComponent,
    setShowComponent,
    updatePosition
  } = visibility;
  onDestroy(() => {
    visibility.destroy();
  });
  $$payload.out.push(`<div class="p-6 bg-gray-100 min-h-screen"><div class="max-w-2xl mx-auto space-y-6"><div class="bg-white rounded-lg p-6 shadow-lg"><h1 class="text-2xl font-bold text-gray-800 mb-2">setShowComponent Test</h1> <p class="text-gray-600">Test untuk memverifikasi bahwa fungsi <code class="bg-gray-200 px-2 py-1 rounded">setShowComponent</code> bekerja dengan benar.</p></div> <div class="bg-white rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-gray-800 mb-4">Controls</h2> <div class="flex flex-wrap gap-3"><button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">Normal Mode (null)</button> <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">Force Show (true)</button> <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Force Hide (false)</button></div></div> <div class="bg-white rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-gray-800 mb-4">Status</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="bg-gray-50 p-4 rounded-lg"><div class="text-sm font-medium text-gray-600 mb-1">isVisible</div> <div${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$isVisible", isVisible) ? "text-green-600" : "text-red-600")}`)}>${escape_html(store_get($$store_subs ??= {}, "$isVisible", isVisible))}</div></div> <div class="bg-gray-50 p-4 rounded-lg"><div class="text-sm font-medium text-gray-600 mb-1">showComponent</div> <div${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$showComponent", showComponent) === null ? "text-gray-600" : store_get($$store_subs ??= {}, "$showComponent", showComponent) ? "text-green-600" : "text-red-600")}`)}>${escape_html(store_get($$store_subs ??= {}, "$showComponent", showComponent) === null ? "null" : store_get($$store_subs ??= {}, "$showComponent", showComponent))}</div></div> <div class="bg-gray-50 p-4 rounded-lg"><div class="text-sm font-medium text-gray-600 mb-1">finalVisible</div> <div${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$finalVisible", finalVisible) ? "text-green-600" : "text-red-600")}`)}>${escape_html(store_get($$store_subs ??= {}, "$finalVisible", finalVisible))}</div></div></div></div> <div class="bg-white rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-gray-800 mb-4">Test Component</h2> <div class="relative min-h-32 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">`);
  if (store_get($$store_subs ??= {}, "$finalVisible", finalVisible)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"><div class="flex items-center space-x-3"><div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div> <h3 class="text-xl font-bold">Component Visible!</h3></div> <p class="mt-2 text-green-100">Komponen ini ditampilkan berdasarkan nilai <code class="bg-white/20 px-2 py-1 rounded">finalVisible</code>.</p> <div class="mt-4 text-sm text-green-200"><div>isVisible: <span class="font-mono">${escape_html(store_get($$store_subs ??= {}, "$isVisible", isVisible))}</span></div> <div>showComponent: <span class="font-mono">${escape_html(store_get($$store_subs ??= {}, "$showComponent", showComponent))}</span></div> <div>finalVisible: <span class="font-mono">${escape_html(store_get($$store_subs ??= {}, "$finalVisible", finalVisible))}</span></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="flex items-center justify-center h-24 text-gray-500"><div class="text-center"><div class="text-4xl mb-2">👻</div> <div class="text-lg font-medium">Component Hidden</div> <div class="text-sm">finalVisible: ${escape_html(store_get($$store_subs ??= {}, "$finalVisible", finalVisible))}</div></div></div>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-blue-50 border border-blue-200 rounded-lg p-6"><h2 class="text-xl font-semibold text-blue-800 mb-4">Cara Test</h2> <div class="space-y-3 text-blue-700"><div class="flex items-start space-x-2"><div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div> <div><strong>Normal Mode:</strong> Komponen akan muncul/hilang berdasarkan kedekatan mouse dengan area tengah</div></div> <div class="flex items-start space-x-2"><div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div> <div><strong>Force Show:</strong> Komponen akan selalu ditampilkan, mengabaikan posisi mouse</div></div> <div class="flex items-start space-x-2"><div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div> <div><strong>Force Hide:</strong> Komponen akan selalu disembunyikan, mengabaikan posisi mouse</div></div></div></div></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function LockVisibilityDemo($$payload, $$props) {
  push();
  var $$store_subs;
  const headingVisibility = createAreaBasedStateVisibility("heading", {
    targetArea: "top",
    proximityRadius: 100,
    areaOffset: 50,
    initialVisible: false,
    hideDelay: 1e3
  });
  const scrollVisibility = createAreaBasedStateVisibility("scroll", {
    targetArea: "bottom",
    proximityRadius: 100,
    areaOffset: 50,
    initialVisible: false,
    hideDelay: 1e3
  });
  const {
    isDisplay: headingIsVisible,
    showComponent: headingShowComponent,
    setShowComponent: setHeadingShowComponent,
    updatePosition: updateHeadingPosition
  } = headingVisibility;
  const {
    isDisplay: scrollIsVisible,
    showComponent: scrollShowComponent,
    setShowComponent: setScrollShowComponent,
    updatePosition: updateScrollPosition
  } = scrollVisibility;
  let scrollId = 1;
  setHeadingShowComponent(true);
  setScrollShowComponent(null);
  onDestroy(() => {
    headingVisibility.destroy();
    scrollVisibility.destroy();
  });
  {
    unlockVisibility("heading");
  }
  const each_array = ensure_array_like(
    // Set initial showComponent values
    [1, 2, 3, 4, 5]
  );
  $$payload.out.push(`<div class="p-6 bg-gray-100 min-h-screen"><div class="max-w-4xl mx-auto space-y-6"><div class="bg-white rounded-lg p-6 shadow-lg"><h1 class="text-3xl font-bold text-gray-800 mb-2">Lock/Unlock Visibility Demo</h1> <p class="text-gray-600">Demo untuk menguji fitur lock dan unlock visibility. Heading di-set <code class="bg-gray-200 px-2 py-1 rounded">showComponent = true</code>, 
				tapi ketika scroll ID = 3, heading akan di-lock ke <code class="bg-gray-200 px-2 py-1 rounded">false</code>.</p></div> <div class="bg-white rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-gray-800 mb-4">Controls</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">Scroll ID</label> <div class="flex gap-2"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let id = each_array[$$index];
    $$payload.out.push(`<button${attr_class(`px-3 py-2 rounded ${stringify(scrollId === id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700")} hover:opacity-80 transition-colors`)}>${escape_html(id)}</button>`);
  }
  $$payload.out.push(`<!--]--></div> <p class="text-xs text-gray-500 mt-1">Ketika ID = 3, heading akan di-lock ke false</p></div> <div><label class="block text-sm font-medium text-gray-700 mb-2">Manual Controls</label> <div class="flex flex-wrap gap-2"><button class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">Set Heading True</button> <button class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">Set Heading False</button> <button class="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm">Lock Heading True</button> <button class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm">Unlock Heading</button></div></div></div></div> <div class="bg-white rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-gray-800 mb-4">Status</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-blue-50 p-4 rounded-lg"><h3 class="font-semibold text-blue-800 mb-3">Heading Component</h3> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-600">isVisible:</span> <span${attr_class(`font-mono ${stringify(store_get($$store_subs ??= {}, "$headingIsVisible", headingIsVisible) ? "text-green-600" : "text-red-600")}`)}>${escape_html(store_get($$store_subs ??= {}, "$headingIsVisible", headingIsVisible))}</span></div> <div class="flex justify-between"><span class="text-gray-600">showComponent:</span> <span${attr_class(`font-mono ${stringify(store_get($$store_subs ??= {}, "$headingShowComponent", headingShowComponent) === null ? "text-gray-600" : store_get($$store_subs ??= {}, "$headingShowComponent", headingShowComponent) ? "text-green-600" : "text-red-600")}`)}>${escape_html(store_get($$store_subs ??= {}, "$headingShowComponent", headingShowComponent) === null ? "null" : store_get($$store_subs ??= {}, "$headingShowComponent", headingShowComponent))}</span></div> <div class="flex justify-between"><span class="text-gray-600">isLocked:</span> <span${attr_class(`font-mono ${stringify(isVisibilityLocked("heading") ? "text-orange-600" : "text-gray-600")}`)}>${escape_html(isVisibilityLocked("heading"))}</span></div> <div class="flex justify-between"><span class="text-gray-600">lockedValue:</span> <span class="font-mono text-gray-600">${escape_html(getVisibilityLockedValue("heading") === null ? "null" : getVisibilityLockedValue("heading"))}</span></div></div></div> <div class="bg-green-50 p-4 rounded-lg"><h3 class="font-semibold text-green-800 mb-3">Scroll Component</h3> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-600">scrollId:</span> <span class="font-mono text-blue-600">${escape_html(scrollId)}</span></div> <div class="flex justify-between"><span class="text-gray-600">isVisible:</span> <span${attr_class(`font-mono ${stringify(store_get($$store_subs ??= {}, "$scrollIsVisible", scrollIsVisible) ? "text-green-600" : "text-red-600")}`)}>${escape_html(store_get($$store_subs ??= {}, "$scrollIsVisible", scrollIsVisible))}</span></div> <div class="flex justify-between"><span class="text-gray-600">showComponent:</span> <span${attr_class(`font-mono ${stringify(store_get($$store_subs ??= {}, "$scrollShowComponent", scrollShowComponent) === null ? "text-gray-600" : store_get($$store_subs ??= {}, "$scrollShowComponent", scrollShowComponent) ? "text-green-600" : "text-red-600")}`)}>${escape_html(store_get($$store_subs ??= {}, "$scrollShowComponent", scrollShowComponent) === null ? "null" : store_get($$store_subs ??= {}, "$scrollShowComponent", scrollShowComponent))}</span></div> <div class="flex justify-between"><span class="text-gray-600">condition:</span> <span${attr_class(`font-mono ${stringify("text-green-600")}`)}>${escape_html("normal")}</span></div></div></div></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-white rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-gray-800 mb-4">Heading Component</h2> <div class="relative min-h-32 bg-blue-50 rounded-lg p-4 border-2 border-dashed border-blue-300">`);
  if (store_get($$store_subs ??= {}, "$headingShowComponent", headingShowComponent) !== false && store_get($$store_subs ??= {}, "$headingIsVisible", headingIsVisible)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div> <h3 class="text-lg font-bold">Heading Visible!</h3></div> <p class="mt-2 text-blue-100 text-sm">showComponent: ${escape_html(store_get($$store_subs ??= {}, "$headingShowComponent", headingShowComponent) === null ? "null" : store_get($$store_subs ??= {}, "$headingShowComponent", headingShowComponent))}</p> <p class="text-blue-100 text-sm">locked: ${escape_html(isVisibilityLocked("heading") ? "YES" : "NO")}</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="flex items-center justify-center h-24 text-gray-500"><div class="text-center"><div class="text-3xl mb-2">📰</div> <div class="text-sm font-medium">Heading Hidden</div> <div class="text-xs">${escape_html(isVisibilityLocked("heading") ? "LOCKED" : "normal")}</div></div></div>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-white rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-gray-800 mb-4">Scroll Component</h2> <div class="relative min-h-32 bg-green-50 rounded-lg p-4 border-2 border-dashed border-green-300">`);
  if (store_get($$store_subs ??= {}, "$scrollShowComponent", scrollShowComponent) !== false && store_get($$store_subs ??= {}, "$scrollIsVisible", scrollIsVisible)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-lg shadow-lg"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div> <h3 class="text-lg font-bold">Scroll Visible!</h3></div> <p class="mt-2 text-green-100 text-sm">scrollId: ${escape_html(scrollId)}</p> <p class="text-green-100 text-sm">${escape_html("Normal mode")}</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="flex items-center justify-center h-24 text-gray-500"><div class="text-center"><div class="text-3xl mb-2">📜</div> <div class="text-sm font-medium">Scroll Hidden</div> <div class="text-xs">ID: ${escape_html(scrollId)}</div></div></div>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6"><h2 class="text-xl font-semibold text-yellow-800 mb-4">Cara Test</h2> <div class="space-y-3 text-yellow-700"><div class="flex items-start space-x-2"><div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div> <div><strong>Normal Mode:</strong> Heading di-set showComponent = true, jadi akan selalu muncul</div></div> <div class="flex items-start space-x-2"><div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div> <div><strong>Lock Mode (scrollId = 3):</strong> Heading akan di-lock ke false, walaupun showComponent = true</div></div> <div class="flex items-start space-x-2"><div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div> <div><strong>Manual Test:</strong> Gunakan tombol manual untuk test lock/unlock secara langsung</div></div></div></div></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload) {
  $$payload.out.push(`<div class="p-6"><h1 class="text-3xl font-bold mb-6">Demo Pages</h1> <div class="space-y-4"><a href="/demo/paraglide" class="block p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"><div class="font-semibold text-blue-800">Paraglide Demo</div> <div class="text-blue-600 text-sm">Test internationalization features</div></a> <div class="p-4 bg-green-100 rounded-lg"><div class="font-semibold text-green-800 mb-2">setShowComponent Test</div> <div class="text-green-600 text-sm mb-4">Test the setShowComponent functionality</div> `);
  SetShowComponentTest($$payload);
  $$payload.out.push(`<!----></div> <div class="p-4 bg-purple-100 rounded-lg"><div class="font-semibold text-purple-800 mb-2">Lock/Unlock Visibility Demo</div> <div class="text-purple-600 text-sm mb-4">Test lock dan unlock visibility functionality</div> `);
  LockVisibilityDemo($$payload);
  $$payload.out.push(`<!----></div></div></div>`);
}
export {
  _page as default
};
