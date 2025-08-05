import * as universal from '../entries/pages/about/_page.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/about/+page.ts";
export const imports = ["_app/immutable/nodes/3.CjtuH7vI.js","_app/immutable/chunks/JtA6q3B1.js","_app/immutable/chunks/BgF9hfIK.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/B3V41-UI.js","_app/immutable/chunks/CWSnUQ51.js"];
export const stylesheets = [];
export const fonts = [];
