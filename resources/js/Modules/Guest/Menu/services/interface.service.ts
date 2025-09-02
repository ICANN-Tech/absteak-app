import { get } from 'svelte/store';
import { 
	activeCategory, 
	menuCategories, 
	isLoading, 
	error, 
	animationStates, 
	uiPreferences,
	menuInterfaceActions
} from '../stores/interface';
import type { BaseMenuItem, DetailMenuItem, MenuCategory } from '../types/menu.type';

/**
 * Menu Interface Service
 * Provides centralized management for menu UI interactions
 */
export class InterfaceService {
/**
 * Get menu items for the currently selected category
 */
static getMenuItems(): BaseMenuItem[] {
    const currentCategory = this.getCurrentCategory();
    if (!currentCategory) {
        return [];
    }
    return currentCategory.items;
}

/**
 * Get menu items by category index
 */
static getMenuItemsByCategory(categoryIndex: number): BaseMenuItem[] {
    const category = this.getCategoryByIndex(categoryIndex);
    if (!category) {
        return [];
    }
    return category.items;
}

	/**
	 * Select a category by index with validation and animation
	 */
	static selectCategory(index: number): boolean {
		try {
			const categories = get(menuCategories);
			const currentActive = get(activeCategory);
			
			// Validate index
			if (!categories || categories.length === 0) {
				console.warn('No categories available');
				return false;
			}
			
			if (index < 0 || index >= categories.length) {
				console.warn(`Invalid category index: ${index}. Available: 0-${categories.length - 1}`);
				return false;
			}
			
			// Don't change if already active
			if (currentActive === index) {
				return true;
			}
			
			// Set loading state during transition
			menuInterfaceActions.setLoading(true);
			
			// Clear any existing errors
			menuInterfaceActions.clearError();
			
			// Trigger category change with animations
			menuInterfaceActions.setActiveCategory(index);
			
			// Clear loading state after animation
			setTimeout(() => {
				menuInterfaceActions.setLoading(false);
			}, 300);
			
			console.log(`Category changed to: ${categories[index].category} (index: ${index})`);
			return true;
		} catch (err) {
			console.error('Error selecting category:', err);
			menuInterfaceActions.setError('Failed to select category');
			menuInterfaceActions.setLoading(false);
			return false;
		}
	}
	
	/**
	 * Get current active category
	 */
	static getCurrentCategory(): MenuCategory | null {
		const categories = get(menuCategories);
		const activeIndex = get(activeCategory);
		
		if (!categories || categories.length === 0 || activeIndex < 0 || activeIndex >= categories.length) {
			return null;
		}
		
		return categories[activeIndex];
	}
	
	/**
	 * Get category by index
	 */
	static getCategoryByIndex(index: number): MenuCategory | null {
		const categories = get(menuCategories);
		
		if (!categories || categories.length === 0 || index < 0 || index >= categories.length) {
			return null;
		}
		
		return categories[index];
	}
	
	/**
	 * Navigate to next category
	 */
	static nextCategory(): boolean {
		const categories = get(menuCategories);
		const currentIndex = get(activeCategory);
		
		if (!categories || categories.length === 0) {
			return false;
		}
		
		const nextIndex = (currentIndex + 1) % categories.length;
		return this.selectCategory(nextIndex);
	}
	
	/**
	 * Navigate to previous category
	 */
	static previousCategory(): boolean {
		const categories = get(menuCategories);
		const currentIndex = get(activeCategory);
		
		if (!categories || categories.length === 0) {
			return false;
		}
		
		const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
		return this.selectCategory(prevIndex);
	}
	
	/**
	 * Reset interface to initial state
	 */
	static reset(): void {
		menuInterfaceActions.reset();
		console.log('Menu interface reset to initial state');
	}
	
	/**
	 * Update UI preferences
	 */
	static updatePreferences(preferences: Partial<{
		showNutritionInfo: boolean;
		showIngredients: boolean;
		showAllergens: boolean;
		animationDuration: number;
		autoScrollToTop: boolean;
	}>): void {
		uiPreferences.update(current => ({
			...current,
			...preferences
		}));
		console.log('UI preferences updated:', preferences);
	}
	
	/**
	 * Create enhanced menu item for detail modal
	 */
	static createDetailMenuItem(item: BaseMenuItem, categoryName?: string): DetailMenuItem {
		const currentCategory = categoryName || this.getCurrentCategory()?.category || 'Unknown';
		return menuInterfaceActions.createDetailMenuItem(item, currentCategory);
	}
	
	/**
	 * Get interface state snapshot
	 */
	static getState() {
		return {
			activeCategory: get(activeCategory),
			isLoading: get(isLoading),
			error: get(error),
			animationStates: get(animationStates),
			uiPreferences: get(uiPreferences),
			categories: get(menuCategories),
			currentCategory: this.getCurrentCategory()
		};
	}
	
	/**
	 * Check if category transition is in progress
	 */
	static isTransitioning(): boolean {
		const animations = get(animationStates);
		return animations.categoryTransition || animations.backgroundTransition;
	}
	
	/**
	 * Wait for transition to complete
	 */
	static async waitForTransition(): Promise<void> {
		return new Promise((resolve) => {
			const checkTransition = () => {
				if (!this.isTransitioning()) {
					resolve();
				} else {
					setTimeout(checkTransition, 50);
				}
			};
			checkTransition();
		});
	}
	
	/**
	 * Keyboard navigation handler
	 */
	static handleKeyboardNavigation(event: KeyboardEvent): boolean {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				return this.previousCategory();
			case 'ArrowRight':
				event.preventDefault();
				return this.nextCategory();
			case 'Home':
				event.preventDefault();
				return this.selectCategory(0);
			case 'End':
				event.preventDefault();
				const categories = get(menuCategories);
				return this.selectCategory(categories.length - 1);
			default:
				return false;
		}
	}
	
	/**
	 * Validate menu data integrity
	 */
	static validateMenuData(): boolean {
		const categories = get(menuCategories);
		
		if (!categories || !Array.isArray(categories) || categories.length === 0) {
			menuInterfaceActions.setError('No menu categories available');
			return false;
		}
		
		for (let i = 0; i < categories.length; i++) {
			const category = categories[i];
			if (!category.category || !Array.isArray(category.items)) {
				menuInterfaceActions.setError(`Invalid category data at index ${i}`);
				return false;
			}
		}
		
		menuInterfaceActions.clearError();
		return true;
	}
}

export const itemInterface = {
    getMenuItems: InterfaceService.getMenuItems.bind(InterfaceService),
    getMenuItemsByCategory: InterfaceService.getMenuItemsByCategory.bind(InterfaceService),
}

export const categoryInterface = {
	selectCategory: InterfaceService.selectCategory.bind(InterfaceService),
	getCurrentCategory: InterfaceService.getCurrentCategory.bind(InterfaceService),
	nextCategory: InterfaceService.nextCategory.bind(InterfaceService),
	previousCategory: InterfaceService.previousCategory.bind(InterfaceService),
	reset: InterfaceService.reset.bind(InterfaceService),
	getState: InterfaceService.getState.bind(InterfaceService),
	handleKeyboard: InterfaceService.handleKeyboardNavigation.bind(InterfaceService),
	validate: InterfaceService.validateMenuData.bind(InterfaceService)
}

export default InterfaceService;