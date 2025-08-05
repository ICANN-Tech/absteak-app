import * as server from '../entries/pages/sverdle/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/sverdle/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.uC2wkTwW.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BgF9hfIK.js","_app/immutable/chunks/D1J1bf83.js","_app/immutable/chunks/CBjSQ69Q.js","_app/immutable/chunks/CWSnUQ51.js","_app/immutable/chunks/BHrthkl3.js","_app/immutable/chunks/U8OjDNkE.js","_app/immutable/chunks/DfWigeBc.js","_app/immutable/chunks/pyrgDTSW.js","_app/immutable/chunks/CNq5NpZJ.js","_app/immutable/chunks/G8-6NwSg.js","_app/immutable/chunks/0A1qBzho.js","_app/immutable/chunks/yiZ6UGiy.js","_app/immutable/chunks/D_LtSI_F.js","_app/immutable/chunks/Q8GXTKRc.js"];
export const stylesheets = ["_app/immutable/assets/12.yeGN9jlM.css"];
export const fonts = [];
