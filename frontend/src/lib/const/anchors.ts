import type { Anchors } from '$lib/types/anchor.type';

// Import components with different aliases to avoid naming conflicts
import Hero from '$lib/modules/hero/Index.svelte';
import VideoHighlight from '$lib/modules/video-highlight/Index.svelte';
import Experience from '$lib/modules/experience/Index.svelte';
import Chef from '$lib/modules/chef/Index.svelte';
import Menu from '$lib/modules/menu/Index.svelte';
import Booking from '$lib/modules/reservation/Index.svelte';

export const anchors: Anchors = [
	{
		id: 'hero',
		name: 'Hero',
		component: Hero
	},
	{
		id: 'video-highlight',
		name: 'About',
		component: VideoHighlight
	},
	{
		id: 'experience',
		name: 'Story',
		component: Experience
	},
	{
		id: 'chef',
		name: 'Chef',
		component: Chef
	},
	{
		id: 'menu',
		name: 'Menu',
		component: Menu
	},
	{
		id: 'booking',
		name: 'Reserve',
		component: Booking
	}
];