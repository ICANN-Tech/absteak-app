<script lang="ts">
	import { CHATBOT_CONFIG, CSS_CLASSES } from '../Const/Chatbot.const';
	import { activeMenu } from '../Stores/Chat.store';
import { csStatusMessage, isCSActive, csConnectionState } from '../Stores/CustomerService.store';

	// Props
	export let customMenuItems = [...CHATBOT_CONFIG.DEFAULT_MENU_ITEMS];
  export let loading = false;
  export let disabled = false;
	export let onSelectMenu: (menu: string) => void;

	// Reactive store values - directly from stores
	$: currentActiveMenu = $activeMenu;
	$: currentCSStatusMessage = $csStatusMessage;
	$: isCSCurrentlyActive = $isCSActive;
	$: currentCSConnectionState = $csConnectionState;
	
	// DEBUG: Log semua perubahan state
	$: {
		console.log('🔍 [BadgeMenu] State Update:', {
			isCSCurrentlyActive,
			currentCSConnectionState,
			currentActiveMenu,
			currentCSStatusMessage
		});
	}
	
	// Force reactivity untuk memastikan UI update langsung
	let forceUpdate = 0;
	$: {
		// Trigger re-render saat CS state berubah
		if (isCSCurrentlyActive || currentCSConnectionState) {
			forceUpdate++;
			console.log('🔄 [BadgeMenu] Force update triggered:', forceUpdate);
		}
	}



	// Handle menu button click - delegate to parent handler
	function handleMenuClick(menuItem: string) {
		console.log('🔥 [BadgeMenu] handleMenuClick called:', {
			menuItem,
			currentCSConnectionState,
			isCSCurrentlyActive
		});
		
		// Call parent handler - CS logic handled in Selector.util.ts
		onSelectMenu(menuItem);
		console.log('✅ [BadgeMenu] handleMenuClick completed for:', menuItem);
	}

	// Check if a menu item should be disabled
	function isMenuItemDisabled(menuItem: string): boolean {
		console.log('🧪 [BadgeMenu] isMenuItemDisabled called for:', menuItem, {
			isCSCurrentlyActive,
			loading,
			disabled,
			currentCSConnectionState
		});
		
		// Disable Menu, Dine In, dan Dine Out saat CS mode aktif
		if (isCSCurrentlyActive && (menuItem === 'Menu' || menuItem === 'Dine In' || menuItem === 'Dine Out')) {
			console.log('🚫 [BadgeMenu] Disabling', menuItem, 'because CS is active');
			return true;
		}
		
		// Tombol CS hanya disabled jika loading atau disabled eksplisit
		if (menuItem === 'CS') {
			const csDisabled = loading || disabled;
			console.log('🎛️ [BadgeMenu] CS button disabled?', csDisabled, { loading, disabled });
			return csDisabled;
		}
		
		// Tombol lain menggunakan logic normal
		const normalDisabled = loading || disabled;
		console.log('⚙️ [BadgeMenu] Normal button', menuItem, 'disabled?', normalDisabled);
		return normalDisabled;
	}

	// Get button classes for each menu item
	function getButtonClasses(menuItem: string): string {
		const isActive = currentActiveMenu === menuItem;
		const isDisabled = isMenuItemDisabled(menuItem);
		const isDisabledByCS = isCSCurrentlyActive && (menuItem === 'Menu' || menuItem === 'Dine In' || menuItem === 'Dine Out');
		
		console.log('🎨 [BadgeMenu] getButtonClasses for:', menuItem, {
			isActive,
			isDisabled,
			isDisabledByCS,
			isCSCurrentlyActive,
			currentCSConnectionState
		});
		
		const baseButtonClasses = `${CSS_CLASSES.MENU_BUTTON_BASE}`;
		
		// Special styling for CS button when disconnected (after end chat)
		if (menuItem === 'CS' && currentCSConnectionState === 'disconnected') {
			console.log('🔄 [BadgeMenu] Applying disconnected style for CS button');
			// Style seperti awal dialog terbuka (tidak aktif, tidak berwarna)
			return `${baseButtonClasses} bg-white text-primary-600 border border-primary-200 opacity-80`;
		}
		
		if (isDisabled) {
			if (isDisabledByCS) {
				console.log('🔴 [BadgeMenu] Applying RED disabled style for:', menuItem);
				// Warna khusus untuk tombol yang disabled karena CS aktif
				return `${baseButtonClasses} bg-red-100 text-red-400 border border-red-200 opacity-70 cursor-not-allowed`;
			} else {
				console.log('⚪ [BadgeMenu] Applying GRAY disabled style for:', menuItem);
				// Warna normal untuk disabled
				return `${baseButtonClasses} bg-gray-200 text-gray-400 border border-gray-200 opacity-60 cursor-not-allowed`;
			}
		}
		
		console.log('✨ [BadgeMenu] Applying normal style for:', menuItem);
		return `${baseButtonClasses} ${
			isActive
				? 'bg-primary-500 text-white shadow-md'
				: 'bg-white text-primary-600 border border-primary-200'
		}`;
	}
	
	function getButtonText(menuItem: string): string {
		if (menuItem === 'CS') {
			// Use the reactive variable to ensure UI updates
			return currentCSStatusMessage || 'Customer Service';
		}
		return menuItem;
	}
</script>

{#if customMenuItems.length > 0}
	<div class="bg-primary-50 border-primary-100 border-b px-4 py-3">
		<div class="grid grid-cols-{customMenuItems.length} gap-2">
			{#each customMenuItems as menuItem (`${menuItem}-${forceUpdate}-${isCSCurrentlyActive}-${currentCSConnectionState}`)}
				<button
					class={getButtonClasses(menuItem)}
					on:click={() => handleMenuClick(menuItem)}
					disabled={isMenuItemDisabled(menuItem)}
					aria-pressed={currentActiveMenu === menuItem}
				>
					{getButtonText(menuItem)}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Enhanced smooth transitions */
	.transition-all {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Menu button hover effects */
	button:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	/* Enhanced focus states */
	button:focus {
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
</style>