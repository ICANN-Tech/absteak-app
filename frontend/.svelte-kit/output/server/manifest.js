export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","assets/.DS_Store","assets/chat_bot_bg.png","assets/images/img_chef.webp","assets/images/logo.png","assets/images/logo_white.png","assets/images/preview/img_prev_1.webp","assets/images/preview/img_prev_10.webp","assets/images/preview/img_prev_11.webp","assets/images/preview/img_prev_12.webp","assets/images/preview/img_prev_2.webp","assets/images/preview/img_prev_3.webp","assets/images/preview/img_prev_4.webp","assets/images/preview/img_prev_5.webp","assets/images/preview/img_prev_6.webp","assets/images/preview/img_prev_7.webp","assets/images/preview/img_prev_8.webp","assets/images/preview/img_prev_9.webp","assets/thumbnail.webp","assets/videos/.DS_Store","assets/videos/highlight.webm","assets/videos/old-highlight.webm","favicon.svg","robots.txt"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".webm":"video/webm",".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.1dnQ_4Gk.js",app:"_app/immutable/entry/app.Dqta_9cC.js",imports:["_app/immutable/entry/start.1dnQ_4Gk.js","_app/immutable/chunks/yiZ6UGiy.js","_app/immutable/chunks/D_LtSI_F.js","_app/immutable/chunks/BgF9hfIK.js","_app/immutable/chunks/D1J1bf83.js","_app/immutable/chunks/CBjSQ69Q.js","_app/immutable/chunks/CWSnUQ51.js","_app/immutable/chunks/Q8GXTKRc.js","_app/immutable/entry/app.Dqta_9cC.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/uaZzQODc.js","_app/immutable/chunks/BgF9hfIK.js","_app/immutable/chunks/D1J1bf83.js","_app/immutable/chunks/CBjSQ69Q.js","_app/immutable/chunks/CWSnUQ51.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/D_LtSI_F.js","_app/immutable/chunks/Q8GXTKRc.js","_app/immutable/chunks/BHrthkl3.js","_app/immutable/chunks/DrCq3Trj.js","_app/immutable/chunks/BuTlKMBs.js","_app/immutable/chunks/G8-6NwSg.js","_app/immutable/chunks/0A1qBzho.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js'))
		],
		routes: [
			{
				id: "/demo",
				pattern: /^\/demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/demo/paraglide",
				pattern: /^\/demo\/paraglide\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/demo/payment",
				pattern: /^\/demo\/payment\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/form-demo",
				pattern: /^\/form-demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/hero-examples",
				pattern: /^\/hero-examples\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/icons-demo",
				pattern: /^\/icons-demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/modal-test",
				pattern: /^\/modal-test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/receipt-demo",
				pattern: /^\/receipt-demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/sverdle",
				pattern: /^\/sverdle\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/toast-demo",
				pattern: /^\/toast-demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/translation-demo",
				pattern: /^\/translation-demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			}
		],
		prerendered_routes: new Set(["/","/about","/sverdle/how-to-play"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
