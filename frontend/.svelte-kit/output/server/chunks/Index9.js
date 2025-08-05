import { f as fallback, i as store_get, m as ensure_array_like, v as attr, q as attr_style, o as slot, u as unsubscribe_stores, b as bind_props, p as pop, c as push, x as stringify } from "./index2.js";
import { o as onDestroy } from "./index-server.js";
import { w as writable } from "./index7.js";
const globalCarouselState = writable({
  current: 0,
  overlayDark: false
});
const carouselStores = /* @__PURE__ */ new Map();
function createCarouselStore(id) {
  if (!id) {
    return {
      subscribe: globalCarouselState.subscribe,
      setCurrent: (current) => {
        globalCarouselState.update((state) => ({ ...state, current }));
      },
      setOverlayDark: (overlayDark) => {
        globalCarouselState.update((state) => ({ ...state, overlayDark }));
      },
      getState: () => {
        let currentState;
        globalCarouselState.subscribe((state) => currentState = state)();
        return currentState;
      }
    };
  }
  if (!carouselStores.has(id)) {
    carouselStores.set(id, writable({
      current: 0,
      overlayDark: false
    }));
  }
  const store = carouselStores.get(id);
  return {
    subscribe: store.subscribe,
    setCurrent: (current) => {
      store.update((state) => ({ ...state, current }));
    },
    setOverlayDark: (overlayDark) => {
      store.update((state) => ({ ...state, overlayDark }));
    },
    getState: () => {
      let currentState;
      store.subscribe((state) => currentState = state)();
      return currentState;
    }
  };
}
function createCarousel(images, interval = 6e3, id) {
  let timer;
  let callbacks = {};
  const store = createCarouselStore(id);
  function start(callbacksParam = {}) {
    callbacks = callbacksParam;
    timer = setInterval(() => {
      const currentState = store.getState();
      const nextIndex = (currentState.current + 1) % images.length;
      store.setCurrent(nextIndex);
      callbacks.onCurrentChange?.(nextIndex);
    }, interval);
    const initialState = store.getState();
    callbacks.onCurrentChange?.(initialState.current);
  }
  function stop() {
    clearInterval(timer);
  }
  function handleTransitionStart() {
    store.setOverlayDark(true);
    callbacks.onTransitionStart?.();
  }
  function handleTransitionEnd() {
    store.setOverlayDark(false);
    callbacks.onTransitionEnd?.();
  }
  function getState() {
    return store.getState();
  }
  function getCurrentIndex() {
    return store.getState().current;
  }
  function getOverlayState() {
    return store.getState().overlayDark;
  }
  function getStore() {
    return store;
  }
  return {
    start,
    stop,
    handleTransitionStart,
    handleTransitionEnd,
    getState,
    getCurrentIndex,
    getOverlayState,
    getStore
  };
}
function Index($$payload, $$props) {
  push();
  var $$store_subs;
  let current, overlayDark;
  let carouselId = fallback($$props["carouselId"], null);
  let images = $$props["images"];
  let interval = fallback($$props["interval"], 6e3);
  const carousel = createCarousel(images, interval, carouselId);
  const carouselStore = carousel.getStore();
  onDestroy(() => {
    carousel.stop();
  });
  current = store_get($$store_subs ??= {}, "$carouselStore", carouselStore).current;
  overlayDark = store_get($$store_subs ??= {}, "$carouselStore", carouselStore).overlayDark;
  const each_array = ensure_array_like(images);
  $$payload.out.push(`<section class="relative flex h-screen min-h-screen w-full flex-col items-center justify-center overflow-hidden text-center"><!--[-->`);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let img = each_array[i];
    if (i === current) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<img${attr("src", img.url)} alt="Hero" class="absolute inset-0 z-0 h-full w-full object-cover"/> <div class="absolute inset-0 z-10 bg-black backdrop-blur-sm transition-colors duration-500"${attr_style(`opacity: ${stringify(overlayDark ? 0.8 : 0.4)};`)}></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--> <!---->`);
  slot($$payload, $$props, "default", {}, null);
  $$payload.out.push(`<!----></section>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { carouselId, images, interval });
  pop();
}
export {
  Index as I
};
