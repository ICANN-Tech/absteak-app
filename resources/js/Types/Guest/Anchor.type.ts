import type { SvelteComponent } from 'svelte';

export type ComponentType = new (...args: any) => SvelteComponent;

export interface Anchor {
	id: string;
	name: string;
	component: ComponentType;
}

export type Anchors = Anchor[];