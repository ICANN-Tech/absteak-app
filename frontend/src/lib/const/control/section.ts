import type { Sections } from "$lib/types";

import Hero from '$lib/components/Hero.svelte';
import VideoHighlight from '$lib/components/organisms/section/video-highlight/Index.svelte';
import Experience from '$lib/components/organisms/section/experience/Index.svelte';
import Chef from '$lib/components/organisms/section/chef/Index.svelte';
import Menu from '$lib/components/organisms/section/menu/Index.svelte';
import Booking from '$lib/components/organisms/section/booking/Index.svelte';
import Footer from '$lib/components/organisms/section/footer/Index.svelte';

export enum SectionId {
    Hero = 'hero',
    VideoHighlight = 'video-highlight',
    Experience = 'experience',
    Chef = 'chef',
    Menu = 'menu',
    Booking = 'booking',
    Footer = 'footer'
}

export const sections: Sections = [
	{
		id: SectionId.Hero,
		name: 'Hero',
		component: Hero
	},
	{
		id: SectionId.VideoHighlight,
		name: 'About',
		component: VideoHighlight
	},
	{
		id: SectionId.Experience,
		name: 'Story',
		component: Experience
	},
	{
		id: SectionId.Chef,
		name: 'Chef',
		component: Chef
	},
	{
		id: SectionId.Menu,
		name: 'Menu',
		component: Menu
	},
	{
		id: SectionId.Booking,
		name: 'Reserve',
		component: Booking
	},
    {
        id: SectionId.Footer,
        name: 'Footer',
        component: Footer
    }
];