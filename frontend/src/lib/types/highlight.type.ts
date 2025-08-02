import type { HighlightId, SectionId } from '$lib/enums';

export interface Highlight {
    id: HighlightId;
    name: string;
    sectionId: SectionId;
}

export type Highlights = Highlight[];