import type { Anchors } from '$lib/types/anchor.type';

// Import components with different aliases to avoid naming conflicts
import Hero from '$lib/components/organisms/section/hero/Index.svelte';
import VideoHighlight from '$lib/components/organisms/section/video-highlight/Index.svelte';
import Experience from '$lib/components/organisms/section/experience/Index.svelte';
import Chef from '$lib/components/organisms/section/chef/Index.svelte';
import Menu from '$lib/components/organisms/section/menu/Index.svelte';
import Booking from '$lib/components/organisms/section/reservation/Index.svelte';

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