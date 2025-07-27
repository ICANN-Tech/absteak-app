import type { SvelteComponent } from 'svelte';

export type ComponentType = new (...args: any) => SvelteComponent;

export interface Section {
	id: string;
	name: string;
	component: ComponentType;
}

export type Sections = Section[];