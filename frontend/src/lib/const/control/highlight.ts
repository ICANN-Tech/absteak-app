import { HighlightId, SectionId } from "$lib/enums";
import type { Highlights } from "$lib/types/highlight.type";

export const highlights: Highlights = [
    {
        id: HighlightId.VideoHighlight,
        name: 'Video Highlight',
        sectionId: SectionId.VideoHighlight
    },
    {
        id: HighlightId.Experience,
        name: 'Experience',
        sectionId: SectionId.Experience
    },
    {
        id: HighlightId.Chef,
        name: 'Chef',
        sectionId: SectionId.Chef
    },
    {
        id: HighlightId.Menu,
        name: 'Menu',
        sectionId: SectionId.Menu
    },
    {
        id: HighlightId.Booking,
        name: 'Reservation',
        sectionId: SectionId.Booking
    }
];