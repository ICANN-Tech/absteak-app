import type { Sections } from "@Types/Guest/Section.type";
import { SectionEnum } from "../../../Enums/Guest/Section";

// Import section components
import HeroSection from "../../../Modules/Guest/Hero/Index.svelte";
import VideoHighlightSection from "../../../Modules/Guest/VideoHighlight/Index.svelte";
import ExperienceSection from "../../../Modules/Guest/OurExperience/Index.svelte";
import ChefSection from "../../../Modules/Guest/OurChef/Index.svelte";
import MenuSection from "../../../Modules/Guest/Menu/Index.svelte";
import ReservationSection from "../../../Modules/Guest/Reservation/Index.svelte";
import FooterSection from "../../../Modules/Guest/Footer/Index.svelte";

export const sections: Sections = [
	{
		id: SectionEnum.Hero,
		name: 'Hero',
		component: HeroSection
	},
	{
		id: SectionEnum.VideoHighlight,
		name: 'About',
		component: VideoHighlightSection
	},
	{
		id: SectionEnum.Experience,
		name: 'Story',
		component: ExperienceSection
	},
	{
		id: SectionEnum.Chef,
		name: 'Chef',
		component: ChefSection
	},
	{
		id: SectionEnum.Menu,
		name: 'Menu',
		component: MenuSection
	},
	{
		id: SectionEnum.Booking,
		name: 'Reserve',
		component: ReservationSection
	},
    {
        id: SectionEnum.Footer,
        name: 'Footer',
        component: FooterSection
    }
];