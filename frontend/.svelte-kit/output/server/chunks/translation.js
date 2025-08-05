import { w as writable, d as derived } from "./index7.js";
import { L as Locale } from "./locale.js";
const defaultLocale = {
  current: Locale.Id,
  available: [Locale.Id, Locale.En, Locale.Ja]
};
function getInitialLocale() {
  return defaultLocale;
}
const localeStore = writable(getInitialLocale());
const __variableDynamicImportRuntimeHelper = (glob$1, path$13, segs) => {
  const v = glob$1[path$13];
  if (v) return typeof v === "function" ? v() : Promise.resolve(v);
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + path$13 + (path$13.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : ""))));
  });
};
function interpolateVariables(text, variables) {
  if (!variables || typeof text !== "string") {
    return text;
  }
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    return value !== void 0 ? String(value) : match;
  });
}
const translationCache = /* @__PURE__ */ new Map();
async function loadTranslations(locale, namespace = "common") {
  const cacheKey = `${locale}-${namespace}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  try {
    const translations2 = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../lang/en/common.json": () => import("./common.js"), "../lang/en/footer.json": () => import("./footer2.js"), "../lang/id/common.json": () => import("./common2.js"), "../lang/id/footer.json": () => import("./footer3.js"), "../lang/ja/common.json": () => import("./common3.js"), "../lang/ja/footer.json": () => import("./footer4.js") }), `../lang/${locale}/${namespace}.json`, 4);
    const data = translations2.default || translations2;
    translationCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}, namespace: ${namespace}`, error);
    if (locale !== Locale.Id) {
      return loadTranslations(Locale.Id, namespace);
    }
    return {};
  }
}
const translations = derived(
  localeStore,
  ($localeStore, set) => {
    loadTranslations($localeStore.current, "common").then(set);
  },
  {}
);
function t(key, fallback, variables) {
  let currentTranslations = {};
  const unsubscribe = translations.subscribe((value) => {
    currentTranslations = value;
  });
  unsubscribe();
  const keys = key.split(".");
  let result = currentTranslations;
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      const fallbackText = key;
      return interpolateVariables(fallbackText, variables);
    }
  }
  const finalText = typeof result === "string" ? result : key;
  return interpolateVariables(finalText, variables);
}
const createTranslationStore = (namespace = "common") => {
  const namespacedTranslations = derived(
    localeStore,
    ($localeStore, set) => {
      loadTranslations($localeStore.current, namespace).then(set);
    },
    {}
  );
  return derived(namespacedTranslations, ($translations) => {
    return (key, fallback, variables) => {
      const keys = key.split(".");
      let result = $translations;
      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          const fallbackValue = fallback || key;
          return typeof fallbackValue === "string" ? interpolateVariables(fallbackValue, variables) : fallbackValue;
        }
      }
      const finalResult = result !== void 0 ? result : fallback || key;
      return typeof finalResult === "string" ? interpolateVariables(finalResult, variables) : finalResult;
    };
  });
};
export {
  createTranslationStore as c,
  localeStore as l,
  t
};
