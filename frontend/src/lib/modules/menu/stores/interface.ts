import { writable, derived, type Readable } from 'svelte/store';
import type { MenuCategory, BaseMenuItem, DetailMenuItem } from '../types/menu.type';
import type { CategoryImages } from '$lib/types';
import { createTranslationStore } from '$lib/utils/translation';
import { BACKGROUNDS } from '../consts/background.const';

// ===== INTERFACE STATE =====

/**
 * Active category index for menu navigation
 */
export const activeCategory = writable<number>(0);

/**
 * Loading state for menu data
 */
export const isLoading = writable<boolean>(false);

/**
 * Error state for menu operations
 */
export const error = writable<string | null>(null);

/**
 * Animation states for UI transitions
 */
export const animationStates = writable({
	categoryTransition: false,
	itemsTransition: false,
	backgroundTransition: false
});

/**
 * UI preferences and settings
 */
export const uiPreferences = writable({
	showNutritionInfo: true,
	showIngredients: true,
	showAllergens: true,
	animationDuration: 400,
	autoScrollToTop: true
});

// ===== MENU DATA =====

/**
 * Fallback menu categories when translation is not available
 */
const fallbackMenuCategories: MenuCategory[] = [
	{
		category: 'Appetizer',
		items: [
			{
				name: 'Wagyu Beef Tartare',
				desc: 'Wagyu segar dipotong tangan dengan telur puyuh dan minyak truffle',
				price: 'Rp 380.000',
				img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Foie Gras Pan-Seared',
				desc: 'Disajikan dengan apel karamel dan reduksi wine port',
				price: 'Rp 420.000',
				img: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Tuna Sashimi Premium',
				desc: 'Tuna bluefin segar dengan wasabi dan jahe acar',
				price: 'Rp 320.000',
				img: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Lobster Bisque',
				desc: 'Sup lobster kaya dan creamy dengan sentuhan cognac',
				price: 'Rp 280.000',
				img: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'
			}
		]
	},
	{
		category: 'Steak Premium',
		items: [
			{
				name: 'Dry-Aged Ribeye A5',
				desc: 'Ribeye premium aged 28 hari dengan bone marrow panggang',
				price: 'Rp 980.000',
				img: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Wagyu Tenderloin',
				desc: 'Tenderloin wagyu dengan saus truffle dan kentang fondant',
				price: 'Rp 1.200.000',
				img: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Tomahawk Steak',
				desc: 'Steak tomahawk 800gr dengan herb butter dan sayuran panggang',
				price: 'Rp 1.500.000',
				img: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Surf & Turf',
				desc: 'Kombinasi steak tenderloin dan lobster thermidor',
				price: 'Rp 1.800.000',
				img: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400'
			}
		]
	},
	{
		category: 'Dessert',
		items: [
			{
				name: 'Chocolate Soufflé',
				desc: 'Soufflé cokelat hitam dengan es krim vanilla',
				price: 'Rp 180.000',
				img: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Crème Brûlée',
				desc: 'Custard vanilla klasik dengan gula karamel',
				price: 'Rp 160.000',
				img: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400'
			},
			{
				name: 'Tiramisu Premium',
				desc: 'Tiramisu Italia tradisional dengan espresso dan mascarpone',
				price: 'Rp 170.000',
				img: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400'
			}
		]
	}
];

/**
 * Category images for the right container
 */
export const categoryImages: Record<number, CategoryImages> = {
	0: {
		// Starters
		leftColumn: [
			'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400'
		],
		rightColumn: [
			'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400'
		]
	},
	1: {
		// Mains
		leftColumn: [
			'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
		],
		rightColumn: [
			'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
		]
	},
	2: {
		// Desserts
		leftColumn: [
			'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400'
		],
		rightColumn: [
			'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
			'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400'
		]
	}
};

/**
 * Heights for image variations in scrollable columns
 */
export const imageHeights = {
	leftColumn: ['h-48', 'h-72', 'h-56', 'h-80', 'h-64', 'h-60'],
	rightColumn: ['h-64', 'h-52', 'h-76', 'h-68', 'h-56', 'h-72']
};

// ===== DERIVED STORES =====

/**
 * Translation store for menu content
 */
const translationStore = createTranslationStore();

/**
 * Menu categories with translation support
 */
