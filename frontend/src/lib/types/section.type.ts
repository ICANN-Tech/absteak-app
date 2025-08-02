import type { SectionId } from '$lib/enums';
import type { SvelteComponent } from 'svelte';

export type ComponentType = new (...args: any) => SvelteComponent;

export interface Section {
	id: SectionId;
	name: string;
	component: ComponentType;
}

export type Sections = Section[];