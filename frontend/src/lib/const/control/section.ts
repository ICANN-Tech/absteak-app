import type { Sections } from "$lib/types";
import { SectionId } from "$lib/enums";

export const sections: Sections = [
	{
		id: SectionId.Hero,
		name: 'Hero',
		component: null as any // Will be loaded lazily
	},
	{
		id: SectionId.VideoHighlight,
		name: 'About',
		component: null as any // Will be loaded lazily
	},
	{
		id: SectionId.Experience,
		name: 'Story',
		component: null as any // Will be loaded lazily
	},
	{
		id: SectionId.Chef,
		name: 'Chef',
		component: null as any // Will be loaded lazily
	},
	{
		id: SectionId.Menu,
		name: 'Menu',
		component: null as any // Will be loaded lazily
	},
	{
		id: SectionId.Booking,
		name: 'Reserve',
		component: null as any // Will be loaded lazily
	},
    {
        id: SectionId.Footer,
        name: 'Footer',
        component: null as any // Will be loaded lazily
    }
];