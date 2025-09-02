import { HighlightEnum, SectionEnum } from "../../Enums/Guest";

export interface Highlight {
    id: HighlightEnum;
    name: string;
    sectionId: SectionEnum;
}

export type Highlights = Highlight[];