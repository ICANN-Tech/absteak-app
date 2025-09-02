// Re-export the base MenuItem from global types
export type { MenuItem as BaseMenuItem, MenuCategory } from '$lib/types/menu.type';

export interface MenuItemNutrition {
	calories: number;
	protein: string;
	carbs: string;
	fat: string;
}

// Extended MenuItem with additional properties for detailed modal
export interface DetailMenuItem {
	name: string;
	desc: string;
	price: string;
	img: string;
	category?: string;
	ingredients?: string[];
	allergens?: string[];
	nutritionInfo?: MenuItemNutrition;
}

export interface DetailModalData {
	item: DetailMenuItem;
	title?: string;
	content?: string;
}

export interface DetailModalEvents {
	open: void;
	close: void;
	modalOpened: void;
	modalClosed: void;
}

export interface DetailModalProps {
	show?: boolean;
	modalItem?: DetailMenuItem | null;
	closeOnBackdrop?: boolean;
	closeOnEscape?: boolean;
	animationDuration?: number;
}