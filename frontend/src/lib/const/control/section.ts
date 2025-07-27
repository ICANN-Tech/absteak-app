import type { Sections } from "$lib/types";

import Hero from '$lib/components/Hero.svelte';
import VideoHighlight from '$lib/components/organisms/section/video-highlight/Index.svelte';
import Experience from '$lib/components/organisms/section/experience/Index.svelte';
import Chef from '$lib/components/organisms/section/chef/Index.svelte';
import Menu from '$lib/components/organisms/section/menu/Index.svelte';
import Booking from '$lib/components/organisms/section/booking/Index.svelte';
import Footer from '$lib/components/organisms/section/footer/Index.svelte';

export const sections: Sections = [
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
	},
    {
        id: 'footer',
        name: 'Footer',
        component: Footer
    }
];