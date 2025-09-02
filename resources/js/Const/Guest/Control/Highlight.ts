import { HighlightEnum } from "../../../Enums/Guest/Highlight";
import { SectionEnum } from "../../../Enums/Guest/Section";
import type { Highlights } from "../../../Types/Guest/Highlight.type";

export const highlights: Highlights = [
    {
        id: HighlightEnum.VideoHighlight,
        name: 'Video Highlight',
        sectionId: SectionEnum.VideoHighlight
    },
    {
        id: HighlightEnum.Experience,
        name: 'Experience',
        sectionId: SectionEnum.Experience
    },
    {
        id: HighlightEnum.Chef,
        name: 'Chef',
        sectionId: SectionEnum.Chef
    },
    {
        id: HighlightEnum.Menu,
        name: 'Menu',
        sectionId: SectionEnum.Menu
    },
    {
        id: HighlightEnum.Booking,
        name: 'Reservation',
        sectionId: SectionEnum.Booking
    }
];