export const menuCategories: Readable<MenuCategory[]> = derived(
	[translationStore],
	([$t]) => {
		const translatedCategories = $t('menu.categories');
		if (Array.isArray(translatedCategories) && translatedCategories.length > 0) {
			return translatedCategories.map((category: any, categoryIndex: number) => ({
				category: category.name,
				items: Array.isArray(category.items)
					? category.items.map((item: any, itemIndex: number) => ({
							name: item.name,
							desc: item.description,
							price: item.price,
							img:
								fallbackMenuCategories[categoryIndex]?.items[itemIndex]?.img ||
								'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
						}))
					: []
			}));
		}
		return fallbackMenuCategories;
	}
);

/**
 * Currently selected category based on activeCategory index
 */
export const selectedCategory: Readable<MenuCategory> = derived(
	[menuCategories, activeCategory],
	([$menuCategories, $activeCategory]) => {
		return $menuCategories && $menuCategories.length > 0
			? $menuCategories[$activeCategory] || $menuCategories[0]
			: {
					category: 'Loading...',
					items: []
				};
	}
);

/**
 * Current background image based on active category
 */
export const currentBackground: Readable<string> = derived(
	[activeCategory],
	([$activeCategory]) => {
		return BACKGROUNDS[$activeCategory] || 
			   BACKGROUNDS[0] || 
			   'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920';
	}
);

/**
 * Current category images for the right container
 */
export const currentCategoryImages: Readable<CategoryImages> = derived(
	[activeCategory],
	([$activeCategory]) => {
		return categoryImages[$activeCategory] || {
			leftColumn: [
				'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
			],
			rightColumn: [
				'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
			]
		};
	}
);

/**
 * Menu interface state summary
 */
export const interfaceState: Readable<{
	activeCategory: number;
	isLoading: boolean;
	error: string | null;
	animationStates: any;
	uiPreferences: any;
}> = derived(
	[activeCategory, isLoading, error, animationStates, uiPreferences],
	([$activeCategory, $isLoading, $error, $animationStates, $uiPreferences]) => ({
		activeCategory: $activeCategory,
		isLoading: $isLoading,
		error: $error,
		animationStates: $animationStates,
		uiPreferences: $uiPreferences
	})
);

// ===== ACTIONS =====

/**
 * Menu interface actions
 */
export const menuInterfaceActions = {
	/**
	 * Set the active category
	 */
	setActiveCategory: (index: number) => {
		activeCategory.update((current) => {
			// Validate the index
			let categories: MenuCategory[] = [];
			menuCategories.subscribe(value => categories = value)();
			
			if (categories && categories.length > 0 && index >= 0 && index < categories.length) {
				// Set animation state
				animationStates.update(state => ({
					...state,
					categoryTransition: true,
					backgroundTransition: true
				}));

				// Clear animation state after transition
				setTimeout(() => {
					animationStates.update(state => ({
						...state,
						categoryTransition: false,
						backgroundTransition: false
					}));
				}, 600);

				return index;
			}
			return current;
		});
	},

	/**
	 * Set loading state
	 */
	setLoading: (loading: boolean) => {
		isLoading.set(loading);
	},

	/**
	 * Set error state
	 */
	setError: (errorMessage: string | null) => {
		error.set(errorMessage);
	},

	/**
	 * Clear error state
	 */
	clearError: () => {
		error.set(null);
	},

	/**
	 * Update UI preferences
	 */
	updatePreferences: (preferences: Partial<typeof uiPreferences>) => {
		uiPreferences.update(current => ({
			...current,
			...preferences
		}));
	},

	/**
	 * Reset interface to initial state
	 */
	reset: () => {
		activeCategory.set(0);
		isLoading.set(false);
		error.set(null);
		animationStates.set({
			categoryTransition: false,
			itemsTransition: false,
			backgroundTransition: false
		});
	},

	/**
	 * Create enhanced menu item for detail modal
	 */
	createDetailMenuItem: (item: BaseMenuItem, categoryName: string): DetailMenuItem => {
		return {
			...item,
			category: categoryName,
			ingredients: [], // Add if available in your data
			allergens: [], // Add if available in your data
			nutritionInfo: {
				calories: 0,
				protein: '0g',
				carbs: '0g',
				fat: '0g'
			} // Add if available in your data
		};
	}
};

// ===== UTILITIES =====

/**
 * Get menu interface store values synchronously
 */
export const getMenuInterfaceState = () => {
	let state: any = {};
	interfaceState.subscribe(value => state = value)();
	return state;
};

/**
 * Subscribe to specific interface changes
 */
export const subscribeToCategory = (callback: (category: number) => void) => {
	return activeCategory.subscribe(callback);
};

export const subscribeToSelectedCategory = (callback: (category: MenuCategory) => void) => {
	return selectedCategory.subscribe(callback);
};

export const subscribeToBackground = (callback: (background: string) => void) => {
	return currentBackground.subscribe(callback);
};