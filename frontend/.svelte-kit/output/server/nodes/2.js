import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.Ch3Z0j81.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/B3V41-UI.js","_app/immutable/chunks/BgF9hfIK.js","_app/immutable/chunks/D_LtSI_F.js","_app/immutable/chunks/D1J1bf83.js","_app/immutable/chunks/CBjSQ69Q.js","_app/immutable/chunks/CWSnUQ51.js","_app/immutable/chunks/Q8GXTKRc.js","_app/immutable/chunks/BHrthkl3.js","_app/immutable/chunks/U8OjDNkE.js","_app/immutable/chunks/DrCq3Trj.js","_app/immutable/chunks/pyrgDTSW.js","_app/immutable/chunks/CNq5NpZJ.js","_app/immutable/chunks/C6K8dij2.js","_app/immutable/chunks/0A1qBzho.js","_app/immutable/chunks/NP3t9Vfi.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/1mjPclRo.js","_app/immutable/chunks/BxFKEXcv.js"];
export const stylesheets = ["_app/immutable/assets/2.BXbmtm2D.css"];
export const fonts = [];
